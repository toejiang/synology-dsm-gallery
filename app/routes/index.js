import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  session: Ember.inject.service(),
  cookies: Ember.inject.service(),

  beforeModel() {
    //this.replaceWith('album');
  },

  model() {
    var p = {},
      session = this.get('session'),
      cookies = this.get('cookies');

    return RSVP.hash(p);
  }
});
