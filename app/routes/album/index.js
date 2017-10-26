import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  api: Ember.inject.service('synology-apiinfo'),
  album: Ember.inject.service('synology-album'),
  utils: Ember.inject.service('synology-utils'),

  model() {
    return this.get('api').sites().then((arr) => {
      return ['root'].concat(arr ? arr : []);
    })
    .then((sites) => {
      var result = [];
      var album = this.get('album');

      sites.forEach((site) => {
        var promise = album.list(site, {
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
                src: utils.getAlbumImageSrc(site, item, 'small'),
                w: item.additional.thumb_size.small.resolutionx,
                h: item.additional.thumb_size.small.resolutiony,
                msrc: utils.getAlbumImageSrc(site, item, 'large'),
                pid: item.id,
                info: item,
              })
            );
          });

          return RSVP.hash({
            site: site,
            total: res.data.total,
            offset: res.data.offset,
            items: RSVP.all(items),
          });
        });

        result.push(promise);
      }); // end of forEach

      return RSVP.all(result);
    });
  },
});
