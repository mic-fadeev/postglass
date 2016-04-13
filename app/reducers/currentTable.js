import { TOGGLE_FILTER, APPLY_FILTER,
  CLEAR_FILTER, GET_TABLE_CONTENT, CONNECT } from '../actions/currentTable';


export default function currentTable(currentTableDefault = {
  titleTable: [],
  items: [],
  isConnected: false,
  isFetching: true,
  totalCount: 0,
  order: [],
  page: 1,
  toShowFilter: false,
  columnTypes: [],
  isFilterApplied: false,
  filterCategory: undefined,
  filterAction: undefined,
  filterText: undefined,
}, action) {
  switch (action.type) {
    case GET_TABLE_CONTENT:
      return {
        items: action.currentTable !== undefined ? action.currentTable : currentTableDefault.items,
        isFetching: action.isFetching,
        isConnected: true,
        totalCount: action.totalCount !== undefined ? action.totalCount : currentTableDefault.totalCount, // eslint-disable-line
        order: action.order,
        page: action.page !== undefined ? action.page : currentTableDefault.page,
        titleTable: action.titleTable || currentTableDefault.titleTable,
        toShowFilter: currentTableDefault.toShowFilter,
        columnTypes: action.columnTypes,
        isFilterApplied: currentTableDefault.isFilterApplied,
        filterCategory: currentTableDefault.filterCategory,
        filterAction: currentTableDefault.filterAction,
        filterText: currentTableDefault.filterText,
      };
    case TOGGLE_FILTER:
      return {
        ...currentTableDefault,
        toShowFilter: !currentTableDefault.toShowFilter,
      };
    case APPLY_FILTER:
      return {
        ...currentTableDefault,
        isFilterApplied: true,
        filterCategory: action.filterCategory,
        filterAction: action.filterAction,
        filterText: action.filterText,
      };
    case CLEAR_FILTER:
      return {
        ...currentTableDefault,
        isFilterApplied: false,
      };
    case CONNECT:
      return Object.assign({}, currentTableDefault, { isConnected: action.connect });
    default:
      return currentTableDefault;
  }
}
