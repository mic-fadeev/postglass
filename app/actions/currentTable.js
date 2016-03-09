const ipcRenderer = require('electron').ipcRenderer;

export const GET_TABLE_CONTENT = 'GET_TABLE_CONTENT';
export const CONNECT = 'CONNECT';


function returnContent(currentTable, isFetching, totalCount, order, page) {
  return {
    type: GET_TABLE_CONTENT,
    currentTable,
    isFetching,
    totalCount,
    order,
    page
  };
}

export function getTableContent(params = { page: 1, order: [] }) {
  ipcRenderer.send('get-table-content', params);
  return dispatch => {
    dispatch(returnContent([], true, 0));
    ipcRenderer.once('get-table-content', (event, data, totalCount, order, page) => {
      dispatch(returnContent(fixTempIssue(data), false, totalCount, order, page));
    });
  };
}

export function connectDB(params) {
  return {
    type: CONNECT,
    connect: ipcRenderer.sendSync('connect-db', params)
  };
}

// https://github.com/atom/electron/issues/4490
function fixTempIssue(data) {
  for (const field of data) {
    for (const [fieldName, fieldValue] of Object.entries(field)) {
      if (fieldValue.hasOwnProperty('IssueType')) {
        field[fieldName] = fieldValue.value;
      }
    }
  }
  return data;
}
