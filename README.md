# synology-dsm-gallery

Gallery is immplemented for photo gallery for synology dsm by using webapi of PhotoStation

## Installation

### gallery installation

* `git clone <repository-url>` this repository
* `cd gallery`
* `npm install`

### PhotoStation setup

* copy `synology/photostation/webapi/accur.php` to photostation install directory.
  you may need to enable ssh from 'control panel' of DSM.
  login ssh and upload accur.php to webapi dir, like `/volume1/@appstore/PhotoStation/photo/webapi`
* add config to nginx so that gallery can make ajax call to the photostation webapi.
  edit `/etc/nginx/conf.d/www.PhotoStation.conf`, and add the following content to the `php` section, like:
```
  location ~* \.php(/|$) {
    # for CORS request
    add_header 'Access-Control-Allow-Origin' 'http://your-gallery.com:8080';
    add_header 'Access-Control-Allow-Credentials' "true";
    add_header 'Access-Control-Allow-Methods' "GET, POST, OPTIONS";
    add_header 'Access-Control-Allow-Headers' "X-Requested-With,X-Syno-Token";
    ...
  }
```
* restart DSM

## Running / Development

* `SYNO_PHOTOSTATION_WEBAPI_URL='http://your-nas.com/photo/webapi' ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `SYNO_PHOTOSTATION_WEBAPI_URL='http://your-nas.com/photo/webapi' ember build` (development)
* `SYNO_PHOTOSTATION_WEBAPI_URL='http://your-nas.com/photo/webapi' ember build --environment production` (production)

### Deploying

production build result only contains `dist` output, so you can copy the output files to a server, and config all routes pointed to the `index.html` file.
for express server:
```
express gallery-express-server
cd gallery-express-server
cp -r /some/path/to/gallery/dist/* ./public
```
edit `app.js`, add a route to the `index.html`
```
app.use('*', (req, res) => {
  res.sendFile('/some/path/to/gallery-express-server/public/index.html');
});
```
then, start the server
`node /some/path/to/gallery-express-server/bin/www`

