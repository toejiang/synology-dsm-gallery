import Ember from 'ember';
import Utils from '../utils/utils';
import {computed} from '@ember/object';

export default Ember.Component.extend({
  photo: Ember.inject.service('synology-photo'),
  phototag: Ember.inject.service('synology-phototag'),
  comment: Ember.inject.service('synology-comment'),

  classNames: ['gallery-image-info'],

  viewport: {
    width: 960,
    height: 480,
  },

  // ResizeSensor maybe not working if wrapping gallery-image-info component
  // with an element that is having style or class 'display:none;', so if you donot want to
  // display this component, just pass null to `show` property
  imageHeight: computed('show', 'viewport', function() {
    var {show, viewport} = this.getProperties(['show', 'viewport']);
    if(!show || !show.item) return 480;
    var size = 0,
      scaleW = (viewport.width < show.item.w) ? (show.item.w / viewport.width) : 1,
      scaleH = (viewport.height < show.item.h) ? (show.item.h / viewport.height) : 1,
      scale = Math.max(scaleW, scaleH),
      newW = show.item.w / scale,
      newH = show.item.h / scale;
    // if image is too narrow, re-compute width to 200
    if(newW < 400 && newW < show.item.w && newW < viewport.width) {
      newW = 400;
      scale = show.item.w / newW;
      newH = show.item.h / scale;
    }
    return newH;
  }),

  _tags: computed('show', function() {
    var show = this.get('show');
    return (show && show.item && show.site) ? this.gettags(show.site, {id: show.item.info.id}) : null;
  }),

  _comments: computed('show', function() {
    var show = this.get('show');
    return (show && show.item && show.site) ? this.getcomments(show.site, {id: show.item.info.id}) : null;
  }),

  _exifs: computed('show', function() {
    var show = this.get('show');
    return (show && show.item && show.site) ? this.getexif(show.site, {id: show.item.info.id}) : null;
  }),

  init() {
    this._super(...arguments);
    this.set('elementId', Utils.randomString());
    this.set('viewportId', Utils.randomString());
  },
  didInsertElement() {
    this._super(...arguments);
    this.set('sensor', this.createSensor()); // create and listen
  },
  willDestroyElement() {
    this._super(...arguments);
    var sensor = this.get('sensor');
    if(sensor && sensor.detach && typeof(sensor.detach)==='function')
      sensor.detach();
  },

  getexif(site, hash) {
    return this.get('photo').getexif(site, hash)
    .then((res) => {
      var j = {};
      if(res.data && res.data.exifs) {
        res.data.exifs.forEach((e) => {
          j[e.label] = e.value;
        });
      }

      var exif = {
        model: j['Model'] ? (j['Manufacturer'] + ' ' + j['Model']) : '',
        time: j['Date and Time'],
        exposure: j['Exposure'],
        aperture: j['Aperture'],
        focal: j['Focal Length'],
        iso: j['ISO Speed Ratings'],
        flash: j['Flash'],
        gps: j['GPS Latitude'] ? `${j['GPS Latitude Reference']} ${j['GPS Latitude']}, ` +
          `${j['GPS Longitude Reference']} ${j['GPS Longitude']}, ` +
          `${j['GPS Altitude']} ${j['GPS Altitude Reference']}` : null,
      }
      return {default: exif, all: res.data.exifs};
    });
  },

  gettags(site, hash) {
    return this.get('phototag').list(site, hash)
    .then((res) => {
      var result = {people:[],geo:[],desc:[]};
      res.data.tags.forEach((t) => {
        if(t.type === 'people') result.people.push(t);
        else if(t.type === 'geo') result.geo.push(t);
        else if(t.type === 'desc') result.desc.push(t);
      });
      return result;
    });
  },

  getcomments(site, hash) {
    return this.get('comment').list(site, hash).then(res=>res.data.comments);
  },

  createSensor() {
    var THIS = {
      component: this,
      delaying: false,
      element: this.$('#' + this.get('viewportId'))[0],
      last: {w: 900, h: 480},
      resizing: null,
      detach: null,
      newWH: null,
    };

    THIS.newWH = function newWH() {
      var h = this.component.$(window).height() - 100,
        w = this.element.clientWidth - 80;
      return {w,h};
    }.bind(THIS);

    THIS.resizing = function resizing() {
      let mark = this.newWH(), self = this;
      if((this.last.h === mark.h && this.last.w === mark.w) || this.delaying) return;
      this.delaying = true;
      var timer = setInterval(function() {
        var curr = self.newWH();
        if(mark.w === curr.w && mark.h === curr.h) {
          clearInterval(timer);
          self.delaying = false;
          self.last = curr;
          self.component.set('viewport', { width: curr.w, height: curr.h });
        }
        mark = curr;
      }, 100);
    }.bind(THIS);

    THIS.detach = function detach() {
      this.component.$(window).unbind('resize', this.resizing);
      if(this._sensor && this._sensor.detach && typeof(this._sensor.detach)==='function')
        this._sensor.detach(this.element, this.resizing);
    }.bind(THIS);

    this.$(window).bind('resize', THIS.resizing);
    THIS._sensor = new ResizeSensor(THIS.element, THIS.resizing);

    // call the init window resize
    THIS.resizing();

    return THIS;
  },
});
