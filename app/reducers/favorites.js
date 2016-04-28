import { GET_FAVORITES, SET_CURRENT_FAVORIT, SET_FAVORITES } from '../actions/favorites';
const storage = require('electron-json-storage');
const jwt = require('jwt-simple');
// It's a really bad idea to store it here, but currently i don't know a good
// solution
const keys = 'jkhas821JHs7612361askahgsdg361kas7';


export default function favorites(favoritesDefault = [], action) {
  switch (action.type) {
    case SET_CURRENT_FAVORIT: {
      const favoritesList = favoritesDefault.slice();
      for (const favorit of favoritesList) {
        favorit.isCurrent = false;
        if (favorit.id === action.currentId) {
          favorit.isCurrent = true;
        }
      }
      saveFavorites(favoritesList);
      return favoritesList;
    }
    case GET_FAVORITES: {
      const storageFavorites = action.favorites.slice();
      for (const favorit of storageFavorites) {
        if (favorit.password) {
          favorit.password = jwt.decode(favorit.password, keys);
        }
        if (favorit.sshPassword) {
          favorit.sshPassword = jwt.decode(favorit.sshPassword, keys);
        }
      }
      return storageFavorites;
    }
    case SET_FAVORITES: {
      saveFavorites(action.favorites);
      return action.favorites.slice();
    }
    default:
      return favoritesDefault;
  }
}

function saveFavorites(data) {
  const favors = JSON.parse(JSON.stringify(data));
  for (const favorit of favors) {
    if (favorit.password) {
      favorit.password = jwt.encode(favorit.password, keys);
    }
    if (favorit.sshPassword) {
      favorit.sshPassword = jwt.encode(favorit.sshPassword, keys);
    }
  }
  storage.set('postglass_favorites', favors, (error) => {
    if (error) throw error;
  });
}
