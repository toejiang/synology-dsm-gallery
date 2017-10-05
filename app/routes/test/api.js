import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  syno: Ember.inject.service('synology'),
  model() {
    let promises = {};
    promises.albums = []; //this.get('store').query('album', {limit: 'all', filter: 'status:inactive'});
    //promises.apis = this.get('store').query('apiinfo', 1);
    promises.album = this.get('syno').album();

    promises.albumxxx = [
      this.get('syno').album(),
      this.get('syno').album(),
      this.get('syno').album(),
      this.get('syno').album(),
      this.get('syno').album(),
      this.get('syno').album(),
      this.get('syno').album(),
      this.get('syno').album(),
      this.get('syno').album(),
      this.get('syno').album(),
    ];

    promises.info = this.get('syno').info();
    promises.category = this.get('syno').category();
    promises.path = this.get('syno').path();
    return RSVP.hash(promises);
  }
});
