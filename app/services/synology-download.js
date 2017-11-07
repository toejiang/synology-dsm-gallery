import Ember from 'ember';

export default Ember.Service.extend({
  api: Ember.inject.service('synology-apiinfo'),

  //  hash like: {
  //    id: 'video_6a6a7a2f64617931_494d475f303230322e4d4f56',
  //    quality_id: '2f766f6c756d65342f70686f746f2f6a6a7a2f6461793.......'
  //    public_share_id: 'SxGk45',
  //  }
  getvideo(site, hash) {
    return this.get('api').api('download').then(api => {
      var params = `?api=${api.api}&method=getvideo&version=1&id=${hash.id}&quality_id=${hash.quality_id}`;
      if(hash.public_share_id && hash.public_share_id !== '')
        params += `&public_share_id=${hash.public_share_id}`;
      return api.url[site] + '/1.mp4' + params;
    });
  }
});
