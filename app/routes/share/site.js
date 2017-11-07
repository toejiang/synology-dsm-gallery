import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  api: Ember.inject.service('synology-apiinfo'),
  accur: Ember.inject.service('synology-accur'),
  utils: Ember.inject.service('synology-utils'),

  //  return like:
  //  {
  //    site: 'root',
  //    total: 2,
  //    offset: 0,
  //    items: [
  //      {
  //        src: 'http://your-nas.com/photo/webapi/thumbnail.php?size=large&xxx=xx',
  //        w: 240,
  //        h: 320,
  //        msrc: 'http://your-nas.com/photo/webapi/thumbnail.php?size=small&xxx=xx',
  //        ...
  //      },
  //      {
  //        src: 'http://your-nas.com/photo/webapi/thumbnail.php?size=large&xxx=xx',
  //        w: 240,
  //        h: 320,
  //        msrc: 'http://your-nas.com/photo/webapi/thumbnail.php?size=small&xxx=xx',
  //        ...
  //      },
  //    ],
  //  }
  model(params) {
    var site = params.site_id;

    return this.get('accur').list(site)
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
  },
});
