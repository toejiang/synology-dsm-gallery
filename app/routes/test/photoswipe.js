import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  album: Ember.inject.service('synology-album'),
  utils: Ember.inject.service('synology-utils'),

  model(params) {
    var site = params.site_id || 'root';
    var albumId = 'album_' + (params.album_id || '636172');
    return this.get('album').list(site, {
      id: albumId,
      type: 'album,photo,video',
      additional: 'album_permission,photo_exif,video_codec,video_quality,thumb_size,file_location',
    })
    .then((res) => {
      var utils = this.get('utils');
      var result = [];
      res.data.items.forEach((a) => {
        result.push(
          RSVP.hash({
            src: utils.getAlbumImageSrc(site, a, 'large'),
            w: a.additional.thumb_size.large.resolutionx,
            h: a.additional.thumb_size.large.resolutiony,
            title: a.info.title,
            msrc: utils.getAlbumImageSrc(site, a, 'small'),
            preview: utils.getAlbumImageSrc(site, a, 'preview'),
            info: a,
          })
        );
      });
      return RSVP.hash({
        site: site,
        total: res.data.total,
        offset: res.data.offset,
        items: RSVP.all(result)
      });
    });
  },
});
