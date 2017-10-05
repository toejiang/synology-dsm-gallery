import Ember from 'ember';

export default Ember.Service.extend({
  _api: Ember.inject.service('synology-apiinfo'),
  _auth: Ember.inject.service('synology-auth'),
  _album: Ember.inject.service('synology-album'),
  _info: Ember.inject.service('synology-info'),
  _category: Ember.inject.service('synology-category'),
  _path: Ember.inject.service('synology-path'),

  album(hash) {
    // hash = hash || {
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
    return this.get('_album').list(hash);
  },

  album2() {
    return this.get('_album');
  },

  info() {
    return this.get('_info').getinfo();
  },

  category(hash) {
    // hash = hash || {
    //   offset: 0,
    //   limit: 100,
    // };
    return this.get('_category').getCategory(hash);
  },

  path(hash) {
    // hash = hash || {
    //   token: 'Albums',
    //   additional: 'album_permission',
    //   ignore: '',
    // };
    return this.get('_path').checkpath(hash);
  },

  auth() {
    return this.get('_auth').checkauth();
  }
});
