import Ember from 'ember';

export function gAlbumImageShortid(params/*, hash*/) {
  let [id,trimPhotoPart] = params,
    parts = id.split('_'),
    result = parts[1] + (trimPhotoPart?'':(parts[2]?('_'+parts[2]):''));
  return result;
}

export default Ember.Helper.helper(gAlbumImageShortid);
