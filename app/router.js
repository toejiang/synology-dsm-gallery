import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL,


  //  this hack is to disable link-to sticky query params, if needed, link-to can specify _keep_sticky=true to enable it.
  //  like: {{#link-to route (query-params _keep_sticky=true)}}some text{{/link-to}}
  _hydrateUnsuppliedQueryParams(state, queryParams) {
    let sticky = queryParams._keep_sticky;
    delete queryParams._keep_sticky;
    return sticky ? this._super(state, queryParams) : queryParams;
  },  
});

Router.map(function() {
  this.route('test', function() {
    this.route('api');
    this.route('photoswipe', {path:'p/:site_id/:album_id'});
  });
  this.route('about');

  // album routes
  this.route('album/browse', {path:'album/:site_id/:album_id'});
  this.route('album/site', {path:'album/:site_id'});
  this.route('album', {path:'album'}, function() {
    this.route('test');
    this.route('detail');
  });

  this.route('share/browse', {path:'share/:site_id/:share_id'});
  this.route('share/site', {path:'share/:site_id'});
  this.route('share', {path:'share'}, function() {
    this.route('detail');
  });
  this.route('smart/browse', {path:'smart/:smart_id'});
  this.route('smart', {path:'smart'}, function() {
  });
});

export default Router;
