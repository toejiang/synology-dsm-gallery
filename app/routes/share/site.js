import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  api: Ember.inject.service('synology-apiinfo'),
  accur: Ember.inject.service('synology-accur'),
  utils: Ember.inject.service('synology-utils'),

  model(params) {
    var site = params.site_id;

    return this.get('accur').list(site)
    .then((res) => {
      var utils = this.get('utils');
      var items = [];
      res.data.items.forEach((item) => {
        items.push(
          RSVP.hash({
            src: utils.getShareImageSrc(site, item, 'small', item.additional.public_share.shareid),
            w: item.additional.thumb_size.small.resolutionx,
            h: item.additional.thumb_size.small.resolutiony,
            msrc: utils.getShareImageSrc(site, item, 'large', item.additional.public_share.shareid),
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
