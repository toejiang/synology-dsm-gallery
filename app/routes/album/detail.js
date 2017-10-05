import Ember from 'ember';
import RSVP from 'rsvp';
import AjaxService from 'ember-ajax/services/ajax';
import AjaxRequest from 'ember-ajax/ajax-request';

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
  syno: Ember.inject.service('synology'),

  model(params) {
    if(!params.album_id || params.album_id === '') {
      this.transitionTo('album');
    }
    var [albumId, photoId] = params.album_id.split('_'),
      albumQueryId = 'album_' + albumId,
      pathQueryId = getPathQueryId(albumId),
      current = {albumId:albumId,displayPhoto:undefined}, // data will be set after album listing
      promises = {},
      syno = this.get('syno');

    // set current
    promises.current = RSVP.resolve(current);

    // set path
    if(albumId === 'root') {
      albumQueryId = '';
    } else {
      promises.path = syno.path({
        token: pathQueryId,
        method: 'getpath',
      }).catch((err) => {
        Ember.Logger.error(err);
        Ember.Logger.error('get path for ' + albumQueryId + ' failed');
      });
    }

    // set album
    promises.album = syno.album({
        id: albumQueryId,
        type: 'album,photo,video',
        additional: 'album_permission,photo_exif,video_codec,video_quality,thumb_size,file_location',
      }).then((res) => {
        if(photoId) {
          var displayPhotoId = 'photo_' + albumId + '_' + photoId;
          current.displayPhoto = res.data.items.find((a)=>a.id===displayPhotoId);
        }
        return res;
      }).catch((err) => {
        Ember.Logger.error('get album for ' + albumQueryId + ' failed. ' + err);
      });

    return RSVP.hash(promises);
  },
});