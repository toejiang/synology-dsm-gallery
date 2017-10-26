import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  photo: Ember.inject.service('synology-photo'),
  utils: Ember.inject.service('synology-utils'),

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
            msrc: utils.getShareImageSrc(site, item, 'preview', shareId),
            small: utils.getShareImageSrc(site, item, 'small', shareId),
            pid: item.id,
            info: item,
          })
        );
      });
      return RSVP.hash({
        site: site,
        share: RSVP.hash({
          total: res.data.total,
          offset: res.data.offset,
          items: RSVP.all(items),
        }),
        shareid: shareId,
        show: show
      });
    });
  }
});
