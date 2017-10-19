import Ember from 'ember';
import {computed} from '@ember/object';

export default Ember.Controller.extend({
  queryParams: ['show'],
  show: null,
});
