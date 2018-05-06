import Ember from 'ember';
import RSVP from 'rsvp';
import {computed} from '@ember/object';
import Utils from '../../utils/utils';

export default Ember.Controller.extend({
  navi: Ember.inject.service('gallery-ui-navigation'),
  ui: Ember.inject.service('gallery-ui'),

  queryParams: ['lightbox', 'popup', {showId:'show'}],
  lightbox: null,
  popup: null,
  showId: null,

  show: computed('showId', 'model', function () {
    var s = this.get('showId'),
      model = this.get('model');
    if(s && model && model.items) {
      var items = model.items;
      var idx = items.findIndex(e=>e.info.additional.public_share.shareid===s);
      var pre = (idx - 1) < 0 ? (items.length - 1) : (idx - 1);
      var nxt = (idx + 1) >= items.length ? (0) : (idx + 1);
      return idx >= 0 ? {
        route: 'share/site',
        site: model.site,
        pre: items[pre].info.additional.public_share.shareid,
        nxt: items[nxt].info.additional.public_share.shareid,
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

  photoswipeIndex: computed('lightbox', 'model.items', function () {
    var lightbox = this.get('lightbox');
    return !lightbox ? -1 : (this.get('model.items') || [])
      .findIndex(e=>e.info.additional.public_share.shareid.endsWith(lightbox));
  }),

  topbar: computed('show', 'model', function () {
    var show = this.get('show');
    var model = this.get('model');
    return {
      component: 'gallery-topbar-floating',
      data: show ? {
        inner: {
          component: 'gallery-topbar-inner',
          data: {
            route: 'share/site',
            site: show.site,
            path: {
              component: 'gallery-share-path',
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

  actions: {
    showDetail(site, item) {
      this.set('showId', item.info.additional.public_share.shareid);
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
      this.set('lightbox', item.info.additional.public_share.shareid);
    },
    onLightboxClose(site, item) {
      this.set('lightbox', null);
    },
    onLightboxChange(site, item) {
      this.set('lightbox', item.info.additional.public_share.shareid);
    },
    onShowChange(site, item) {
      this.set('showId', item.info.additional.public_share.shareid);
    },
  },
});
