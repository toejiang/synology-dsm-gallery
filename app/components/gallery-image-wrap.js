import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  classNames: 'gallery-image-wrap',

  buttonLabel: '✿',

  hide: true,
  hover: false,

  init() {
    this._super(...arguments);
    var item = this.get('item');
    this.set('hide', item.info.type === 'photo');
    if(item.info.type === 'video')
      this.set('buttonLabel', '►');
  },

  actions: {
    detailClick() {
      var action = this.get('detailClick');
      if(action && typeof action === 'function') {
        action(this.get('item'));
      }
    },

    imageClick() {
      var action = this.get('imageClick');
      if(action && typeof action === 'function') {
        action(this.get('item'));
      }
    },

    mouseIn() {
      this.set('hover', true);
    },
    mouseOut() {
      this.set('hover', false);
    },
  },
});
