import Ember from 'ember';

export default Ember.Service.extend({
  ajax: Ember.inject.service('synology-ajax'),
  api: Ember.inject.service('synology-apiinfo'),

  // param hash: form data to send
  // hash = {
	//   id: '',
  //   sort_by: 'preference',
  //   sort_direction: 'asc',
  //   offset: 0,
  //   limit: -1,
  //   recursive: false,
  //   type: 'album', 
  //   additional: 'album_permission',
  //   ignore: '',
  // };
  list(hash) {
    hash = hash || {};
    return this.get('api').api('album').then((api) => {
      return this.get('ajax').post(api.url, {
		 	  data:{
          id: hash.id || '',
          sort_by: hash.sort_by || 'preference',
          sort_direction: hash.direction || 'asc',
          api: api.api,
          method: 'list',
          version: 1,
          offset: hash.offset || 0,
          limit: hash.limit || -1,
          recursive: hash.recursive || false,
          type: hash.type || 'album',
          additional: hash.additional || 'album_permission',
          ignore: hash.ignore || '',
					ps_username: '',
		 	  }
      }).then((res) => {
        if(res.success) {
          return res;
        } else {
          throw new Error('get album failed');
        }
      });
    });
  }
});
