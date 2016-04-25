import DB from '../db';

export const GET_TABLE_CONTENT = 'GET_TABLE_CONTENT';
export const CONNECT = 'CONNECT';
export const CHANGE_VIEW_MODE = 'CHANGE_VIEW_MODE';


function returnContent(currentTable, isFetching, totalCount, order, page,
  titleTable, structureTable, isContent) {
  return {
    type: GET_TABLE_CONTENT,
    currentTable,
    isFetching,
    totalCount,
    order,
    page,
    titleTable,
    structureTable,
    isContent
  };
}

export function getTableContent(params = { page: 1, order: [] }) {
  return dispatch => {
    dispatch(returnContent(undefined, true, undefined, undefined, params.page));
    DB.getTableContent(params, (data, totalCount, order, page, titleTable, structureTable) => {
      dispatch(returnContent(
          fixTempIssue(data), false, totalCount, order, page, titleTable, structureTable)
        );
    });
  };
}

export function changeMode(isContent) {
  return {
    type: CHANGE_VIEW_MODE,
    isContent
  };
}

export function connectDB(params) {
  return (dispatch) => {
    DB.connect(params, (connect, err) => {
      dispatch({ type: CONNECT, connect, err });
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
