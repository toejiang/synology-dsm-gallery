import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    getThumbBoundsFn: function getThumbBoundsFn(index) {
      var items = this.get('items'),
        item = items ? items[index] : null,
        id = item ? item.info.id : 0,
        ele = this.$('#'+id),
        pos = ele ? ele.position() : {left:0,top:0},
        width = ele ? ele.width() : 0;
      return {x:pos.left, y:pos.top, w:width};
    },

    popup(item) {
      this.set('popupImgSrc', item.msrc)
      $.magnificPopup.open({
        items: {
          type: 'inline',
          src: $('#image-info-popup'),
        }
      });

    },
  },
});
