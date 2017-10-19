import Ember from 'ember';

export default Ember.Route.extend({
  accur: Ember.inject.service('synology-accur'),
  model() {
    return this.get('accur').list();
  }
});
