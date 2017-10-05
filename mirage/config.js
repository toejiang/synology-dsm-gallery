export default function() {
  let synoAlbum = {
    success:true,
    data: {
      items:[{
        id:'id-album0001',
        info: {
          description:"description of id-album0001",
          sharepath:"/",
          name:"/",
          title:"Accur Photo",
          hits:null,
          allow_comment:false,
          type:"public",
          conversion:true,
          allow_embed:false
        },
        additional: {
          album_sorting: {
            sort_by:"filename",
            sort_direction:"asc",
            has_preference_sort:false
          }
        }
      }]
    }
  };

  this.passthrough('http://app.accur.cc/**');

  this.get('/webapi/2albums', () => {
    //return {data: [{type: 'albums', id: 'id-album0001', attributes: {info:'id-a-info0001',additional:'id-a-addinfo0001',somemsg:'somemsg-for-album'}}]};
    return {
      data: [{
        info:{description:'desccccc',title:'tittttle',name:'nnaamme'},
        additional:{album_sorting:'desccccc'},
        somemsg:'somemsg-for-album'
      }]
    };
  });

  this.get('/webapi/albums', () => {
    return {albums:synoAlbum.data.items};
  });

  this.get('/album-info', () => {
    return {data: {type: 'album-info', id: 'id-a-info0001', attributes: {album:'id-album0001',description:'desccccc',title:'tittttle',name:'nnaamme'}}};
  });

  this.get('/album-additional-info', () => {
    return {data: {type: 'album-additional-info', id: 'id-a-addinfo0001', attributes: {album:'id-album0001',album_sorting:'desccccc'}}};
  });

  this.get('/album.php', () => {
    return {data: [{somemsg:'somemsg-for-album'},{somemsg:'somemsg-for-album2222'}]};
  });
}
