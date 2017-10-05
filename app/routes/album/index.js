import Ember from 'ember';

export default Ember.Route.extend({
  syno: Ember.inject.service('synology'),

  model(path) {
    return this.get('syno').album({
      id: '',
      type: 'album,photo,video',
      additional: 'album_permission,photo_exif,video_codec,video_quality,thumb_size,file_location',
    });
  },
});
