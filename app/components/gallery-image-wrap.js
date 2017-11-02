import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  classNames: 'gallery-image-wrap',

  buttonLabel: 'Detail',

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
      this.$('.gallery-image-wrap-detail-outer')[0].classList.remove('gallery-image-wrap-detail-outer-hidden');
      this.$('.gallery-image-wrap-outer')[0].classList.add('gallery-image-wrap-outer-hover');
    },
    mouseOut() {
      this.$('.gallery-image-wrap-detail-outer')[0].classList.add('gallery-image-wrap-detail-outer-hidden');
      this.$('.gallery-image-wrap-outer')[0].classList.remove('gallery-image-wrap-outer-hover');
    },
  },
});
