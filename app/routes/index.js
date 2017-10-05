import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  session: Ember.inject.service(),
  cookies: Ember.inject.service(),
  syno: Ember.inject.service('synology'),

  beforeModel() {
    //this.replaceWith('album');
  },

  model() {
    var p = {},
      syno = this.get('syno'),
      session = this.get('session'),
      cookies = this.get('cookies');

    return RSVP.hash(p);
  }
});
