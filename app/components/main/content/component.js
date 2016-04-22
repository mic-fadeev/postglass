import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import StructureComponent from './structure/component';
import PaginationComponent from './paginate/component';
import ContentComponent from './content/component';

import * as CurrentTableActions from '../../../actions/currentTable';
import * as TablesActions from '../../../actions/tables';


const propTypes = {
  isContent: React.PropTypes.bool.isRequired
};


class MainComponent extends Component {
  handleTableScroll() {
    const tableHeaderList = document.querySelectorAll('.table-header');
    const scrollSize = document.getElementById('table-wrapper').scrollLeft;
    Object.keys(tableHeaderList).map((tableHeaderItem) => {
      tableHeaderList[tableHeaderItem].style.marginLeft = -scrollSize - 9 + 'px';
    });
  }

  render() {
    return (
      <div className="gray-bg dashbard-1 mainContent" id="page-wrapper">
        <div id="table-wrapper" onScroll={this.handleTableScroll}>
          {this.props.isContent ?
            <ContentComponent /> :
            <StructureComponent />
          }
          <PaginationComponent />
        </div>
      </div>
    );
  }
}


MainComponent.propTypes = propTypes;
function mapStateToProps(state) {
  return {
    isContent: state.currentTable.isContent
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...TablesActions, ...CurrentTableActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainComponent);
