import Ember from 'ember';

export default Ember.Route.extend({
  syno: Ember.inject.service('synology'),

  model(path) {
    return this.get('syno').album(true);
  },
});
