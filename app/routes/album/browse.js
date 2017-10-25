import Ember from 'ember';
import RSVP from 'rsvp';
import AjaxService from 'ember-ajax/services/ajax';
import AjaxRequest from 'ember-ajax/ajax-request';

export default Ember.Route.extend({
  path: Ember.inject.service('synology-path'),
  album: Ember.inject.service('synology-album'),

  model(params) {
  },
});
