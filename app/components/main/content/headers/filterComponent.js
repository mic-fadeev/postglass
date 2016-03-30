import React, { Component } from 'react';

import { DropdownButton, MenuItem, Input, Button } from 'react-bootstrap';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as CurrentTableActions from '../../../../actions/currentTable';

//temp solution
const stringActions = ['contains', 'does not contain', 'is exactly', 'is not exactly', 'begins with', 'ends with', 'like'];
const numericActions = ['=', '≠', '<', '>', '≤', '≥'];
const nullActions = ['is NULL', 'is not NULL'];
const booleanActions = ['true', 'false'];

const propTypes = {
  titleTable: React.PropTypes.array.isRequired,
  columnTypes: React.PropTypes.array.isRequired,
  isFilterApplied: React.PropTypes.bool.isRequired,
  applyFilter: React.PropTypes.func.isRequired,
  clearFilter: React.PropTypes.func.isRequired,
}

class FilterComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: this.props.titleTable[0],
      categoryId: 0,
      action: 'action',
      input: ''
    }
  }

  changeCategory = (event, eventKey) => {
    this.setState({
      category: this.props.titleTable[eventKey],
      categoryId: eventKey,
    })
  }

  changeAction = (event, eventKey) => {
    this.setState({
      action: eventKey,
    })
  }

  handleChange = (event) => {
    this.setState({
      input: event.target.value,
    })
  }

  applyFilter = () => {
    this.props.applyFilter(true, this.state.category, this.state.action, this.state.input);
  }

  clearFilter = () => {
    this.setState({
      input: '',
    });
    this.props.clearFilter(false);
  }

  render() {
/*    var actionsList = [];
    switch(this.props.columnTypes[this.state.categoryId]) {
      case 'text':
      case 'string':
      case 'character varying':
        actionsList.concat(stringActions.slice(), 'divider');
        break;
      case 'integer':
      case 'real':
      case 'bigint':
        actionsList.concat(numericActions.slice(), 'divider');
        break;
      case 'boolean':
        actionsList.concat(booleanActions.slice(), 'divider');
        break;
    }*/
    return (
      <div id="filter-wrapper">
        <DropdownButton id="filterCategoryDropdown" title={this.state.category} bsSize="small" className="bootstrap-elements" onSelect={this.changeCategory}>
          {this.props.titleTable.map( function( title, id ){
            return (
              <MenuItem key={id} id={id} eventKey={id}>{title}</MenuItem>
            );
          })}
        </DropdownButton>
        <DropdownButton id="filterActionDropdown" title={this.state.action} bsSize="small" className="bootstrap-elements" onSelect={this.changeAction}>
        
          {numericActions.map( function (action, id ){
            return (
              <MenuItem key={id} id={id} eventKey={action}>{action}</MenuItem>
            );
          })}
          <MenuItem divider />

          {stringActions.map( function (action, id ){
            return (
              <MenuItem key={id} id={id} eventKey={action}>{action}</MenuItem>
            );
          })}
          <MenuItem divider />

          {booleanActions.map( function (action, id ){
            return (
              <MenuItem key={id} id={id} eventKey={action}>{action}</MenuItem>
            );
          })}
          <MenuItem divider />

          {nullActions.map( function (action, id ){
            return (
              <MenuItem key={id} id={id} eventKey={action}>{action}</MenuItem>
            );
          })}

        </DropdownButton>
        <Input
          type="text"
          value={this.state.input}
          placeholder="Enter text"
          style={{ minWidth: '50vh' }}
          className="bootstrap-elements"
          onChange={this.handleChange}
        />
        <Button 
          onClick={this.applyFilter}
          className="bootstrap-elements"
          bsStyle={ this.state.input ? 'success' : 'default' }
        >
          Apply Filter
        </Button>
        <Button 
          onClick={this.clearFilter}
          className="bootstrap-elements"
        >
          Clear Filter
        </Button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    titleTable: state.currentTable.titleTable,
    columnTypes: state.currentTable.columnTypes,
    isFilterApplied: state.currentTable.isFilterApplied,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CurrentTableActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterComponent);
