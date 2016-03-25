import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SpinnerComponent from '../../base/spinner/component';
import PaginationComponent from './paginate/component';
import HeadersComponent from './headers/component';

import * as CurrentTableActions from '../../../actions/currentTable';
import * as TablesActions from '../../../actions/tables';


const propTypes = {
  tables: React.PropTypes.array.isRequired,
  items: React.PropTypes.array.isRequired,
  setCurrentTable: React.PropTypes.func.isRequired,
  getTableContent: React.PropTypes.func.isRequired,
  isFetching: React.PropTypes.bool.isRequired,
  titleTable: React.PropTypes.array.isRequired,
};


class MainComponent extends Component {
  componentWillReceiveProps(nextProps) {
    if (!this.props.tables.length && nextProps.tables.length) {
      let currentTable = window.localStorage.currentTable;
      if (currentTable) {
        let isFind = false;
        for (const table of nextProps.tables) {
          if (table.table_name === currentTable) {
            isFind = true;
            break;
          }
        }
        if (!isFind) {
          currentTable = nextProps.tables[0].table_name;
        }
      } else {
        currentTable = nextProps.tables[0].table_name;
      }
      this.props.setCurrentTable(currentTable);
      this.props.getTableContent({ tableName: currentTable });
    }
  }

  render() {
    const { titleTable, items, isFetching } = this.props;
    return (
      <div className="gray-bg dashbard-1 mainContent" id="page-wrapper">
        <div id="table-wrapper">
          <table className ="table table-bordered ">
            <thead>
              <HeadersComponent titleTable = {titleTable} />
            </thead>
            <tbody>
              {
                items.map((item, key) => {
                  const fields = [];
                  let keyA = 0;
                  for (const header of titleTable) {
                    keyA += 1;
                    fields.push(
                      <td key={keyA}>{item[header]}</td>
                    );
                  }
                  return (
                  <tr key={key}>
                    {fields}
                  </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
        <PaginationComponent />
        <SpinnerComponent isShow={isFetching} />
      </div>
    );
  }
}

MainComponent.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    titleTable: state.currentTable.titleTable,
    items: state.currentTable.items,
    isFetching: state.currentTable.isFetching,
    tables: state.tables
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...TablesActions, ...CurrentTableActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainComponent);
