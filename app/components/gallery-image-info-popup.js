import Ember from 'ember';
import $ from 'jquery';

export default Ember.Component.extend({
  photo: Ember.inject.service('synology-photo'),

  popupItem: {
    item: null,
    detail: null, // a promise that resolve with detail data
  },

  init() {
    this._super(...arguments);
    this.set('actions', {
      open: this.open.bind(this),
      getThumbBoundsFn: this.getThumbBoundsFn.bind(this),
    });
  },

  getThumbBoundsFn: function getThumbBoundsFn(index) {
    var items = this.get('items'),
      item = items ? items[index] : null,
      id = item ? item.info.id : 0,
      ele = this.$('#'+id),
      pos = ele ? ele.position() : {left:0,top:0},
      width = ele ? ele.width() : 0;
    return {x:pos.left, y:pos.top, w:width};
  },

  open(hash) {
    var items = this.get('albumInfo.items'),
      site = this.get('albumInfo.site'),
      item = items[hash.index],
      curr = this.get('popupItem.item');
    if(curr && curr.info && item && item.info && (curr.info.id === item.info.id)) {
      return;
    }

    // get the detail info and set to 'popupItem'
    this.set('popupItem', {
      item: item,
      detail: this.get('photo').getexif(site, {id: item.info.id}),
    });

    // then open popup
    $.magnificPopup.open({
      items: {
        type: 'inline',
        src: $('#image-info-popup'),
      },
      callbacks: {
        close: function() {
          var _curr = this.get('popupItem.item');
          if(_curr && _curr === item)
            this.set('popupItem', {item:null,detail:null});
        }.bind(this),
      },
    });

  },
});
