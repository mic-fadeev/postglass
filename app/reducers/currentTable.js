import { GET_TABLE_CONTENT, CONNECT, CHANGE_VIEW_MODE } from '../actions/currentTable';


export default function currentTable(currentTableDefault = {
  items: [],
  isConnected: false,
  isFetching: true,
  totalCount: 0,
  order: [],
  page: 1,
  isContent: true,
  structureTable: [],
  titleTable: []
}, action) {
  switch (action.type) {
    case GET_TABLE_CONTENT:
      return {
        items: action.currentTable !== undefined ? action.currentTable : currentTableDefault.items,
        isFetching: action.isFetching,
        isConnected: true,
        totalCount: action.totalCount !== undefined ? action.totalCount : currentTableDefault.totalCount, // eslint-disable-line
        order: action.ordder !== undefined ? action.order : currentTableDefault.order,
        page: action.page !== undefined ? action.page : currentTableDefault.page,
        titleTable: action.titleTable || currentTableDefault.titleTable,
        structureTable: action.structureTable || currentTableDefault.structureTable,
        isContent: currentTableDefault.isContent,
      };
    case CONNECT:
      return Object.assign({}, currentTableDefault, { isConnected: action.connect });
    case CHANGE_VIEW_MODE:
      return Object.assign({}, currentTableDefault, { isContent: action.isContent });
    default:
      return currentTableDefault;
  }
}
