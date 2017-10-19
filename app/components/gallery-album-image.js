import Ember from 'ember';
import Utils from '../utils/utils';

export default Ember.Component.extend({
  album: null,
  thumbSize: 'small',

  init() {
    this._super(...arguments);
    var album = this.get('album');
  },

  actions: {
    changeThumbSize() {
      var size = this.get('thumbSize') == 'small' ? 'large' : 'small';
      this.set('thumbSize', size);
    }
  }
});
