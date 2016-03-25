import { GET_TABLE_CONTENT, CONNECT } from '../actions/currentTable';


export default function currentTable(currentTableDefault = {
  titleTable: [],
  items: [],
  isConnected: false,
  isFetching: true,
  totalCount: 0,
  order: [],
  page: 1
}, action) {
  switch (action.type) {
    case GET_TABLE_CONTENT:
      return {
        items: action.currentTable,
        isFetching: action.isFetching,
        isConnected: true,
        totalCount: action.totalCount !== undefined ? action.totalCount : currentTableDefault.totalCount, // eslint-disable-line
        order: action.order,
        page: action.page !== undefined ? action.page : currentTableDefault.page,
        titleTable: action.titleTable || currentTableDefault.titleTable
      };
    case CONNECT:
      return Object.assign({}, currentTableDefault, { isConnected: action.connect });
    default:
      return currentTableDefault;
  }
}
