import Ember from 'ember';

export function setProperty([__this, name, value]) {
  __this.set(name, value);
}

export default Ember.Helper.helper(setProperty);
