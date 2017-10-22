import Ember from 'ember';
import RSVP from 'rsvp';
import Utils from '../../utils/utils';

export default Ember.Route.extend({
  album: Ember.inject.service('synology-album'),
  path: Ember.inject.service('synology-path'),
  utils: Ember.inject.service('synology-utils'),

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
				token: Utils.getPathQueryParamByAlbumId(albumId),
      }).catch((err) => {
        Ember.Logger.error(err);
        Ember.Logger.error('get path for ' + albumId + ' failed');
      });
		}

		promises.album = album.list({
			id: albumQryId,
			type: 'album,photo,video',
			additional: 'album_permission,photo_exif,video_codec,video_quality,thumb_size,file_location',
    })
    .then((res) => {
      var utils = this.get('utils');
      var items = [];
      res.data.items.forEach((item) => {
        items.push(
          RSVP.hash({
            src: utils.getAlbumImageSrc(item, 'small'),
            w: item.additional.thumb_size.small.resolutionx,
            h: item.additional.thumb_size.small.resolutiony,
            msrc: utils.getAlbumImageSrc(item, 'large'),
            pid: item.id,
            info: item,
          })
        );
      });
      return RSVP.hash({
        total: res.data.total,
        offset: res.data.offset,
        items: RSVP.all(items),
      });
    })
    .catch((err) => {
      Ember.Logger.error('get album for ' + albumQueryId + ' failed. ' + err);
    });

		return RSVP.hash(promises);
  }
});
