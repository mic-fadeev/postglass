import DB from '../db';

export const GET_TABLE_CONTENT = 'GET_TABLE_CONTENT';
export const CONNECT = 'CONNECT';
export const TOGGLE_FILTER = 'TOGGLE_FILTER';
export const APPLY_FILTER = 'APPLY_FILTER';
export const CLEAR_FILTER = 'CLEAR_FILTER';


function returnContent(currentTable, isFetching, totalCount, order, page, titleTable, columnTypes,
                       isFilterApplied, filterCategory, filterAction, filterText) {
  return {
    type: GET_TABLE_CONTENT,
    currentTable,
    isFetching,
    totalCount,
    order,
    page,
    titleTable,
    columnTypes,
    isFilterApplied,
    filterCategory,
    filterAction,
    filterText,
  };
}

export function toggleFilter(toShowFilter) {
  return {
    type: TOGGLE_FILTER,
    toShowFilter
  };
}

export function applyFilter(isFilterApplied, filterCategory, filterAction, filterText) {
  return {
    type: APPLY_FILTER,
    isFilterApplied,
    filterCategory,
    filterAction,
    filterText,
  };
}

export function clearFilter(isFilterApplied) {
  return {
    type: CLEAR_FILTER,
    isFilterApplied
  };
}

export function getTableContent(params = { page: 1, order: [] }) {
  return dispatch => {
    dispatch(returnContent(undefined, true, undefined, undefined, params.page));
    DB.getTableContent(params, (data, totalCount, order, page, titleTable, columnTypes, isFilterApplied, filterCategory, filterAction, filterText) => {
      dispatch(returnContent(fixTempIssue(data), false, totalCount, order, page, titleTable, columnTypes, isFilterApplied, filterCategory, filterAction, filterText));
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
