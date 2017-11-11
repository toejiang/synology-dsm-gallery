import Ember from 'ember';
import {computed} from '@ember/object';
import Utils from '../utils/utils';

export default Ember.Component.extend({
  ui: Ember.inject.service('gallery-ui'),

  maxHeight: 480,
  minHeight: 60,
  defHeight: 320,
  curHeight: computed('ui.previewHeight', function () {
    return this.get('ui.previewHeight');
  }),

  init() {
    this._super(...arguments);
    this.set('id', Utils.randomString());
  },

  actions: {
    change() {
      var value = this.$('#' + this.get('id'))[0].value;
      var curHeight = this.get('curHeight');
      if(curHeight === value)
        return;
      this.set('ui.previewHeight', value);
    },
  },
});
