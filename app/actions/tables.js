const ipcRenderer = require('electron').ipcRenderer;

export const GET_TABLES = 'GET_TABLES';
export const SET_CURRENT_TABLE = 'SET_CURRENT_TABLE';


export function setCurrentTable(tableName) {
  return {
    type: SET_CURRENT_TABLE,
    tableName
  };
}

export function getTables() {
  return {
    type: GET_TABLES,
    tables: ipcRenderer.sendSync('get-tables')
  };
}
