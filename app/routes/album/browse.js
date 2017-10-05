import Ember from 'ember';
import AjaxRequest from 'ember-ajax/ajax-request';

export default Ember.Route.extend({
  synoAjax: Ember.inject.service('synology-ajax'),

  model() {
    const RequestWithHeaders = AjaxRequest.extend({
      headers: { 'X-Syno-Token': 'Other Value' }
    });

    const service = new RequestWithHeaders();
    service.request('http://app.accur.cc/photo/webapi/path.php', {
			method:'POST',
			beforeSend:(xhr)=>{
				//xhr.setRequestHeader('X-Syno-Token', 'yyyyyyyyyyyyyyy');
			}
		});

    let syno = this.get('synoAjax');
    syno.request('http://app.accur.cc/photo/webapi/path.php', {
      method: 'POST',
      data: {
        api:'SYNO.PhotoStation.Path',
        method: 'checkpath',
        version: 1,
        token: 'Albums/album_746f65/album_746f652f7075626c6963/album_746f652f7075626c69632f7031/album_746f652f7075626c69632f70312f703131',
        additional: 'album_permission',
        ps_username: '',
        ignore: 'thumbnail',
      }
    }).then((res)=>{
      Ember.Logger.info('synoAjax return ' + JSON.stringify(res));
    });
  }
});
