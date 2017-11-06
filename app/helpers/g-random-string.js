import Ember from 'ember';

export function gRandomString() {
  return Math.random().toString(36).substr(2);
}

export default Ember.Helper.helper(gRandomString);
