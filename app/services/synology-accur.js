import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Service.extend({
  ajax: Ember.inject.service('synology-ajax'),
  api: Ember.inject.service('synology-apiinfo'),

  list(site, hash) {
    hash = hash || {};
    site = (!site || site === '') ? 'root' : site;

    return this.get('api').api('accur')
    .then((api) => {
      return this.get('ajax').post(api.url[site], {
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
      });
    });
  },

  site() {
    return this.get('api').api('accur')
    .then((api) => {
      return this.get('ajax').post(api.url['root'], {
        data: {
          method: 'site',
          api: api.api,
          version: 1,
        }
      });
    });
  }
});
