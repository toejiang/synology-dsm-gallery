import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Helper.extend({
  utils: Ember.inject.service('synology-utils'),

  // return a promise that resolve with a thumbnail url of the album,
  // the receiver should use a promise-helper to get the result, like '{{await (g-album-image-src album)}}'
  compute: function compute([album,size,shareid]) {
    return shareid ? this.get('utils').getShareImageSrc('root', album, size, shareid)
      : this.get('utils').getAlbumImageSrc('root', album, size);
  },

});
