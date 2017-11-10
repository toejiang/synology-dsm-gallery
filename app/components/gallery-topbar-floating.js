import Ember from 'ember';

export default Ember.Component.extend({

  didInsertElement() {
    this._super(...arguments);
    this.set('binding.THIS.scrolling', this.binding.scrolling.bind(this.get('binding.THIS')));
    this.set('binding.THIS.resizing', this.binding.resizing.bind(this.get('binding.THIS')));
    this.set('binding.THIS.component', this);
    this.set('binding.THIS.doc', this.$(document));
    this.set('binding.THIS.fixElement', this.$('#gallery-topbar-fix'));
    this.set('binding.THIS.floatElement', this.$('#gallery-topbar-float')[0]);
    this.set('binding.THIS.progressElement', this.$('#gallery-topbar-progress')[0]);
    this.$(window).bind('scroll', this.get('binding.THIS.scrolling'));
    this.$(window).bind('resize', this.get('binding.THIS.resizing'));
    this.get('binding.THIS.resizing')();
  },

  willRemoveElement() {
    this._super(...arguments);
    this.$(window).unbind('scroll', this.get('binding.THIS.scrolling'));
    this.$(window).unbind('resize', this.get('binding.THIS.resizing'));
  },

  binding: {
    THIS: {
      scrolling: null,
      resizing: null,
      floating: true,
      component: null,
      fixElement: null,
      floatElement: null,
      progressElement: null,
      doc: null,
    },
 
    resizing() {
      this.scrolling();
    },

    scrolling() {
      var lastScrollY = window.scrollY;
      var progressMax = this.doc.height() - window.innerHeight;

      var should = lastScrollY > (this.fixElement.position().top /*+ this.fixElement.height()*/);
      if(should && !this.floating) {
        this.floatElement.classList.add('gallery-topbar-float-active');
        this.floating = true;
      } else if(!should && this.floating) {
        this.floatElement.classList.remove('gallery-topbar-float-active');
        this.floating = false;
      }
      this.progressElement.setAttribute('max', progressMax);
      this.progressElement.setAttribute('value', lastScrollY);
    },
  },
});
