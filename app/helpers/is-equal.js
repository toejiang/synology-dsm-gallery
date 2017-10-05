import Ember from 'ember';

export function isEqual(params/*, hash*/) {
  let [p1,p2] = params;
  return p1 === p2;
}

export default Ember.Helper.helper(isEqual);
