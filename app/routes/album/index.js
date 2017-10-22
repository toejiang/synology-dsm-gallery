import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  album: Ember.inject.service('synology-album'),
  utils: Ember.inject.service('synology-utils'),

  model(path) {
    return this.get('album').list({
      id: '',
      type: 'album,photo,video',
      additional: 'album_permission,photo_exif,video_codec,video_quality,thumb_size,file_location',
    })
    .then((res) => {
      var utils = this.get('utils');
      var items = [];
      res.data.items.forEach((item) => {
        items.push(
          RSVP.hash({
            src: utils.getAlbumImageSrc(item, 'small'),
            w: item.additional.thumb_size.small.resolutionx,
            h: item.additional.thumb_size.small.resolutiony,
            msrc: utils.getAlbumImageSrc(item, 'large'),
            pid: item.id,
            info: item,
          })
        );
      });
      return RSVP.hash({
        total: res.data.total,
        offset: res.data.offset,
        items: RSVP.all(items),
      });
    });
  },
});
