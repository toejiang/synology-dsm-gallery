import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  album: Ember.inject.service('synology-album'),
  utils: Ember.inject.service('synology-utils'),

  model() {
    return this.get('album').list('root', {
      id: 'album_636172',
      type: 'album,photo,video',
      additional: 'album_permission,photo_exif,video_codec,video_quality,thumb_size,file_location',
    })
    .then((res) => {
      var utils = this.get('utils');
      var result = [];
      res.data.items.forEach((a) => {
        result.push(
          RSVP.hash({
            src: utils.getAlbumImageSrc('root', a, 'large'),
            w: a.additional.thumb_size.large.resolutionx,
            h: a.additional.thumb_size.large.resolutiony,
            title: a.info.title,
            msrc: utils.getAlbumImageSrc('root', a, 'preview'),
            small: utils.getAlbumImageSrc('root', a, 'small'),
            info: a,
          })
        );
      });
      return RSVP.all(result);
    });
  },
});
