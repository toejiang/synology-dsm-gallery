import Ember from 'ember';

export default Ember.Route.extend({
  info: Ember.inject.service('synology-info'),

  model() {
    return this.get('info').getinfo();
  }
});
