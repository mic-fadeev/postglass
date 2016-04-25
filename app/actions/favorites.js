const storage = require('electron-json-storage');
const jwt = require('jwt-simple');

export const GET_FAVORITES = 'GET_FAVORITES';
export const SET_FAVORITES = 'SET_FAVORITES';
export const SET_CURRENT_FAVORIT = 'SET_CURRENT_FAVORIT';
const keys = '123';

export function setFavorit(favorites, currentId = false) {
  return dispatch =>
    storage.set('postglass_favorites', favorites, (error) => {
      if (error) throw error;
      return dispatch((() => {
        if (currentId) {
          return setCurrent(favorites, currentId);
        }

        return {
          type: SET_FAVORITES,
          favorites
        };
      })());
    });
}

export function setCurrent(favorites, currentId) {
  return dispatch => {
    for (const favorit of favorites) {
      if (favorit.id === currentId) {
        favorit.isCurrent = true;
        const password = favorites.map(key => jwt.encode(key.password, keys));
        var currentFavorites = favorites;
        for (var i = 0; i < favorites.length; i++) {
          currentFavorites[i].password = password[i];
          if (favorites[i].useSSH) {
            currentFavorites[i].sshPassword = jwt.encode(favorites[i].sshPassword, keys);
          }
        }
      } else {
        favorit.isCurrent = false;
      }
    }
    return storage.set('postglass_favorites', this.currentFavorites, (error) => {
      if (error) throw error;
      /*eslint-disable */
      return dispatch((() => {
        return {
          type: SET_CURRENT_FAVORIT,
          favorites
        };
      })());
      /*eslint-enable */
    });
  };
}

export function getFavorites() {
  return dispatch =>
    storage.get('postglass_favorites', (error, data) => {
      if (error) throw error;
      /*eslint-disable */
      return dispatch((() => {
        
        return {
          type: GET_FAVORITES,
          favorites: Object.keys(data).length ? data : []
        };
      })());
      /*eslint-enable */
    });
}
