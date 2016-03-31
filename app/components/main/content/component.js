import React from 'react';

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


const MainComponent = (props) =>
   <div className="gray-bg dashbard-1 mainContent" id="page-wrapper">
    <div className="table-wrapper">
    {props.isContent ?
      <ContentComponent /> :
      <StructureComponent />
    }
    <PaginationComponent />
    </div>
  </div>;

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
