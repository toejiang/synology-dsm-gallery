import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Helper.extend({
  synoapi: Ember.inject.service('synology-apiinfo'),

  // return a promise that resolve with a thumbnail url of the album,
  // the receiver should use a promise-helper to get the result, like '{{await (g-album-image-src album)}}'
  compute: function compute([album,size,shareid]) {
    var id = album.id;
    if(album.type === 'sharedalbum') {
      id = 'publicshare_' + album.additional.public_share.shareid;
    }
    return this.get('synoapi').api('thumb').then((thumbApi) => {
      var params = 'api=' + thumbApi.api + '&'
                 + 'method=' + 'get' + '&'
                 + 'version=' + '1' + '&'
                 + 'size=' + (size||'small') + '&'
                 + 'id=' + id+ '&'
                 + 'thumb_sig=' + (album.additional.thumb_size.sig || '') + '&'
                 + 'mtime=' + (album.additional.thumb_size.small.mtime || '') + '&'
                 + ((shareid && shareid != '') ? ('public_share_id=' + shareid) : '');
      return thumbApi.url + '?' + params;
    });
  }

});
