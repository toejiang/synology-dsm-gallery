import Ember from 'ember';

export default Ember.Service.extend({
  ajax: Ember.inject.service('synology-ajax'),
  api: Ember.inject.service('synology-apiinfo'),
  getCategory(hash) {
    hash = hash || {};
    return this.get('api').api('category').then((api) => {
      return this.get('ajax').post(api.url, {
        data:{ 
          api: api.api,
          method: 'list',
          version: 1,
          offset: hash.offset || 0, 
          limit: hash.limit || 100,
					ps_username: '',
        }
      }).then((res) => {
        if(res.success) {
          return res;
        } else {
          throw new Error('get category failed');
        }
      });
    });
  },
});
