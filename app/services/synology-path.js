import Ember from 'ember';

export default Ember.Service.extend({
  ajax: Ember.inject.service('synology-ajax'),
  api: Ember.inject.service('synology-apiinfo'),
  checkpath(hash) {
    hash = hash || {};
    return this.get('api').url('path').then((api) => {
      return this.get('ajax').post(api.url, {
        data:{
          api: api.api,
          method: 'checkpath',
          version: 1,
					token: hash.token || 'Albums',
          additional: hash.additional || 'album_permission',
          ignore: hash.ignore || 'thumbnail',
					ps_username: '',
        }
      }).then((res) => {
        if(res.success) {
          return res;
        } else {
          throw new Error('get path failed');
        }
      });
    });
  }
});
