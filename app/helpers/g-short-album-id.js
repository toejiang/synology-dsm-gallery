import Ember from 'ember';
import Utils from '../utils/utils';

export function gShortAlbumId(params/*, hash*/) {
  let [id] = params;
  return Utils.shortenAlbumId(id);
}

export default Ember.Helper.helper(gShortAlbumId);
