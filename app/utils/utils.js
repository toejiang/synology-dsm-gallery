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
  },

	// turn 312f322f332f34 to Albums/album_31/album_312f32/album_312f322f33/album_312f322f332f34
	// turn album_312f322f332f34 to Albums/album_31/album_312f32/album_312f322f33/album_312f322f332f34
	// turn photo_312f322f332f34_363738 to Albums/album_31/album_312f32/album_312f322f33/album_312f322f332f34/photo_312f322f332f34_363738
	getPathQueryParamByAlbumId: function getPathQueryParamByAlbumId(id) {
	  var albumId = (id || '').toLowerCase(),
		isPhotoId = null;

		if(albumId.startsWith('album_')) {
			albumId = albumId.split('_')[1];
		} else if(albumId.startsWith('photo_')) {
			isPhotoId = true;
			albumId = albumId.split('_')[1];
		} else {
			albumId = albumId.split('_')[0];
		}

	  var parts = albumId.split('2f'),
	    result = '',
	    tmp = '';
	  parts.forEach((e)=>{
	    if(result != '') result+='/';
	    if(tmp != '') tmp += '2f';
	    tmp += e;
	    result += 'album_' + tmp;
	  });
	  return 'Albums/' + result + (isPhotoId ? ('/' + id) : '');
	},
}
