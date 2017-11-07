import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  api: Ember.inject.service('synology-apiinfo'),
  accur: Ember.inject.service('synology-accur'),
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
  //      ],
  //      shareid: 'XyZ123',
  //    },
  //    {
  //      site: 'user1',
  //      total: 1,
  //      offset: 0,
  //      items: [...]
  //      shareid: 'XyZ456',
  //    }
  //  ]
  model() {
    return this.get('api').sites().then((arr) => {
      return ['root'].concat(arr ? arr : []);
    })
    .then((sites) => {
      var result = [];
      var accur = this.get('accur');

      sites.forEach((site) => {
        var promise = accur.list(site)
        .then((res) => {
          var utils = this.get('utils');
          var items = [];
          res.data.items.forEach((item) => {
            items.push(
              RSVP.hash(item.type === 'video' ? {
                html: this.get('utils').buildHtmlForPhotoSwipeVideo(site, item, item.additional.public_share.shareid),
                msrc: utils.getShareImageSrc(site, item, 'small', item.additional.public_share.shareid),
                info: item,
              } : {
                src: utils.getShareImageSrc(site, item, 'large', item.additional.public_share.shareid),
                w: item.additional.thumb_size.large.resolutionx,
                h: item.additional.thumb_size.large.resolutiony,
                msrc: utils.getShareImageSrc(site, item, 'small', item.additional.public_share.shareid),
                preview: utils.getShareImageSrc(site, item, 'preview', item.additional.public_share.shareid),
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
      });

      return RSVP.all(result);
    });
  },
});
