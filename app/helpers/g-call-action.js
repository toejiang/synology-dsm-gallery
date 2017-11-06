import Ember from 'ember';

export function gCallAction(actions) {
  if(actions) {
    actions.forEach((action) => {
      if(action)
        action();
    });
  }
}

export default Ember.Helper.helper(gCallAction);
