import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SpinnerComponent from '../../base/spinner/component';
import PaginationComponent from './paginate/component';
import HeadersComponent from './headers/component';
import FilterComponent from './headers/filterComponent';

import * as CurrentTableActions from '../../../actions/currentTable';
import * as TablesActions from '../../../actions/tables';


const propTypes = {
  tables: React.PropTypes.array.isRequired,
  items: React.PropTypes.array.isRequired,
  setCurrentTable: React.PropTypes.func.isRequired,
  getTableContent: React.PropTypes.func.isRequired,
  isFetching: React.PropTypes.bool.isRequired,
  titleTable: React.PropTypes.array.isRequired,
  toShowFilter: React.PropTypes.bool.isRequired,
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

  handleTableScroll() {
    const tableHeaderList = document.querySelectorAll('.table-header');
    const scrollSize = document.getElementById('table-wrapper').scrollLeft;
    Object.keys(tableHeaderList).map((tableHeaderItem) => {
      tableHeaderList[tableHeaderItem].style.marginLeft = -scrollSize - 9 + 'px';
    });
  }

  render() {
    const { titleTable, items, isFetching } = this.props;
    return (
      <div className="gray-bg dashbard-1 mainContent" id="page-wrapper">
        {this.props.toShowFilter ? <FilterComponent /> : null}
        <div id="table-wrapper" onScroll={this.handleTableScroll}>
          <table className ="table table-bordered" id="table">
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
    tables: state.tables,
    toShowFilter: state.currentTable.toShowFilter,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...TablesActions, ...CurrentTableActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainComponent);
