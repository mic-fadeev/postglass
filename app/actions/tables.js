import DB from '../db';

export const GET_TABLES = 'GET_TABLES';
export const SET_CURRENT_TABLE = 'SET_CURRENT_TABLE';


export function setCurrentTable(tableName) {
  return {
    type: SET_CURRENT_TABLE,
    tableName
  };
}

export function getTables() {
  return dispatch => {
    DB.getTables((tables, err) => {
      dispatch({ type: GET_TABLES, tables, err });
    });
  };
}
