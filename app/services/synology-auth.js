import Ember from 'ember';

export default Ember.Service.extend({
  session: Ember.inject.service(),
  cookies: Ember.inject.service(),
  ajax: Ember.inject.service('synology-ajax'),
  api: Ember.inject.service('synology-apiinfo'),

  auth(method, site, hash) {
    site = (!site || site === '') ? 'root' : site;
    hash = hash || {};
    var session = this.get('session'),
      ajax = this.get('ajax'),
      api = this.get('api');

    return api.api('auth').then(api => {
      return ajax.post(api.url['root'], {
        data: {
          api: api.api,
          method: method || 'checkauth',
          version: 1,
          username: hash.username || '',
          password: hash.password || '',
          enable_syno_token: true,
        }
      }).then(res => {
        Ember.Logger.info('auth result: ' + JSON.stringify(res));
        if(res.success && res.success === true) {
          session.set('data.synology', res.data);
        }
        return res;
      });
    });
  },

  checkauth(site, hash) {
    return this.auth('checkauth', site, hash);
  },

  login(site, username, password) {
    return this.auth('login', site, {username,password});
  },

  logout(site) {
    return this.auth('logout', site);
  }
});
