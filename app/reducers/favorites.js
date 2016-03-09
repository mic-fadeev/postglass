import { GET_FAVORITES, SET_CURRENT_FAVORIT, SET_FAVORITES } from '../actions/favorites';


export default function favorites(favoritesDefault = [], action) {
  switch (action.type) {
    case GET_FAVORITES:
      return action.favorites;
    case SET_FAVORITES:
      return action.favorites.slice();
    case SET_CURRENT_FAVORIT:
      return action.favorites.slice();
    default:
      return favoritesDefault;
  }
}
