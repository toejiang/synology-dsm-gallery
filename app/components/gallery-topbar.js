import Ember from 'ember';
import {computed} from '@ember/object';

export default Ember.Component.extend({
  navi: Ember.inject.service('gallery-ui-navigation'),

  topbar: computed('navi.topbar', function () {
    return this.get('navi').topbar;
  }),
});
