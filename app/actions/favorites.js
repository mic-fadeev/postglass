const storage = require('electron-json-storage');

export const GET_FAVORITES = 'GET_FAVORITES';
export const SET_FAVORITES = 'SET_FAVORITES';
export const SET_CURRENT_FAVORIT = 'SET_CURRENT_FAVORIT';


export function setFavorit(favorites, currentId = false) {
  return dispatch => {
    if (currentId) {
      dispatch(setCurrent(currentId));
    }
    dispatch({ type: SET_FAVORITES, favorites, currentId });
  };
}

export function setCurrent(currentId) {
  return { type: SET_CURRENT_FAVORIT, currentId };
}

export function getFavorites() {
  return dispatch => {
    storage.get('postglass_favorites', (error, favorites) => {
      if (error) throw error;
      dispatch(
        { type: GET_FAVORITES,
          favorites: Object.keys(favorites).length ? favorites : []
        }
      );
    });
  };
}

