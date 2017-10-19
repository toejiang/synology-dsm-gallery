import Ember from 'ember';

export default Ember.Route.extend({
  photo: Ember.inject.service('synology-photo'),

  model(params) {
    if(!params.share_id || params.share_id === '') {
      this.transitionTo('share');
    }
    var shareId = params.share_id;
    var show = params.show;
    Ember.Logger.info('share/detail: shareid:' + shareId + ' show:' + show);

    return this.get('photo').list({
      filter_public_share: shareId,
    }).then((res) => {
      return {share: res, shareid: shareId, show: show};
    });
  }
});
