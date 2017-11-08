import Component from '@ember/component';
import { computed } from '@ember/object';
import FitPhotoWall from '../utils/fit-photo-wall';

export default Component.extend({
  tagName: 'div',
  classNames: 'gallery-photoswipe-site-items',

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

  computedAlbumInfo: computed('albumInfo', function() {
     var albumInfo = this.get('albumInfo');
    // add fitsize property, so that we can call fitPhotoWall to set the rigth size
    albumInfo.items.forEach(item => {
      item.fitsize = {
        oriW: item.info.additional.thumb_size.small.resolutionx,
        oriH: item.info.additional.thumb_size.small.resolutiony,
      };
    });
    var width = this.$('#'+this.get('containerElementId')).width();
    FitPhotoWall(albumInfo.items, {
      width: width - 30, // scollbar take about 30px
      height: 320,
      margin: 4,
    });
    return albumInfo;
  }),

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

    initContainerElementId(id) {
      this.set('containerElementId', id);
    },
  },
});
