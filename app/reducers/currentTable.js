import { TOGGLE_FILTER, GET_TABLE_CONTENT, CONNECT } from '../actions/currentTable';


export default function currentTable(currentTableDefault = {
  titleTable: [],
  items: [],
  isConnected: false,
  isFetching: true,
  totalCount: 0,
  order: [],
  page: 1,
  toShowFilter: false,
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
      };
    case TOGGLE_FILTER:
      return {
        ...currentTableDefault,
        toShowFilter: !action.toShowFilter,
      };
    case CONNECT:
      return Object.assign({}, currentTableDefault, { isConnected: action.connect });
    default:
      return currentTableDefault;
  }
}
