import Ember from 'ember';
import {computed} from '@ember/object';
import Utils from '../utils/utils';

export default Ember.Component.extend({
  ui: Ember.inject.service('gallery-ui'),
  tagName: 'div',

  classNames: ['gallery-preview-resize-wrap'],

  maxHeight: 480,
  minHeight: 60,
  defHeight: 320,
  curHeight: computed('ui.previewHeight', function () {
    return this.get('ui.previewHeight');
  }),

  init() {
    this._super(...arguments);
    this.set('inputElementId', Utils.randomString());
  },

  actions: {
    change() {
      var value = this.$('#' + this.get('inputElementId'))[0].value;
      var curHeight = this.get('curHeight');
      if(curHeight === value)
        return;
      this.set('ui.previewHeight', value);
    },
  },
});
