import Ember from 'ember';
import Utils from '../../utils/utils';

export default Ember.Controller.extend({
  queryParams: ['lightbox', 'popup'],
  lightbox: null,
  popup: null,

  actions: {
    onDetailOpen(item) {
      this.set('popup', Utils.shortenPhotoId(item.info.id));
    },
    onDetailClose(item) {
      this.set('popup', null);
    },
    onLightboxOpen(item) {
      this.set('lightbox', Utils.shortenPhotoId(item.info.id));
    },
    onLightboxClose(item) {
      this.set('lightbox', null);
    },
    onLightboxChange(item) {
      this.set('lightbox', Utils.shortenPhotoId(item.info.id));
    },
  }
});
