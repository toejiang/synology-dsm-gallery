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

  api: {
    urls:{},
    initialApiQueryHandling: false, // true when a is handling
    initializeDone: false, // true when all init is done, including api query
  },

  trigger: Trigger.create(),

  url(name) {
    let _self = this;
    var api = _self.get('api');
    if(!api || !api.initializeDone || !api.urls || !api.urls.api) {

      // if handling, just wait for compilite
      if(api.initialApiQueryHandling)  {
        return new RSVP.Promise((resolve) => {
          // only trigger once
          _self.get('trigger').one('fire',() => {
            resolve(api.urls[name]);
          });
        });
      }

      api.initialApiQueryHandling = true;
      let url = ENV.APP.synoApiURL;
      if (url.slice(-1) !== '/') {
        url += '/';
      }
      return _self.get('ajax').post(url + 'query.php', {
        data:{
          query:'all',
          api:'SYNO.API.Info',
          method:'query',
          version:1,
          ps_username:''
       }
      }).then((apiinfo)=>{
        // like:
        // {"success":true,"data":{
        //  "SYNO.PhotoStation.Auth":{"path":"auth.php","minVersion":1,"maxVersion":1},
        //  "SYNO.PhotoStation.Info":{"path":"info.php","minVersion":1,"maxVersion":2},
        //  "SYNO.PhotoStation.Album":{"path":"album.php","minVersion":1,"maxVersion":1}
        //  }
        // }
        if(apiinfo.success) {
          let serviceUrl = {};
          [
            {key: "auth",          api: "SYNO.PhotoStation.Auth"          },
            {key: "info",          api: "SYNO.PhotoStation.Info"          },
            {key: "album",         api: "SYNO.PhotoStation.Album"         },
            {key: "permission",    api: "SYNO.PhotoStation.Permission"    },
            {key: "photo",         api: "SYNO.PhotoStation.Photo"         },
            {key: "thumb",         api: "SYNO.PhotoStation.Thumb"         },
            {key: "cover",         api: "SYNO.PhotoStation.Cover"         },
            {key: "smartAlbum",    api: "SYNO.PhotoStation.SmartAlbum"    },
            {key: "file",          api: "SYNO.PhotoStation.File"          },
            {key: "download",      api: "SYNO.PhotoStation.Download"      },
            {key: "category",      api: "SYNO.PhotoStation.Category"      },
            {key: "about",         api: "SYNO.PhotoStation.About"         },
            {key: "tag",           api: "SYNO.PhotoStation.Tag"           },
            {key: "photoTag",      api: "SYNO.PhotoStation.PhotoTag"      },
            {key: "comment",       api: "SYNO.PhotoStation.Comment"       },
            {key: "timeline",      api: "SYNO.PhotoStation.Timeline"      },
            {key: "group",         api: "SYNO.PhotoStation.Group"         },
            {key: "rotate",        api: "SYNO.PhotoStation.Rotate"        },
            {key: "slideshowMusic",api: "SYNO.PhotoStation.SlideshowMusic"},
            {key: "dsmShare",      api: "SYNO.PhotoStation.DsmShare"      },
            {key: "sharedAlbum",   api: "SYNO.PhotoStation.SharedAlbum"   },
            {key: "log",           api: "SYNO.PhotoStation.PhotoLog"      },
            {key: "path",          api: "SYNO.PhotoStation.Path"          },
            {key: "watermark",     api: "SYNO.PhotoStation.Watermark"     },
            {key: "public",        api: "SYNO.PhotoStation.Public"        },
            {key: "migration",     api: "SYNO.PhotoStation.Migration"     },
            {key: "acl",           api: "SYNO.PhotoStation.ACL"           },
            {key: "advancedShare", api: "SYNO.PhotoStation.AdvancedShare" },
            {key: "api",           api: "SYNO.API.Info"                   }
          ].forEach((e) => {
            var d = apiinfo.data[e.api];
            serviceUrl[e.key] = {
              api: e.api,
              url: url + d.path
            };
          });
          api.urls = serviceUrl;
        }
        return api;
      }).then((api) => {
        // to do a init alum request, so that photostation can set session cache
        var album = api.urls['album'];
        var promise = _self.get('ajax').post(album.url, {
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
        }).then((res) => {
          api.initializeDone = true;
          api.initialApiQueryHandling = false;
          _self.get('trigger').fire();
          return api.urls[name];
        }).catch((err) => {
          api.initialApiQueryHandling = false;
          api.initializeDone = false;
          Ember.Logger.error(err);
        });
        return promise;
      });
    }
    return RSVP.Promise.resolve(api.urls[name]);
  }
});
