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

  show: computed('showId', 'model.album.items', function () {
    var s = this.get('showId'), i = this.get('model.album.items'), site = this.get('model.site');
    if(s && i) {
      var idx = i.findIndex(e=>e.info.id.endsWith(s));
      var pre = (idx - 1) < 0 ? (i.length - 1) : (idx - 1);
      var nxt = (idx + 1) >= i.length ? (0) : (idx + 1);
      return idx >= 0 ? {
        route: 'album/browse',
        site: site,
        pre: Utils.shortenId(i[pre].info.id),
        nxt: Utils.shortenId(i[nxt].info.id),
        idx: idx,
        item: i[idx],
        items: i,
      } : null;
    }
    return null;
  }),

  hidePhotoSwipe: computed('showId', function () {
    return true && this.get('show');
  }),

  photoswipeIndex: computed('lightbox', 'model.album.items', function () {
    var lightbox = this.get('lightbox');
    return !lightbox ? -1 : (this.get('model.album.items') || []).findIndex(e=>e.info.id.endsWith(lightbox));
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
            route: 'album/browse',
            site: model.site,
            path: {
              component: 'gallery-album-path',
              data: model.path,
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
    showDetail(item) {
      this.set('showId', Utils.shortenId(item.info.id));
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
      this.set('lightbox', Utils.shortenId(item.info.id));
    },
    onLightboxClose(site, item) {
      this.set('lightbox', null);
    },
    onLightboxChange(site, item) {
      this.set('lightbox', Utils.shortenId(item.info.id));
    },
    onShowChange(site, item) {
      this.set('showId', Utils.shortenId(item.info.id));
    },
  },
});
