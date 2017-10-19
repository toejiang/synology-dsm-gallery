import Ember from 'ember';
import Utils from '../utils/utils';

export function gShortId(params/*, hash*/) {
  let [id] = params;
  return Utils.shortenId(id);
}

export default Ember.Helper.helper(gShortId);
