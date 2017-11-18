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

  show: computed('showId', 'model.items', function () {
    var s = this.get('showId'), i = this.get('model.items'), site = this.get('model.site');
    if(s && i) {
      var idx = i.findIndex(e=>e.info.id.endsWith(s));
      var pre = (idx - 1) < 0 ? (i.length - 1) : (idx - 1);
      var nxt = (idx + 1) >= i.length ? (0) : (idx + 1);
      return idx >= 0 ? {
        route: 'share/browse',
        site: site,
        pre: Utils.shortenId(i[pre].info.id),
        nxt: Utils.shortenId(i[nxt].info.id),
        idx: idx,
        item: i[idx],
      } : null;
    }
    return null;
  }),

  hidePhotoSwipe: computed('showId', function () {
    return true && this.get('show');
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
            route: 'share/browse',
            site: model.site,
            path: {
              component: 'gallery-share-path',
              data: {
                site: model.site,
                shareid: model.shareid,
                info: model.info,
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
    showDetail(item) {
      this.set('showId', Utils.shortenId(item.info.id));
    },
    closeDetail() {
      this.set('showId', null);
    },

    onDetailOpen(item) {
      this.set('popup', Utils.shortenPhotoId(item.info.id));
    },
    onDetailClose(item) {
      this.set('popup', null);
    },
    onDetailChange(item) {
      this.set('popup', Utils.shortenPhotoId(item.info.id));
    },
    onLightboxOpen(item) {
      this.set('lightbox', Utils.shortenPhotoId(item.info.id));
    },
    onLightboxClose(item) {
      this.set('lightbox', null);
    },
    onLightboxChange(item) {
      this.set('lightbox', Utils.shortenPhotoId(item.info.id));
    },
  }
});
