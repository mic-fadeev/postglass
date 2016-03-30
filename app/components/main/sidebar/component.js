import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import * as TablesActions from '../../../actions/tables';
import * as CurrentTableActions from '../../../actions/currentTable';
import SidebarItemComponent from './item/component';


const propTypes = {
  tables: PropTypes.array.isRequired,
  getTables: PropTypes.func.isRequired,
  setCurrentTable: PropTypes.func.isRequired,
  getTableContent: PropTypes.func.isRequired
};


class SidebarComponent extends Component {
  componentWillMount() {
    this.props.getTables();
  }

  render() {
    const { tables } = this.props;
    return (
      <nav className="navbar-default navbar-static-side scrollable">
        <div className="sidebar-collapse">
          <ul className="nav metismenu">
            {
              tables.map((item, key) =>
                (
                 <SidebarItemComponent item={item} key={key}
                   setCurrentTable={this.props.setCurrentTable}
                   getTableContent={this.props.getTableContent}
                   className={item.isCurrent && 'active'}
                 />
                )
              )
            }
          </ul>
        </div>
      </nav>
    );
  }
}

SidebarComponent.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    tables: state.tables
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...TablesActions, ...CurrentTableActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarComponent);
