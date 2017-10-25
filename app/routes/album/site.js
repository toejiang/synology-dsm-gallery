import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    this.transitionTo('album/detail', params.site_id, 'root');
  }
});
