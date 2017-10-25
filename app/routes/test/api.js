import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  album: Ember.inject.service('synology-album'),
  info: Ember.inject.service('synology-info'),
  path: Ember.inject.service('synology-path'),
  category: Ember.inject.service('synology-category'),

  model() {
    let promises = {};
    promises.albums = []; //this.get('store').query('album', {limit: 'all', filter: 'status:inactive'});
    //promises.apis = this.get('store').query('apiinfo', 1);
    promises.album = this.get('album').list();

    promises.albumxxx = [
      this.get('album').list(),
      this.get('album').list(),
      this.get('album').list(),
      this.get('album').list(),
      this.get('album').list(),
      this.get('album').list(),
      this.get('album').list(),
      this.get('album').list(),
      this.get('album').list(),
      this.get('album').list(),
    ];

    promises.info = this.get('info').getinfo();
    promises.category = this.get('category').category();
    promises.path = this.get('path').checkpath();
    return RSVP.hash(promises);
  }
});
