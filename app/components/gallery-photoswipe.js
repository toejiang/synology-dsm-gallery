import Component from '@ember/component';
import { computed } from '@ember/object';
import FitPhotoWall from '../utils/fit-photo-wall';
import Utils from '../utils/utils';
import RSVP from 'rsvp';
import $ from 'jquery';

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

    var obFunc = function (sender, key, value, rev) {
      this.send('lightbox', this.get('index'));
    }.bind(this);
    this.addObserver('index', obFunc);
    $(document).ready(obFunc);
  },

  didInsertElement() {
    this._super(...arguments);
    this.set('sensor', this.createSensor());
  },

  willDestroyElement() {
    this._super(...arguments);
    var sensor = this.get('sensor');
    if(sensor) sensor.detach();
    this.set('sensor', null);
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

    onOpen() {
      var {onOpen, photoswipe} = this.getProperties('onOpen', 'photoswipe');
      if(onOpen && typeof(onOpen) === 'function' && photoswipe)
        onOpen(this.get('computedAlbumInfo.site'), photoswipe.currItem);
    },

    onChange() {
      var {onChange, photoswipe} = this.getProperties('onChange', 'photoswipe');
      if(onChange && typeof(onChange) === 'function' && photoswipe)
        onChange(this.get('computedAlbumInfo.site'), photoswipe.currItem);
    },

    onClose() {
      var {onClose, photoswipe} = this.getProperties('onClose', 'photoswipe');
      if(onClose && typeof(onClose) === 'function' && photoswipe)
        onClose(this.get('computedAlbumInfo.site'), photoswipe.currItem);
      this.set('photoswipe', null);
    },

    lightbox(index) {
      var photoswipe = this.get('photoswipe'),
        items = this.get('computedAlbumInfo.items');
      if(photoswipe && index >= 0) {
        if(index === photoswipe.getCurrentIndex()) return;
        photoswipe.goTo(index);
      } else if(photoswipe && (index < 0 || index === null || index === undefined)) {
        photoswipe.close();
      } else if(index >= 0) {
        var pswpElement = document.querySelectorAll('.pswp')[0];
        photoswipe = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, {
          index: index,
          history: false,
          getThumbBoundsFn: this.actions.getThumbBoundsFn.bind(this),
        });
        this.set('photoswipe', photoswipe);
        photoswipe.listen('initialZoomIn', this.actions.onOpen.bind(this));
        photoswipe.listen('initialZoomOut', this.actions.onClose.bind(this));
        photoswipe.listen('afterChange', this.actions.onChange.bind(this));
        photoswipe.init();
      }
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

  },

  createSensor() {
    var THIS = {
      ins: null,
      component: this,
      element: this.$('#' + this.get('resize-sensor-element-id')),
      lastWidth: 0,
      delaying: false,
      resizing: null,
      detach: null,
    };

    THIS.detach = function detach() {
      this.ins.detach(this.element, this.resizing);
    };

    THIS.resizing = function resizing() {
      var markW = this.element.width(); // scollbar take about 30px
      if(this.component.get('hidden') || markW === this.lastWidth || this.delaying) {
        // some other promise maybe delaying to handle the resize event
        return;
      }
      this.delaying = true;
      let tID = setInterval(function () {
        var newW = this.element.width();
        if(markW === newW) {
          clearInterval(tID);
          this.lastWidth = newW;
          this.delaying = false;
          this.component.set('previewContainerWidth', newW);
        }
        markW = newW;
      }.bind(THIS), 100);
    }.bind(THIS);
    THIS.ins = new ResizeSensor(THIS.element, THIS.resizing);
    THIS.resizing();
    return THIS;
  },
});
