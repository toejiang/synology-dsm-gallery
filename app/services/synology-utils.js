import Ember from 'ember';

export default Ember.Service.extend({
  synoapi: Ember.inject.service('synology-apiinfo'),

  getAlbumImageSrc(site, album, size) {
    site = (!site || site === '') ? 'root' : site;
    var id = album.id;
    return this.get('synoapi').api('thumb').then((thumbApi) => {
      var params = 'api=' + thumbApi.api + '&'
                 + 'method=' + 'get' + '&'
                 + 'version=' + '1' + '&'
                 + 'size=' + (size||'small') + '&'
                 + 'id=' + id+ '&'
                 + 'thumb_sig=' + (album.additional.thumb_size.sig || '') + '&'
                 + 'mtime=' + (album.additional.thumb_size.small.mtime || '') + '&'
      return thumbApi.url[site] + '?' + params;
    });
  },

  // return a promise that resolve with a thumbnail url of the album,
  // the receiver should use a promise-helper to get the result, like '{{await (g-album-image-src album)}}'
  getShareImageSrc(site, album, size, shareId) {
    site = (!site || site === '') ? 'root' : site;
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
                 + ((shareId && shareId != '') ? ('public_share_id=' + shareId) : '');
      return thumbApi.url[site] + '?' + params;
    });
  },
});
