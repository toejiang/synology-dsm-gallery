import Ember from 'ember';
import RSVP from 'rsvp';
import ENV from '../config/environment';

var Trigger = Ember.Object.extend(Ember.Evented, {
  fire: function() {
    this.trigger('fire');
  }
});

export default Ember.Service.extend({
  ajax: Ember.inject.service('synology-ajax'),

  _apiInfo: {
    sites: false,
    API:{}, // Object struct like:
            // API: {
            //   album: {
            //     url: {
            //       root: 'http://my-nas.com/photo/webapi/album.php',
            //       tom: 'http://my-nas.com/~tom/photo/webapi/album.php',
            //       jelly: 'http://my-nas.com/~jelly/photo/webapi/album.php',
            //     },
            //     api: 'SYNO.PhotoStation.Album'
            //   },
            //   photo: {
            //     url: {
            //       root: 'http://my-nas.com/photo/webapi/photo.php',
            //       tom: 'http://my-nas.com/~tom/photo/webapi/photo.php',
            //       jelly: 'http://my-nas.com/~jelly/photo/webapi/photo.php',
            //     },
            //     api: 'SYNO.PhotoStation.Photo'
            //   }
            // 
    initialApiQueryHandling: false, // true when a is handling
    initializeDone: false, // true when all init is done, including api query
  },

  trigger: Trigger.create(),

  api(name) {
    return this.checkInit().then((apiInfo) => {
      return apiInfo.API[name];
    });
  },

  sites() {
    return this.checkInit().then((apiInfo) => {
      return apiInfo.sites;
    });
  },

  checkInit() {
    let _self = this;
    let api = _self.get('_apiInfo');

    if(!api || !api.initializeDone || !api.API || !api.API.api) {

      // if handling, just wait for compilite
      if(api.initialApiQueryHandling)  {
        return new RSVP.Promise((resolve) => {
          // only trigger once
          _self.get('trigger').one('fire',() => {
            resolve(api);
          });
        });
      }

      api.initialApiQueryHandling = true;

      return this.doInit()
      .then((result) => {
        api.sites = result.sites;
        api.API = result.api;
        api.initializeDone = true;
        api.initialApiQueryHandling = false;
        _self.get('trigger').fire();
        return api;
      })
      .catch((err) => {
        api.initialApiQueryHandling = false;
        api.initializeDone = false;
        Ember.Logger.error(err);
      });
    }
    return RSVP.Promise.resolve(api);
  },

  doInit() {
    let _self = this;
    var api = _self.get('_apiInfo');
    var ajax = _self.get('ajax');
    var conf = this.parseSynoApiURL();
    var sites = null;
    return RSVP.hash({
      sites: _self.checkEnabledSite(conf.rootUrl),
      config: _self.parseSynoApiURL(),
      apiinfo: ajax.post(conf.rootUrl + 'query.php', {
        data:{
          query:'all',
          api:'SYNO.API.Info',
          method:'query',
          version:1,
          ps_username:''
        }
      }),
    })
    .then((arg)=>{
      sites = arg.sites;
      // build the apiInfo
      return _self.buildApiInfo(arg.sites, arg.config, arg.apiinfo);
    })
    .then((services) => {
      // to do a init alum request, so that photostation can set session cache
      var album = services['album'];
      return _self.get('ajax').post(album.url['root'], {
        data: {
          'x-comment': 'initialize_query_for_access_control',
          id: '',
          type: 'album',
          api: album.api,
          method: 'list',
          version: 1,
          offset: 0,
          limit: 1,
        }
      })
      .then(() => {
        return {sites, api: services};
      })
      .catch(() => {
        return {sites, api: services};
      });
    });
  },

  //  args like:
  //    sites: ["user1","user2",user3"],
  //    config: {
  //      rootUrl: 'http://your-nas.com/photo/webapi/',
  //      siteUrl: {
  //        prefix: 'http://your-nas.com/',
  //        postfix: 'photo/webapi/',
  //      }
  //    },
  //    api: {
  //      "success":true,
  //      "data":{
  //        "SYNO.PhotoStation.Auth":{"path":"auth.php","minVersion":1,"maxVersion":1},
  //        "SYNO.PhotoStation.Info":{"path":"info.php","minVersion":1,"maxVersion":2},
  //        "SYNO.PhotoStation.Album":{"path":"album.php","minVersion":1,"maxVersion":1}
  //      }
  //    }
  // 
  //  return like:
  //    {
  //      auth: {
  //        api: 'SYNO.PhotoStation.Auth',
  //        url: {
  //          root: http://your-nas.com/photo/webapi/auth.php',
  //          user1: http://your-nas.com/~user1/photo/webapi/auth.php'.
  //          user2: http://your-nas.com/~user2/photo/webapi/auth.php'.
  //          user3: http://your-nas.com/~user3/photo/webapi/auth.php'.
  //        }
  //      },
  //      info: {
  //        api: 'SYNO.PhotoStation.Info',
  //        url: {
  //          root: http://your-nas.com/photo/webapi/info.php',
  //          user1: http://your-nas.com/~user1/photo/webapi/info.php'.
  //          user2: http://your-nas.com/~user2/photo/webapi/info.php'.
  //          user3: http://your-nas.com/~user3/photo/webapi/info.php'.
  //        }
  //      },
  //      ...
  //    }
  buildApiInfo(sites, config, api) {
    if(api.success) {
      let data = api.data,
        services = {};

      // add accur support
      data['ACCUR.PhotoStation.API'] = {
        path: 'accur.php',
        minVersion: 1,
        maxVersion: 1,
      };

      [
        {key: "auth",          api: "SYNO.PhotoStation.Auth"          },
        {key: "info",          api: "SYNO.PhotoStation.Info"          },
        {key: "album",         api: "SYNO.PhotoStation.Album"         },
        {key: "share",         api: "SYNO.PhotoStation.SharedAlbum"   },
        {key: "smart",         api: "SYNO.PhotoStation.SmartAlbum"    },
        {key: "photo",         api: "SYNO.PhotoStation.Photo"         },
        {key: "permission",    api: "SYNO.PhotoStation.Permission"    },
        {key: "thumb",         api: "SYNO.PhotoStation.Thumb"         },
        {key: "cover",         api: "SYNO.PhotoStation.Cover"         },
        {key: "file",          api: "SYNO.PhotoStation.File"          },
        {key: "download",      api: "SYNO.PhotoStation.Download"      },
        {key: "category",      api: "SYNO.PhotoStation.Category"      },
        {key: "about",         api: "SYNO.PhotoStation.About"         },
        {key: "tag",           api: "SYNO.PhotoStation.Tag"           },
        {key: "tag",           api: "SYNO.PhotoStation.PhotoTag"      },
        {key: "comment",       api: "SYNO.PhotoStation.Comment"       },
        {key: "timeline",      api: "SYNO.PhotoStation.Timeline"      },
        {key: "group",         api: "SYNO.PhotoStation.Group"         },
        {key: "rotate",        api: "SYNO.PhotoStation.Rotate"        },
        {key: "music",         api: "SYNO.PhotoStation.SlideshowMusic"},
        {key: "dsmShare",      api: "SYNO.PhotoStation.DsmShare"      },
        {key: "log",           api: "SYNO.PhotoStation.PhotoLog"      },
        {key: "path",          api: "SYNO.PhotoStation.Path"          },
        {key: "watermark",     api: "SYNO.PhotoStation.Watermark"     },
        {key: "public",        api: "SYNO.PhotoStation.Public"        },
        {key: "migration",     api: "SYNO.PhotoStation.Migration"     },
        {key: "acl",           api: "SYNO.PhotoStation.ACL"           },
        {key: "advanced",      api: "SYNO.PhotoStation.AdvancedShare" },
        {key: "api",           api: "SYNO.API.Info"                   },
        {key: "accur",         api: "ACCUR.PhotoStation.API"          }
      ].forEach((e) => {
        var d = data[e.api];
        services[e.key] = {
          api: e.api,
          url: {
            root: config.rootUrl + d.path
          }
        };

        if(sites && config.siteUrl) {
          let apiUrls = services[e.key].url;
          let prefix = config.siteUrl.prefix,
            postfix = config.siteUrl.postfix;
          sites.forEach((site) => {
            apiUrls[site] = prefix + '~' + site + '/' + postfix + d.path;
          });
        }
      });

      return services;
    }
    return {};
  },

  // return hash like:
  // {
  //   rootUrl: 'http://my-nas.com/photo/webapi/',
  //   siteUrl: {
  //     prefix: 'http://my-nas.com/',
  //     postfix: 'photo/webapi/'
  //   }
  // }
  // if no '{USER}' appear in ENV.APP.synoApiURL, the siteUrl is null
  parseSynoApiURL() {
    var synoUrl = ENV.APP.synoApiURL;
    var result = {};
    var parts = synoUrl.split('{USER}');
    if(parts[1]) {
      result.siteUrl = {
        prefix: parts[0].endsWith('/') ? parts[0] : parts[0] + '/',
        postfix: parts[1].startsWith('/') ? parts[1].substring(1, parts[1].length): parts[1],
      };
      if(!result.siteUrl.postfix.endsWith('/') && result.siteUrl.postfix.length > 0)
        result.siteUrl.postfix += '/';
      result.rootUrl = result.siteUrl.prefix + result.siteUrl.postfix;
      return result;
    } else {
      result.rootUrl = synoUrl;
      if(!result.rootUrl.endsWith('/'))
        result.rootUrl += '/';
      return result;
    }
  },

  // check site that have enable personal photostation
  checkEnabledSite(rootUrl) {
    return this.get('ajax').post(rootUrl + 'accur.php', {
      data: {
        method: 'site',
        api: 'ACCUR.PhotoStation.API',
        version: 1,
      }
    }).then((res) => {
      if(res.success && res.data) {
        return res.data.items;
      } else {
        return false;
      }
    }).catch((err) => {
      Ember.Logger.info('error, no additional site has enabled');
      return false;
    });
  },
});
