let request = require('superagent');
let _ = require('lodash');
let Q = require('q');
import AppActionServerCreators from '../actions/AppActionServerCreators';
import SettingsStore from '../stores/SettingsStore';



function _getConfig() {

  let deferred = Q.defer();

  request.get('config.json?dt='+Date.now())
    .end((err, config) => {
      if (err) {
        deferred.reject(err);
        return;
      }
      deferred.resolve(config.body);
    });

  return deferred.promise;
}

function _loadActiveTheme(name, meta) {
  let deferred = Q.defer();
  let promises = [];
  let hubpressUrl = SettingsStore.getHubpressUrl(meta);
  request.get(`${hubpressUrl}/themes/${name}/theme.json?dt=${Date.now()}`)
    .end((err, response) => {
      if (err) {
        deferred.reject(err);
        return;
      }
      let theme = response.body;
      let version = theme.version;
      let files = _.pairs(theme.files);

      let paginationLoaded = false;
      let navigationLoaded = false;

      files.forEach((file) => {
        let deferredFile = Q.defer();
        promises.push(deferredFile.promise);

        paginationLoaded = paginationLoaded || file[0] === 'pagination';
        navigationLoaded = navigationLoaded || file[0] === 'nav';

        request.get(`${hubpressUrl}/themes/${name}/${file[1]}?v=${version}`)
          .end((err, response) => {
            if (err) {
              deferredFile.reject(err)
              return;
            }
            deferredFile.resolve({
              name: file[0],
              path: file[1],
              content: response.text
            });

          });

      });

      if (!paginationLoaded) {
        let deferredPagination = Q.defer();
        promises.push(deferredPagination.promise);
        request.get(`${hubpressUrl}/hubpress/scripts/helpers/tpl/pagination.hbs`)
          .end((err, response) => {
            if (err) {
              deferredPagination.reject(err)
              return;
            }

            deferredPagination.resolve({
              name: 'pagination',
              path: 'partials/pagination',
              content: response.text
            });
          });
      }

      if (!navigationLoaded) {
        let deferredNav = Q.defer();
        promises.push(deferredNav.promise);
        request.get(`${hubpressUrl}/hubpress/scripts/helpers/tpl/nav.hbs`)
          .end((err, response) => {
            if (err) {
              deferredNav.reject(err)
              return;
            }
            deferredNav.resolve({
              name: 'nav',
              path: 'partials/nav',
              content: response.text
            });
          });
      }

      Q.all(promises)
        .then((values)=>{
          deferred.resolve({
            version: version,
            files: values
          });
        })
        .catch((error) => {
          console.log(error);
          deferred.reject(error);
        });
    });

  return deferred.promise;
}


class HpWebApiUtils {


  getConfig() {
    let deferred = Q.defer();
    let _config;
    let theme;

    _getConfig()
    .then((config) => {
      _config = config;
      return _loadActiveTheme(config.theme.name, config.meta);
    })
    .then((themeInfos) => {
      let data = {
        config: _config,
        theme: {
          name: _config.theme.name,
          files: themeInfos.files,
          version: themeInfos.version
        }
      };
      deferred.resolve();
      AppActionServerCreators.receiveInit(data);

    });

    return deferred.promise;

  }

  loadActiveTheme(name, meta) {
    return _loadActiveTheme(name, meta);
  }
}

export default new HpWebApiUtils();
