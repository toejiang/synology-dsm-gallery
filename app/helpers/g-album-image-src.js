import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Helper.extend({
  synoapi: Ember.inject.service('synology-apiinfo'),

  // return a promise that resolve with a thumbnail url of the album,
  // the receiver should use a promise-helper to get the result, like '{{await (g-album-image-src album)}}'
  compute: function compute([album,size]) {
    return this.get('synoapi').url('thumb').then((thumbApi) => {
      var params = 'api=' + thumbApi.api + '&'
                 + 'method=' + 'get' + '&'
                 + 'version=' + '1' + '&'
                 + 'size=' + (size||'small') + '&'
                 + 'id=' + album.id + '&'
                 + 'thumb_sig=' + album.additional.thumb_size.sig + '&'
                 + 'mtime=' + album.additional.thumb_size.small.mtime + '&'
      return thumbApi.url + '?' + params;
    });
  }

});
