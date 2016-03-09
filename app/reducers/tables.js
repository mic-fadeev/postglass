import { GET_TABLES, SET_CURRENT_TABLE } from '../actions/tables';


export default function tables(tablesDefault = [], action) {
  switch (action.type) {
    case GET_TABLES:
      return action.tables;
    case SET_CURRENT_TABLE:
      tablesDefault.map((item) => {
        /* eslint no-param-reassign: [2, { "props": false }] */
        if (item.table_name === action.tableName) {
          window.localStorage.setItem('currentTable', action.tableName);
          item.isCurrent = true;
        } else {
          item.isCurrent = false;
        }
        return null;
      });
      return tablesDefault.slice();
    default:
      return tablesDefault;
  }
}
