const storage = require('electron-json-storage');

export const GET_FAVORITES = 'GET_FAVORITES';
export const SET_FAVORITES = 'SET_FAVORITES';
export const SET_CURRENT_FAVORIT = 'SET_CURRENT_FAVORIT';


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
      } else {
        favorit.isCurrent = false;
      }
    }
    return storage.set('postglass_favorites', favorites, (error) => {
      if (error) throw error;
      return dispatch({ type: SET_CURRENT_FAVORIT, favorites });
    });
  };
}

export function getFavorites() {
  return dispatch =>
    storage.get('postglass_favorites', (error, data) => {
      if (error) throw error;
      return dispatch({ type: GET_FAVORITES, favorites: Object.keys(data).length ? data : [] });
    });
}
