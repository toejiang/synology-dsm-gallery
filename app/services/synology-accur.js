import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Service.extend({
  ajax: Ember.inject.service('synology-ajax'),
  api: Ember.inject.service('synology-apiinfo'),

  list(hash) {
    hash = hash || {};

    return this.get('api').api('accur')
    .then((api) => {
      return this.get('ajax').post(api.url, {
        data: {
          method: 'list',
          api: api.api,
          version: 1,
          offset: hash.offset || 0,
          limit: hash.limit || -1,
          sort_by: hash.sort_by || 'preference',
          sort_direction: hash.direction || 'asc',
          additional: hash.additional || 'thumb_size,public_share',
        }
      })
      .then((res) => {
        Ember.Logger.info('accur list success: ', JSON.stringify(res));
        return res;
      });
    });
  }
});
