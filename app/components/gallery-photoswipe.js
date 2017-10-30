import Component from '@ember/component';

export default Component.extend({
  itemProperties: ['src', 'w', 'h', 'msrc'],

  actions: {
    open(photoswipe, index, hash) {
      hash = hash || {};
      hash.index = index;
      hash.getThumbBoundsFn = function getThumbBoundsFn(index) {
        var items = this.get('items'),
          item = items ? items[index] : null,
          id = item ? item.info.id : 0,
          ele = this.$('#'+id),
          pos = ele ? ele.position() : {left:0,top:0},
          width = ele ? ele.width() : 0;
        return {x:pos.left, y:pos.top, w:width};
      }.bind(this);
      photoswipe.actions.open(hash);
    },
  },
});
