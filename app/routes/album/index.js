import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  api: Ember.inject.service('synology-apiinfo'),
  album: Ember.inject.service('synology-album'),
  utils: Ember.inject.service('synology-utils'),

  //  return like:
  //  [
  //    {
  //      site: 'root',
  //      total: 2,
  //      offset: 0,
  //      items: [
  //        {
  //          src: 'http://your-nas.com/photo/webapi/thumbnail.php?size=large&xxx=xx',
  //          w: 240,
  //          h: 320,
  //          msrc: 'http://your-nas.com/photo/webapi/thumbnail.php?size=small&xxx=xx',
  //          ...
  //        },
  //        {
  //          src: 'http://your-nas.com/photo/webapi/thumbnail.php?size=large&xxx=xx',
  //          w: 240,
  //          h: 320,
  //          msrc: 'http://your-nas.com/photo/webapi/thumbnail.php?size=small&xxx=xx',
  //          ...
  //        },
  //      ]
  //    },
  //    {
  //      site: 'user1',
  //      total: 1,
  //      offset: 0,
  //      items: [...]
  //    }
  //  ]
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
              RSVP.hash(item.type === 'video' ? {
                html: this.get('utils').buildHtmlForPhotoSwipeVideo(site, item),
                msrc: utils.getAlbumImageSrc(site, item, 'small'),
                info: item,
              } : {
                src: utils.getAlbumImageSrc(site, item, 'large'),
                w: item.additional.thumb_size.large.resolutionx,
                h: item.additional.thumb_size.large.resolutiony,
                msrc: utils.getAlbumImageSrc(site, item, 'small'),
                preview: utils.getAlbumImageSrc(site, item, 'preview'),
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

  resetController(controller, isExiting, transition) {
    if (isExiting && transition.targetName !== 'error') {
      controller.set('showId', null);
    }
  },
});
