import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  photo: Ember.inject.service('synology-photo'),
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
  //    shareid: 'XyZ123',
  //  }
  model(params) {
    if(!params.site_id || params.site_id === '') {
      this.transitionTo('share');
    }
    if(!params.share_id || params.share_id === '') {
      this.transitionTo('share');
    }
    var site = params.site_id;
    var shareId = params.share_id;
    var show = params.show;

    return this.get('photo').listshare(site, {
      filter_public_share: shareId,
    }).then((res) => {
      var utils = this.get('utils');
      var items = [];
      res.data.items.forEach((item) => {
        items.push(
          RSVP.hash({
            src: utils.getShareImageSrc(site, item, 'large', shareId),
            w: item.additional.thumb_size.large.resolutionx,
            h: item.additional.thumb_size.large.resolutiony,
            msrc: utils.getShareImageSrc(site, item, 'small', shareId),
            preview: utils.getShareImageSrc(site, item, 'preview', shareId),
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
        shareid: shareId,
        show: show
      });
    });
  }
});
