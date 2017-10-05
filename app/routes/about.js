import Ember from 'ember';

export default Ember.Route.extend({
  syno: Ember.inject.service('synology'),

  model() {
    return this.get('syno').info();
  }
});
