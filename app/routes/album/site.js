import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    this.transitionTo('album/browse', params.site_id, 'root');
  }
});
