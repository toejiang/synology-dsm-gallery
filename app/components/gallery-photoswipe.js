import Component from '@ember/component';

export default Component.extend({

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
      var items = this.get('items'),
        item = items ? items[index] : null,
        id = item ? item.info.id : 0,
        ele = this.$('#'+id),
        pos = ele ? ele.position() : {left:0,top:0},
        width = ele ? ele.width() : 0;
      return {x:pos.left, y:pos.top, w:width};
    },

    open(photoswipe, index, hash) {
      hash = hash || {};
      hash.index = index;
      photoswipe.actions.open(hash);
    },
  },
});
