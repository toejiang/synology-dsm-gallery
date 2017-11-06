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

  // return like: {id:11,userid:1030,name:"acc-share-d2-sunday2",share_status:"valid",shareid:23,recursive:false,is_advanced:false,has_comment:false}
  getinfo_public(site, hash) {
    site = (!site || site === '') ? 'root' : site;
    hash = hash || {};
    return this.get('api').api('share').then((api) => {
      return this.get('ajax').post(api.url[site], {
        data: {
					api: api.api,
					method: 'getinfo_public',
					version: '1',
					public_share_id: hash.public_share_id || '',
        },
      }).then((res) => {
        // raw is: {"success":true,"data":{"shared_album":{...}}}
        return res.data.shared_album;
      });
    });
  },
});
