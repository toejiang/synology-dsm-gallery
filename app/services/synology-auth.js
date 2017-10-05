import Ember from 'ember';

export default Ember.Service.extend({
  session: Ember.inject.service(),
  cookies: Ember.inject.service(),
  ajax: Ember.inject.service('synology-ajax'),
  api: Ember.inject.service('synology-apiinfo'),

  checkauth(hash) {
    var hash = hash || {},
      session = this.get('session'),
      cookies = this.get('cookies'),
      ajax = this.get('ajax'),
      api = this.get('api');

    return api.url('auth').then(api => {
      return ajax.post(api.url, {
        data: {
          api: api.api,
          method: 'checkauth',
          version: 1,
          ps_username: '',
        }
      }).then(res => {
        Ember.Logger.info('auth result: ' + JSON.stringify(res));
        if(res.success && res.success === true) {
        //  cookies.write('PHPSESSID', res.data.sid);
          session.set('data.syno-phpsessid', res.data.sid);
        }
        return res;
      });
    });
  }
});
