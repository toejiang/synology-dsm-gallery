import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('test', function() {
    this.route('api');
    this.route('photoswipe');
  });
  this.route('about');

  // album routes
  this.route('album/detail', {path:'album/:site_id/:album_id'});
  this.route('album/site', {path:'album/:site_id'});
  this.route('album', {path:'album'}, function() {
    this.route('test');
    this.route('browse');
  });

  this.route('share/detail', {path:'share/:site_id/:share_id'});
  this.route('share/site', {path:'share/:site_id'});
  this.route('share', {path:'share'}, function() {
    this.route('browse');
  });
  this.route('smart/detail', {path:'smart/:smart_id'});
  this.route('smart', {path:'smart'}, function() {
  });
});

export default Router;
