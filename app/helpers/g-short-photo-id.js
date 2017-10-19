import Ember from 'ember';
import Utils from '../utils/utils';

export function gShortPhotoId(params/*, hash*/) {
  let [id] = params;
  return Utils.shortenPhotoId(id);
}

export default Ember.Helper.helper(gShortPhotoId);
