import Ember from 'ember';
import Utils from '../utils/utils';

export default Ember.Component.extend({
  album: null,
  thumbSize: 'small',
  shortId: '',
  paramId: null,

  init() {
    this._super(...arguments);
    var album = this.get('album'),
      shortId = Utils.shortenId(album.id);
    this.set('shortId', shortId);
    this.set('paramId', shortId);
  },

  actions: {
    changeThumbSize() {
      var size = this.get('thumbSize'),
        shortId = this.get('shortId');
      if(size === 'large') {
        this.set('thumbSize', 'small');
        //this.set('paramId', null);
      } else {
        this.set('thumbSize', 'large');
        //this.set('paramId', shortId);
      }
    }
  }
});
