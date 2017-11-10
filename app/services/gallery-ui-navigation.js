import Ember from 'ember';

export default Ember.Service.extend({
  _topbar: {
    component: 'gallery-topbar-floating',
    data: null,
  },

  topbar() {
    return this.get('_topbar');
  }
});
