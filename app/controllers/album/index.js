import Ember from 'ember';
import {computed} from '@ember/object';
import Utils from '../../utils/utils';
import $ from 'jquery';
import RSVP from 'rsvp';

export default Ember.Controller.extend({
  navi: Ember.inject.service('gallery-ui-navigation'),
  ui: Ember.inject.service('gallery-ui'),

  queryParams: ['lightbox', 'popup', {showId:'show'}],
  lightbox: null,
  popup: null,
  showId: null,

  show: computed('showId', 'model', function () {
    var s = this.get('showId'),
      [site, id] = s ? s.split(':') : [null, null],
      model = this.get('model'),
      data = model.find(e=>e.site===site);
    if(s && data && data.items) {
      var items = data.items;
      var idx = items.findIndex(e=>e.info.id.endsWith(id));
      var pre = (idx - 1) < 0 ? (items.length - 1) : (idx - 1);
      var nxt = (idx + 1) >= items.length ? (0) : (idx + 1);
      return idx >= 0 ? {
        route: 'album',
        site: site,
        pre: site + ':' + Utils.shortenId(items[pre].info.id),
        nxt: site + ':' + Utils.shortenId(items[nxt].info.id),
        idx: idx,
        item: items[idx],
        items: items,
      } : null;
    }
    return null;
  }),

  hidePhotoSwipe: computed('showId', function () {
    return true && this.get('show');
  }),

  photoswipeIndex: computed('lightbox', 'model', function () {
    var {lightbox, model} = this.getProperties('lightbox', 'model'),
      [site, id] = lightbox ? lightbox.split(':') : [null, null],
      r = {};
    if(!site || !id || site === '' || id === '')
      return r;
    var data = model.find(e=>e.site===site);
    if(data && data.items)
      r[site] = data.items.findIndex(e=>e.info.id.endsWith(id));
    return r;
  }),

  topbar: computed('show', 'model.path', function () {
    var show = this.get('show');
    var model = this.get('model');
    return {
      component: 'gallery-topbar-floating',
      data: show ? {
        inner: {
          component: 'gallery-topbar-inner',
          data: {
            route: 'album',
            site: show.site,
            path: {
              component: 'gallery-album-path',
              data: {
                site: show.site,
              },
            },
            show: show,
          },
        },
      } : null,
    };
  }),

  init() {
    this._super(...arguments);
    this.addObserver('showId', this, (sender, key, value, rev) => {
      RSVP.resolve().then(()=>{
        this.set('navi.topbar', this.get('topbar'));
      });
    });
  },

  willDestroy() {
    this._super(...arguments);
    this.set('showId', null);
  },

  actions: {
    showDetail(site, item) {
      this.set('showId', site + ':' + Utils.shortenId(item.info.id));
    },
    closeDetail() {
      this.set('showId', null);
    },

    onDetailOpen(item) {
      this.set('popup', Utils.shortenId(item.info.id));
    },
    onDetailClose(item) {
      this.set('popup', null);
    },
    onDetailChange(item) {
      this.set('popup', Utils.shortenId(item.info.id));
    },
    onLightboxOpen(site, item) {
      this.set('lightbox', site + ':' + Utils.shortenId(item.info.id));
    },
    onLightboxClose(site, item) {
      this.set('lightbox', null);
    },
    onLightboxChange(site, item) {
      this.set('lightbox', site + ':' + Utils.shortenId(item.info.id));
    },
    onShowChange(site, item) {
      this.set('showId', site + ':' + Utils.shortenId(item.info.id));
    },
  },
});
