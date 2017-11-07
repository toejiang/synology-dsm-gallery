import Ember from 'ember';
import RSVP from 'rsvp';
import Utils from '../../utils/utils';

export default Ember.Route.extend({
  album: Ember.inject.service('synology-album'),
  path: Ember.inject.service('synology-path'),
  utils: Ember.inject.service('synology-utils'),

  //  return like:
  //  {
  //    path: ...
  //    album: {
  //      site: 'root',
  //      total: 2,
  //      offset: 0,
  //      items: {
  //        {
  //          src: 'http://your-nas.com/photo/webapi/thumbnail.php?size=large&xxx=xx',
  //          w: 240,
  //          h: 320,
  //          msrc: 'http://your-nas.com/photo/webapi/thumbnail.php?size=small&xxx=xx',
  //          ...
  //        },
  //        {
  //          src: 'http://your-nas.com/photo/webapi/thumbnail.php?size=large&xxx=xx',
  //          w: 240,
  //          h: 320,
  //          msrc: 'http://your-nas.com/photo/webapi/thumbnail.php?size=small&xxx=xx',
  //          ...
  //        },
  //      }
  //    }
  //  }
  model(params) {
		if(!params.site_id || params.site_id === '') {
      this.transitionTo('album');
    }
		if(!params.album_id || params.album_id === '') {
      this.transitionTo('album');
    }

		var path = this.get('path'),
			album = this.get('album'),
      site = params.site_id;
		var promises = {
      site: site,
    };

		var albumId = params.album_id,
			albumQryId = 'album_' + albumId;
		if(albumId === 'root') {
			albumQryId = '';
		} else {
			promises.path = path.checkpath(site, {
				token: Utils.getPathQueryParamByAlbumId(albumId),
      }).catch((err) => {
        Ember.Logger.error(err);
        Ember.Logger.error('get path for ' + site + '/' + albumId + ' failed');
      });
		}

		promises.album = album.list(site, {
			id: albumQryId,
			type: 'album,photo,video',
			additional: 'album_permission,photo_exif,video_codec,video_quality,thumb_size,file_location',
    })
    .then((res) => {
      var utils = this.get('utils');
      var items = [];
      res.data.items.forEach((item) => {
        items.push(
          RSVP.hash(item.type === 'video' ? {
            html: this.get('utils').buildHtmlForPhotoSwipeVideo(site, item),
            msrc: utils.getAlbumImageSrc(site, item, 'small'),
            info: item,
          } : {
            src: utils.getAlbumImageSrc(site, item, 'large'),
            w: item.additional.thumb_size.large.resolutionx,
            h: item.additional.thumb_size.large.resolutiony,
            msrc: utils.getAlbumImageSrc(site, item, 'small'),
            preview: utils.getAlbumImageSrc(site, item, 'preview'),
            pid: item.id,
            info: item,
          })
        );
      });
      return RSVP.hash({
        site: site,
        total: res.data.total,
        offset: res.data.offset,
        items: RSVP.all(items),
      });
    })
    .catch((err) => {
      Ember.Logger.error('get album for ' + albumQryId + ' failed. ');
      Ember.Logger.error(err);
    });

		return RSVP.hash(promises);
  }
});
