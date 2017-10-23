import Ember from 'ember';
import Utils from '../../utils/utils';

export default Ember.Controller.extend({
  ajax: Ember.inject.service('synology-ajax'),
  info: Ember.inject.service('synology-info'),
  auth: Ember.inject.service('synology-auth'),
  path: Ember.inject.service('synology-path'),
  album: Ember.inject.service('synology-album'),
  accur: Ember.inject.service('synology-accur'),
  smart: Ember.inject.service('synology-smart'),
  photo: Ember.inject.service('synology-photo'),

  isExpanded: false,
  infoResult: '',
  authResult: '', authUser:'user', authPass: '123',
  getResult: '',
  pathResult: '', pathQryParam: 'album_6361722f6769726c73',
  albumResult: '', albumQryParam: 'album_636172',
  getResult: '',
  accurResult: '',
  smartResult: '',
  photoResult: '', photoQryHash: '{filter_smart:\'smart_622e736d6172742e7331\'}',
  xhrResult: '', xhrUrl: 'http://192.168.56.26/a',

  actions: {
    doInfo() {
      this.set('infoResult', 'waiting...');
      this.get('info').getinfo().then((res)=>{
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
      this.get('auth').checkauth().then((res)=>{
        this.set('authResult', 'OK');
        Ember.Logger.info('doAuth: '+JSON.stringify(res));
        return res;
      }).catch((e)=>{
        this.set('authResult', 'ERR');
      });
    },
    doLogin() {
      this.set('authResult', 'waiting...');
      this.get('auth').login(this.get('authUser'),this.get('authPass'))
      .then((res)=>{
        if(res && res.success)
          this.set('authResult', 'login OK');
        else
          this.set('authResult', 'login failed');
        Ember.Logger.info('doLogin: '+JSON.stringify(res));
        return res;
      }).catch((e)=>{
        this.set('authResult', 'ERR');
      });
    },
    doLogout() {
      this.set('authResult', 'waiting...');
      this.get('auth').logout().then((res)=>{
        this.set('authResult', 'logout OK');
        Ember.Logger.info('doLogin: '+JSON.stringify(res));
        return res;
      }).catch((e)=>{
        this.set('authResult', 'ERR');
      });
    },
    doPath() {
      this.set('pathResult', 'waiting...');
      var qryToken = this.get('pathQryParam');
      this.get('path').checkpath({
        token: Utils.getPathQueryParamByAlbumId(qryToken),
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
      var qryId = this.get('albumQryParam');
      var isExpanded = this.get('isExpanded');
      if(!isExpanded) {
        this.get('album').list({
          id: qryId,
          type: 'album,photo,video',
          additional: 'album_permission,photo_exif,video_codec,video_quality,thumb_size,file_location',
        }).then(res=>{
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
        this.toggleProperty('isExpanded');
      }
    },
    doAccur() {
      this.set('accurResult', 'waiting...');
      this.get('accur').list({
          id: 'dslkf',
          type: 'album',
          limit: 50,
      }).then((res)=>{
        this.set('accurResult', 'OK: '+ JSON.stringify(res));
      }).catch((err)=>{
        this.set('accurResult', 'ERR');
        Ember.Logger.error(err);
      });
    },
    doGet() {
      this.set('getResult', 'waiting...');
      this.get('album').list({
          id: 'dslkf',
          type: 'album',
      }).then((res)=>{
        this.set('getResult', 'OK');
      }).catch((err)=>{
        this.set('getResult', 'ERR');
        Ember.Logger.error(err);
      });
    },
    doSmart() {
      this.set('smartResult', 'waiting...');
      this.get('smart').list({
          id: 'dslkf',
          type: 'album',
      }).then((res)=>{
        this.set('smartResult', 'OK: ' + JSON.stringify(res));
      }).catch((err)=>{
        this.set('smartResult', 'ERR');
        Ember.Logger.error(err);
      });
    },
    doPhoto() {
      this.set('photoResult', 'waiting...');
      var hash = {}, promise = null;
      try {
        hash = eval("(" + this.get('photoQryHash') + ")");
      } catch(e) {
        Ember.Logger.error('doPhoto: param error');
        this.set('photoResult', 'ERR: param error');
        return;
      }
      if(hash.filter_album) {
        promise = this.get('photo').listalbum({filter_album:hash.filter_album });
      } else if(hash.filter_public_share) {
        promise = this.get('photo').listshare({filter_public_share:hash.filter_public_share});
      } else if(hash.filter_smart) {
        promise = this.get('photo').listsmart({filter_smart:hash.filter_smart, sort_by:'filename', limit:50});
      } else {
        Ember.Logger.error('no param set');
        this.set('photoResult', 'ERR: no param set, filter_album | filter_public_share | filter_smart required');
        return;
      }
      if(promise)
        promise.then((res)=>{
          this.set('photoResult', 'OK: ' + JSON.stringify(res));
        }).catch((err)=>{
          this.set('photoResult', 'ERR');
          Ember.Logger.error(err);
        });
    },
    doXhr() {
      this.set('xhrResult', 'waiting...');
      var hash = {}, promise = null;
      this.get('ajax').request(this.get('xhrUrl'), {
        method: 'GET',
        data: {
          some_data: '1111888idf',
        }
      })
      .then((res) => {
        this.set('xhrResult', JSON.stringify(res));
      });
    },
  }
});
