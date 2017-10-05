import Ember from 'ember';

export default Ember.Service.extend({
  ajax: Ember.inject.service('synology-ajax'),
  api: Ember.inject.service('synology-apiinfo'),
  getinfo(hash) {
    hash = hash || {};
    return this.get('api').url('info').then((api) => {
      return this.get('ajax').post(api.url, {
        data:{
          api: api.api,
          method: 'getinfo',
          version: 1,
					ps_username: '',
        }
      }).then((res) => {
        if(res.success) {
          return res;
        } else {
          throw new Error('get info failed');
        }
      });
  });
  }
});
