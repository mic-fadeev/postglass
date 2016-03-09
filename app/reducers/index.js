import { combineReducers } from 'redux';
import tables from './tables';
import currentTable from './currentTable';
import favorites from './favorites';

const rootReducer = combineReducers({
  tables,
  currentTable,
  favorites
});

export default rootReducer;
