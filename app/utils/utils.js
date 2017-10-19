export default {
  shortenId: function shortenId(id) {
    if(!id || id === '')
      return '';
    var type = id.split('_')[0];
    if(id.startsWith('album_'))
      return id.substr(6, id.length);
    else if(id.startsWith('photo_'))
      return id.substr(6, id.length);
    else if(id.startsWith('sharedalbum_'))
      return id.substr(12, id.length);
    else
      return id;
  },

  shortenPhotoId: function shortenPhotoId(id) {
    if(!id || id === '')
      return '';
    if(id.startsWith('photo_'))
      return id.split('_').pop();
    return id;
  },

  shortenAlbumId: function shortenAlbumId(id) {
    if(!id || id === '')
      return '';
    if(id.startsWith('photo_'))
      return id.split('_')[1];
    else if(id.startsWith('album_'))
      return id.split('_').pop();
    else if(id.startsWith('sharedalbum_'))
      return id.split('_').pop();
    else if(id.startsWith('smartalbum_'))
      return id.split('_').pop();
    return id;
  }
}
