import Ember from 'ember';
import AjaxService from 'ember-ajax/services/ajax';

export default AjaxService.extend({
  session: Ember.inject.service(),
  cookies: Ember.inject.service(),

  headers: Ember.computed('session.data.syno-phpsessid', {
    get() {
      let session = this.get('session').get('data.syno-phpsessid');
      return { 'X-Syno-Token': session || '' };
    }
  }),

  _makeRequest(hash) {
    self = this;
    hash = hash || {};
    let beforesend = hash.beforeSend;
    hash.beforeSend = (xhr)=>{
      xhr.withCredentials = true;
      let h = self.get('headers');
      //let h = {'X-Syno-Token': this.get('cookies').read('PHPSESSID')};
      //let h = {'X-Syno-Token': this.get('session').get('data.syno-phpsessid') || ''};
      for(var k in h) {
        if(typeof(h[k]) != 'function')
          xhr.setRequestHeader(k, h[k]);
      }
      if(beforesend) {
        beforesend(...arguments);
      }
    };
    hash.xhrFields = {withCredentials:true};
    return this._super(...arguments);
  },

});