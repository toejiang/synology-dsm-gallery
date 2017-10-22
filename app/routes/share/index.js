import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  accur: Ember.inject.service('synology-accur'),
  utils: Ember.inject.service('synology-utils'),

  model() {
    return this.get('accur').list()
    .then((res) => {
      var utils = this.get('utils');
      var items = [];
      res.data.items.forEach((item) => {
        items.push(
          RSVP.hash({
            src: utils.getShareImageSrc(item, 'small', item.additional.public_share.shareid),
            w: item.additional.thumb_size.small.resolutionx,
            h: item.additional.thumb_size.small.resolutiony,
            msrc: utils.getShareImageSrc(item, 'large', item.additional.public_share.shareid),
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
  }
});
