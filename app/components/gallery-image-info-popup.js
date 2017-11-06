import Ember from 'ember';
import RSVP from 'rsvp';
import $ from 'jquery';

export default Ember.Component.extend({
  photo: Ember.inject.service('synology-photo'),
  phototag: Ember.inject.service('synology-phototag'),
  comment: Ember.inject.service('synology-comment'),

  showMoreEXIFs: false,
  showLargeImage: false,

  popupItem: {
    item: null,
    detail: null, // a promise that resolve with detail data
  },

  init() {
    this._super(...arguments);
    this.set('actions', {
      open: this.open.bind(this),
      getThumbBoundsFn: this.getThumbBoundsFn.bind(this),
      toggleShowMoreEXIFs: function() { this.toggleProperty('showMoreEXIFs'); }.bind(this),
      toggleShowLargeImage: function() { this.toggleProperty('showLargeImage'); }.bind(this),
    });
  },

  getThumbBoundsFn: function getThumbBoundsFn(index) {
    var items = this.get('items'),
      item = items ? items[index] : null,
      id = item ? item.info.id : 0,
      ele = this.$('#'+id),
      pos = ele ? ele.position() : {left:0,top:0},
      width = ele ? ele.width() : 0;
    return {x:pos.left, y:pos.top, w:width};
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

  open(hash) {
    var items = this.get('albumInfo.items'),
      site = this.get('albumInfo.site'),
      item = items[hash.index],
      curr = this.get('popupItem.item');
    if(curr && curr.info && item && item.info && (curr.info.id === item.info.id)) {
      return;
    }

    // build an array to make magnific-popup can change between slides,
    // we update the '#image-info-popup' by setting property 'popupItem', and ember will re-render 
    var popItems = [];
    items.forEach((i) => {
      popItems.push({type:'inline',src:'#'+this.get('popupId')});
    });

    // build the arg for magnific-popup
    var magnificArg = {
      items: popItems,
      gallery: {
        enabled: true,
      },
      callbacks: {
        open: function() {
          if(hash.open && typeof(hash.open) === 'function') {
            hash.open(item);
          }
        }.bind(this),
        close: function(arg) {
          this.set('showMoreEXIFs', false);
          this.set('showLargeImage', false);
          this.set('popupItem', {item:null,detail:null});
          if(hash.close && typeof(hash.close) === 'function') {
            hash.close(null);
          }
        }.bind(this),
        change: function(arg) {
          var toItem = this.get('albumInfo.items')[arg.index];
          // get the detail info and set to 'popupItem'
          this.set('popupItem', {
            item: toItem,
            detail: toItem.info.type === 'photo' ? {
              tag: this.gettags(site, {id: toItem.info.id}),
              exif: this.getexif(site, {id: toItem.info.id}), // like: {default:{}, all:[]}
              comments: this.get('comment').list(site, {id: toItem.info.id}).then(res=>res.data.comments),
            } : null,
          });
          if(hash.change && typeof(hash.change) === 'function') {
            hash.change(toItem);
          }
        }.bind(this),
      },
      removalDelay: 100,
      mainClass: 'my-mfp-slide-bottom',
    };

    // then open popup
    $.magnificPopup.open(magnificArg, hash.index);
  },
});
