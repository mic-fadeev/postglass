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
  isFetching: React.PropTypes.bool.isRequired
};


class MainComponent extends Component {
  componentWillMount() {
    let currentTable = window.localStorage.currentTable;
    if (currentTable) {
      let isFind = false;
      for (const table of this.props.tables) {
        if (table.table_name === currentTable) {
          isFind = true;
          break;
        }
      }
      if (!isFind) {
        currentTable = this.props.tables[0].table_name;
      }
    } else {
      currentTable = this.props.tables[0].table_name;
    }
    this.props.setCurrentTable(currentTable);
    this.props.getTableContent({ tableName: currentTable });
  }

  render() {
    const { items, isFetching } = this.props;
    return (
      <div className="gray-bg dashbard-1" id="page-wrapper">
          {!isFetching &&
            <div>
            <table className="table table-bordered">
              <thead>
                <HeadersComponent item={ items[0] } />
              </thead>
              <tbody>
                {
                  items.map((item, key) => {
                    const fields = [];
                    let keyA = 0;
                    for (const [, fieldValue] of Object.entries(item)) {
                      keyA += 1;
                      fields.push(
                        <td key={keyA}>{fieldValue}</td>
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
              <PaginationComponent />
            </div>
          }
          <SpinnerComponent isShow={isFetching} />
      </div>
    );
  }
}

MainComponent.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    items: state.currentTable.items,
    isFetching: state.currentTable.isFetching,
    tables: state.tables
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...TablesActions, ...CurrentTableActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainComponent);
