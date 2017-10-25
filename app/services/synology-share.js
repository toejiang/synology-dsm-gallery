import Ember from 'ember';

export default Ember.Service.extend({
  ajax: Ember.inject.service('synology-ajax'),
  api: Ember.inject.service('synology-apiinfo'),

  list(site, hash) {
    site = (!site || site === '') ? 'root' : site;
    hash = hash || {};
    return this.get('api').api('share').then((api) => {
      return this.get('ajax').post(api.url[site], {
        data: {
          sort_by: hash.sort_by || 'preference',
					sort_direction: hash.sort_direction || 'asc',
					api: api.api,
					method: 'list',
					version: '1',
					offset: hash.offset || '0',
					limit: hash.limit || '50',
					additional: hash.additional || 'thumb_size,public_share',
        },
      }).then((res) => {
				Ember.Logger.info(JSON.stringify(res));
        return res;
      });
    });
  },
});
