import Component from '@ember/component';

export default Component.extend({
  tagName: 'div',
  classNames: 'gallery-photoswipe-site-items',

  showHideOpacity: false,
  bgOpacity: 0.9,
  barsSize: {top:20, bottom:'auto'},
  itemProperties: ['src', 'w', 'h', 'msrc'],
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

  actions: {
    getThumbBoundsFn: function getThumbBoundsFn(index) {
      var items = this.get('albumInfo.items'),
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
        open(this.get('albumInfo.items')[pswp.getCurrentIndex()]);
    },

    onPhotoSwipeChange(pswp) {
      var change = this.get('onLightboxChange');
      if(change && typeof(change) === 'function')
        change(this.get('albumInfo.items')[pswp.getCurrentIndex()]);
    },

    onPhotoSwipeClose(pswp) {
      var close = this.get('onLightboxClose');
      if(close && typeof(close) === 'function')
        close(this.get('albumInfo.items')[pswp.getCurrentIndex()]);
    },

    lightbox(item) {
      this.get('photoswipe').actions.open({
        index: this.get('albumInfo.items').indexOf(item),
      });
    },

    popup(item) {
      this.get('popup').actions.open({
        index: this.get('albumInfo.items').indexOf(item),
        open: this.get('onDetailOpen'),
        close: this.get('onDetailClose'),
      });
    }
  },
});
