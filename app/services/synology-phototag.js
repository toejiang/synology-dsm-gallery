import Ember from 'ember';

export default Ember.Service.extend({
  ajax: Ember.inject.service('synology-ajax'),
  api: Ember.inject.service('synology-apiinfo'),

  // param hash: form data to send
  // hash = {
  //   id: 'photo_746f6562_494d475f303130332e4a5047',
  //   type: 'people,geo,desc',
  //   additional: info,
  //   ps_username: '',
  // };
  list(site, hash) {
    site = (!site || site === '') ? 'root' : site;
    hash = hash || {};
    return this.get('api').api('phototag').then((api) => {
      return this.get('ajax').post(api.url[site], {
        data:{
          id: hash.id || '',
          api: api.api,
          method: 'list',
          version: 1,
          type: hash.type || 'people,geo,desc',
          additional: hash.additional || 'info',
          ps_username: hash.ps_username || '',
        }
      }).then((res) => {
        if(res.success) {
          return res;
        } else {
          throw new Error(`get photo tag for ${hash.id} failed`);
        }
      });
    });
  }
});
