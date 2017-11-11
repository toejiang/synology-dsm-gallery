import Ember from 'ember';
import Utils from '../utils/utils';

export function gRandomString() {
  return Utils.randomString();
}

export default Ember.Helper.helper(gRandomString);
