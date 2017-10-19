import Ember from 'ember';
import RSVP from 'rsvp';

function getPathQueryId(albumId) {
  albumId = (albumId || '').toLowerCase();
  var parts = albumId.split('2f'),
    result = '',
    tmp = '';
  parts.forEach((e)=>{
    if(result != '') result+='/';
    if(tmp != '') tmp += '2f';
    tmp += e;
    result += 'album_' + tmp;
  });
  return 'Albums/' + result;
}

export default Ember.Route.extend({
  album: Ember.inject.service('synology-album'),
  path: Ember.inject.service('synology-path'),

  model(params) {
		if(!params.album_id || params.album_id === '') {
      this.transitionTo('album');
    }

		var promises = {},
			path = this.get('path'),
			album = this.get('album'),
			show = this.get('show');

		var albumId = params.album_id,
			albumQryId = 'album_' + albumId;
		if(albumId === 'root') {
			albumQryId = '';
		} else {
			promises.path = path.checkpath({
				token: getPathQueryId(albumId),
      }).catch((err) => {
        Ember.Logger.error(err);
        Ember.Logger.error('get path for ' + albumId + ' failed');
      });
		}

		promises.album = album.list({
			id: albumQryId,
			type: 'album,photo,video',
			additional: 'album_permission,photo_exif,video_codec,video_quality,thumb_size,file_location',
    }).catch((err) => {
      Ember.Logger.error('get album for ' + albumQueryId + ' failed. ' + err);
    });

		return RSVP.hash(promises);
  }
});
