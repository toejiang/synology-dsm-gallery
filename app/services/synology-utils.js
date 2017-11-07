import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Service.extend({
  synoapi: Ember.inject.service('synology-apiinfo'),
  download: Ember.inject.service('synology-download'),

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

  buildHtmlForPhotoSwipeVideo(site, album, shareId) {
    if(album.type !== 'video')
      return RSVP.reject('require video type');
    return RSVP.resolve([]).then(sources => {
      album.additional.video_quality.forEach(quality => {
        var source = this.get('download').getvideo(site, {
          id: album.id,
          quality_id: quality.id,
          public_share_id: shareId || '',
        })
        .then(url => {
          return `<source src="${url}" type="video/${quality.container}">`;
        });
        sources.push(source);
      });
      return RSVP.all(sources).then(arr => arr.join(' '));
    })
    .then(sourcesHTML => {
      return `<div class="gallery-photoswipe-html-wrap"><video controls style="max-height:900px;max-width:1024px;">${sourcesHTML}</video></div>`;
    });
  },
});
