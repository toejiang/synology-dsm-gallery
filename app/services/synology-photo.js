import Ember from 'ember';

export default Ember.Service.extend({
  ajax: Ember.inject.service('synology-ajax'),
  api: Ember.inject.service('synology-apiinfo'),

  _do_list(site, hash) {
    site = (!site || site === '') ? 'root' : site;
    hash = hash || {};
    return this.get('api').api('photo').then((api) => {
      hash.data.api = api.api;
      hash.data.version = 1;
      return this.get('ajax').post(api.url[site], hash).then((res) => {
        if(res.success) {
          return res;
        } else {
          throw new Error('get photo failed');
        }
      });
    });
  },

  listalbum(site, hash) {
    hash = hash || {};
    var data = {
      filter_album: hash.filter_album || '',
      //api: api.api,
      //version: 1,
      method: 'list',
      type: hash.type || 'photo,video',
      item_id: hash.item_id || '',
      additional: hash.additional || 'photo_exif,video_codec,video_quality,thumb_size',
      offset: hash.offset || 0,
      limit: hash.limit || -1,
      sort_by: hash.sort_by || 'preference',
      sort_direction: hash.direction || 'asc',
    };
    return this._do_list(site, {data:data});
  },

  listshare(site, hash) {
    hash = hash || {};
    var data = {
      filter_public_share: hash.filter_public_share || '',
      //api: api.api,
      //version: 1,
      method: 'list',
      type: hash.type || 'photo,video',
      item_id: hash.item_id || '',
      additional: hash.additional || 'photo_exif,video_codec,video_quality,thumb_size',
      offset: hash.offset || 0,
      limit: hash.limit || -1,
      sort_by: hash.sort_by || 'preference',
      sort_direction: hash.direction || 'asc',
    };
    return this._do_list(site, {data:data});
  },

  listsmart(site, hash) {
    hash = hash || {};
    var data = {
      filter_smart: hash.filter_smart || '',
      //api: api.api,
      //version: 1,
      method: 'list',
      type: hash.type || 'photo,video',
      additional: hash.additional || 'photo_exif,video_codec,video_quality,thumb_size',
      offset: hash.offset || 0,
      limit: hash.limit || -1,
      sort_by: hash.sort_by || 'preference',
      sort_direction: hash.direction || 'asc',
    };
    return this._do_list(site, {data:data});
  },

  getexif(site, hash) {
    hash = hash || {};
    var data = {
      id: hash.id || '',
      //api: api.api,
      //version: 1,
      method: 'getexif',
      ps_username: '',
    };
    return this._do_list(site, {data:data});
  },

  getinfo(site, hash) {
    hash = hash || {};
    var data = {
      id: hash.id || '',
      public_share_id: hash.public_share_id || '',
      additional: hash.additional || 'thumb_size,public_share',
      //api: api.api,
      //version: 1,
      method: 'getinfo',
      ps_username: '',
    };
    return this._do_list(site, {data:data});
  },
});
