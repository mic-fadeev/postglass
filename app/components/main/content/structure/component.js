import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as CurrentTableActions from '../../../../actions/currentTable';
import * as TablesActions from '../../../../actions/tables';
import SpinnerComponent from '../../../base/spinner/component';
import HeadersComponent from '../headers/component';


const propTypes = {
  tables: React.PropTypes.array.isRequired,
  setCurrentTable: React.PropTypes.func.isRequired,
  getTableContent: React.PropTypes.func.isRequired,
  isFetching: React.PropTypes.bool.isRequired,
  structureTable: React.PropTypes.array.isRequired,
};


class StructureComponent extends Component {
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
    const { structureTable, isFetching } = this.props;
    const titleStructure = ['columnname', 'datatype'];

    return (
      <div>
        { !isFetching &&
          <div>
            <table className ="table table-bordered">
              <thead>
                <HeadersComponent titleTable = {titleStructure} />
              </thead>
              <tbody>
                {
                  structureTable.map((item, key) => {
                    const fields = [];
                    let keyA = 0;
                    for (const header of titleStructure) {
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
        }
        <SpinnerComponent isShow={isFetching} />
      </div>
    );
  }
}

StructureComponent.propTypes = propTypes;
function mapStateToProps(state) {
  return {
    isFetching: state.currentTable.isFetching,
    tables: state.tables,
    structureTable: state.currentTable.structureTable
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...TablesActions, ...CurrentTableActions }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(StructureComponent);
