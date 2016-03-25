import DB from '../db';

export const GET_TABLE_CONTENT = 'GET_TABLE_CONTENT';
export const CONNECT = 'CONNECT';


function returnContent(currentTable, isFetching, totalCount, order, page, titleTable) {
  return {
    type: GET_TABLE_CONTENT,
    currentTable,
    isFetching,
    totalCount,
    order,
    page,
    titleTable
  };
}

export function getTableContent(params = { page: 1, order: [] }) {
  return dispatch => {
    dispatch(returnContent([], true, undefined, undefined, params.page));
    DB.getTableContent(params, (data, totalCount, order, page, titleTable) => {
      dispatch(returnContent(fixTempIssue(data), false, totalCount, order, page, titleTable));
    });
  };
}

export function connectDB(params) {
  return dispatch => {
    DB.connect(params, (connect, err) => {
      /*eslint-disable */
      dispatch((() => {
        return {
          type: CONNECT,
          connect,
          err
        };
      })());
      /*eslint-enable */
    });
  };
}

// https://github.com/atom/electron/issues/4490
function fixTempIssue(data) {
  for (const field of data) {
    for (const [fieldName, fieldValue] of Object.entries(field)) {
      if (fieldValue && fieldValue.hasOwnProperty('IssueType')) {
        field[fieldName] = fieldValue.value;
      }
    }
  }
  return data;
}
