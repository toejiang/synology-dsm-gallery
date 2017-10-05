import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  syno: Ember.inject.service('synology'),
  model() {
  }
});
