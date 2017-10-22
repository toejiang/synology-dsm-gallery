import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  photo: Ember.inject.service('synology-photo'),
  utils: Ember.inject.service('synology-utils'),

  model(params) {
    if(!params.share_id || params.share_id === '') {
      this.transitionTo('share');
    }
    var shareId = params.share_id;
    var show = params.show;
    Ember.Logger.info('share/detail: shareid:' + shareId + ' show:' + show);

    return this.get('photo').listshare({
      filter_public_share: shareId,
    }).then((res) => {
      var utils = this.get('utils');
      var items = [];
      res.data.items.forEach((item) => {
        items.push(
          RSVP.hash({
            src: utils.getShareImageSrc(item, 'small', shareId),
            w: item.additional.thumb_size.small.resolutionx,
            h: item.additional.thumb_size.small.resolutiony,
            msrc: utils.getShareImageSrc(item, 'large', shareId),
            pid: item.id,
            info: item,
          })
        );
      });
      return RSVP.hash({
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
