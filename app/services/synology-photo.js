import Ember from 'ember';

export default Ember.Service.extend({
  ajax: Ember.inject.service('synology-ajax'),
  api: Ember.inject.service('synology-apiinfo'),

  list(hash) {
    hash = hash || {};
    return this.get('api').api('photo').then((api) => {
      return this.get('ajax').post(api.url, {
		 	  data:{
          api: api.api,
          method: 'list',
          version: 1,
          type: hash.type || 'photo,video',
          filter_public_share: hash.filter_public_share || '',
          item_id: hash.item_id || '',
          additional: hash.additional || 'photo_exif,video_codec,video_quality,thumb_size',
          offset: hash.offset || 0,
          limit: hash.limit || -1,
          sort_by: hash.sort_by || 'preference',
          sort_direction: hash.direction || 'asc',
		 	  }
      }).then((res) => {
        if(res.success) {
          return res;
        } else {
          throw new Error('get photo failed');
        }
      });
    });
  }
});
