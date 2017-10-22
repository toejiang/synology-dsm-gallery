import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Service.extend({
  ajax: Ember.inject.service('synology-ajax'),
  api: Ember.inject.service('synology-apiinfo'),

  list(hash) {
    hash = hash || {};
    return this.get('api').api('smart')
    .then((api) => {
      return this.get('ajax').post(api.url, {
        data: {
          sort_by: hash.sort_by || 'title',
					sort_direction: hash.sort_direction || 'asc',
					api: api.api,
					method: 'list',
					version: '1',
					offset: hash.offset || '0',
					limit: hash.limit || '50',
					additional: hash.additional || 'thumb_size',
        },
      }).then((res) => {
				Ember.Logger.info(JSON.stringify(res));
        return res;
      });
    });
  },
});
