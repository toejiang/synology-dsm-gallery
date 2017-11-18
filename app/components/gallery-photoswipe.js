import Component from '@ember/component';
import { computed } from '@ember/object';
import FitPhotoWall from '../utils/fit-photo-wall';
import Utils from '../utils/utils';
import RSVP from 'rsvp';

export default Component.extend({
  tagName: 'div',
  classNames: 'gallery-photoswipe-site-items',

  ui: Ember.inject.service('gallery-ui'),

  showHideOpacity: false,
  bgOpacity: 0.9,
  barsSize: {top:20, bottom:'auto'},
  itemProperties: ['src', 'w', 'h', 'msrc', 'html'],
  timeToIdle: 1200,

  additionalButtons: [
    {
      name:'detail',
      title:'Photo detail',
      option: 'closeEl',
      onTap: function onTap() {
        Ember.Logger.info('detail button taped');
      },
    },
  ],

  hidden: false,

  previewContainerWidth: 1300,

  computedAlbumInfo: computed('albumInfo', 'previewHeight', 'previewContainerWidth', function() {
    var albumInfo = this.get('albumInfo');
    // add fitsize property, so that we can call fitPhotoWall to set the rigth size
    albumInfo.items.forEach(item => {
      Ember.set(item, 'fitsize', {
        oriW: item.info.additional.thumb_size.small.resolutionx,
        oriH: item.info.additional.thumb_size.small.resolutiony,
      });
    });
    FitPhotoWall(albumInfo.items, {
      width: this.get('previewContainerWidth'),
      height: this.get('previewHeight'),
      margin: 4,
    });
    return albumInfo;
  }),

  init() {
    this._super(...arguments);
    this.set('resize-sensor-element-id', Utils.randomString());
    if(!this.get('previewHeight')) {
      this.set('previewHeight', computed('ui.previewHeight', ()=>this.get('ui.previewHeight')));
    }
  },

  didInsertElement() {
    this._super(...arguments);
    this.send('initContainerElementResize', this.get('resize-sensor-element-id'));
    this.send('resizing');
  },

  willDestroyElement() {
    this._super(...arguments);
    this.detachResizeSensor();
  },
  detachResizeSensor() {
    var sensor = this.get('sensor');
    if(sensor) {
      sensor.sensor.detach(sensor.func);
      this.set('sensor', null);
    }
  },

  actions: {
    getThumbBoundsFn: function getThumbBoundsFn(index) {
      var items = this.get('computedAlbumInfo.items'),
        item = items ? items[index] : null,
        id = item ? item.info.id : 0,
        ele = this.$('#'+id),
        pos = ele ? ele.offset() : {left:0,top:0},
        //ps = ele ? ele.position() : {left:0,top:0},
        width = ele ? ele.width() : 0;
      return {x:pos.left, y:pos.top, w:width};
    },

    onPhotoSwipeOpen(pswp) {
      var open = this.get('onLightboxOpen');
      if(open && typeof(open) === 'function')
        open(this.get('computedAlbumInfo.items')[pswp.getCurrentIndex()]);
    },

    onPhotoSwipeChange(pswp) {
      var change = this.get('onLightboxChange');
      if(change && typeof(change) === 'function')
        change(this.get('computedAlbumInfo.items')[pswp.getCurrentIndex()]);
    },

    onPhotoSwipeClose(pswp) {
      var close = this.get('onLightboxClose');
      if(close && typeof(close) === 'function')
        close(this.get('computedAlbumInfo.items')[pswp.getCurrentIndex()]);
    },

    lightbox(item) {
      this.get('photoswipe').actions.open({
        index: this.get('computedAlbumInfo.items').indexOf(item),
      });
    },

    detail(item) {
      var show = this.get('showDetail');
      if(show && typeof(show) === 'function')
        show(item);
      else
        this.send('popup', item);
    },

    popup(item) {
      this.get('popup').actions.open({
        index: this.get('computedAlbumInfo.items').indexOf(item),
        open: this.get('onDetailOpen'),
        close: this.get('onDetailClose'),
        change: this.get('onDetailChange'),
      });
    },

    initPototSwipe(photoswipe) {
      this.set('photoswipe', photoswipe);
      var lb = this.get('initWithLightboxOpen');
      if(lb) {
        var items = this.get('computedAlbumInfo.items'),
          item = !items ? null : items.find((i) => {
          return i.info.id.endsWith(lb);
        });
        if(item) {
          //this.set('initWithLightboxOpen', null);
          this.actions.lightbox.bind(this)(item);
        }
      }
    },

    initPopup(popup) {
      this.set('popup', popup);
      var dt = this.get('initWithDetailOpen');
      if(dt) {
        var items = this.get('computedAlbumInfo.items'),
          item = !items ? null : items.find((i) => {
          return i.info.id.endsWith(dt);
        });
        if(item) {
          //this.set('initWithDetailOpen', null);
          this.actions.popup.bind(this)(item);
        }
      }
    },

    resizing() {
      var element = this.$('#' + this.get('resize-sensor-element-id'));
      if(element)
        this.set('previewContainerWidth', element.width());
    },

    initContainerElementResize(id) {
      this.detachResizeSensor();
      var element = this.$('#'+id);
      var resizeDelay = {
        lastWidth: 0,
        isDelaying: false,
      };

      var func = function () {
        if(this.get('hidden'))
          return;
        var width = element.width(); // scollbar take about 30px
        if(width === resizeDelay.lastWidth) {
          return;
        }

        // set to newest width
        resizeDelay.lastWidth = width;

        if(resizeDelay.isDelaying) {
          // some other promise is delaying to handle the resize event
          return;
        }
        // no other promise, have to handle it

        // set delaying
        resizeDelay.isDelaying = true;
        new RSVP.Promise(function (resolve, reject) {
          // sleep 100ms
          let lastWidth = resizeDelay.lastWidth;
          let tID = setInterval(function () {
            if(lastWidth === resizeDelay.lastWidth) {
              clearInterval(tID);
              resolve();
            }
            lastWidth = resizeDelay.lastWidth;
          }, 100);
        })
        .then(() => {
          resizeDelay.isDelaying = false;
          this.set('previewContainerWidth', element.width());
        });
      }.bind(this);
      var sensor = new ResizeSensor(element, func);

      this.set('sensor', {
        sensor: sensor,
        func: func,
        id: id,
      });
    },
  },
});
