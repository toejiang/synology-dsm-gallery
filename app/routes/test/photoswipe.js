import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  album: Ember.inject.service('synology-album'),
  utils: Ember.inject.service('synology-utils'),

  model(path) {
    return this.get('album').list({
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
            src: utils.getAlbumImageSrc(a, 'small'),
            w: a.additional.thumb_size.small.resolutionx,
            h: a.additional.thumb_size.small.resolutiony,
            title: a.info.title,
            msrc: utils.getAlbumImageSrc(a, 'large'),
            info: a,
          })
        );
      });
      return RSVP.all(result);
    });
  },
});
