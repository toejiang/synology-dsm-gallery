import Ember from 'ember';

export default Ember.Controller.extend({
  syno: Ember.inject.service('synology'),
  ajax: Ember.inject.service('synology-ajax'),

	isExpanded: false,
	album: {},
	infoResult: '',
	authResult: '',
	getResult: '',
	pathResult: '',
	albumResult: '',
	getResult: '',

  actions: {
    doInfo() {
			this.set('infoResult', 'waiting...');
      this.get('syno').info().then((res)=>{
				this.set('infoResult', 'OK');
        Ember.Logger.info('doInfo: '+JSON.stringify(res));
        return res;
      }).catch((e)=>{
				this.set('infoResult', 'ERR');
				;
			});
    },
    doAuth() {
			this.set('authResult', 'waiting...');
      this.get('syno').auth().then((res)=>{
				this.set('authResult', 'OK');
        Ember.Logger.info('doAuth: '+JSON.stringify(res));
        return res;
      }).catch((e)=>{
				this.set('authResult', 'ERR');
				;
			});
    },
    doPath() {
			this.set('pathResult', 'waiting...');
      this.get('syno').path({
				token: 'Albums/album_746f65/album_746f652f7075626c6963/album_746f652f7075626c69632f7031/album_746f652f7075626c69632f70312f703131',
        method: 'checkpath',
      }).then((res)=>{
        Ember.Logger.info('doPath OK');
				this.set('pathResult', 'OK');
			}).catch(e=>{
				this.set('pathResult', 'ERR');
        Ember.Logger.error('doPath error');
        Ember.Logger.error(e);
      });
		},
		doAlbum() {
			this.set('albumResult', 'waiting...');
			var isExpanded = this.get('isExpanded');
			if(!isExpanded) {
      	this.get('syno').album({
					id: 'album_746f652f7075626c6963',
					type: 'album,photo,video',
      	  additional: 'album_permission,photo_exif,video_codec,video_quality,thumb_size,file_location',
				}).then(res=>{
					this.set('album', res);
      		this.toggleProperty('isExpanded');
        	Ember.Logger.info('doAlbum: OK');
			    this.set('albumResult', 'OK');
				}).catch(e=>{
			    this.set('albumResult', 'ERR');
					Ember.Logger.error('doAlbum error');
					Ember.Logger.error(e);
				});
			} else {
			  this.set('albumResult', 'clear');
				this.set('album', {});
      	this.toggleProperty('isExpanded');
			}
		},
    doGet() {
      this.set('getResult', 'waiting...');
      this.get('syno').album({
          id: 'dslkf',
          type: 'album',
      }).then((res)=>{
        this.set('getResult', 'OK');
      }).catch((err)=>{
        this.set('getResult', 'ERR');
        Ember.Logger.error(err);
      });
    }
	}
});
