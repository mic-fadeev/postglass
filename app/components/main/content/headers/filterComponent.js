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
    this.clearFilter = this.clearFilter.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.formActionList = this.formActionList.bind(this);
    this.state = {
      category: this.props.titleTable[0],
      categoryId: 0,
      action: 'action',
      input: '',
      currentActionsList: [],
    }
  }

  changeCategory = (event, eventKey) => {
    this.setState({
      category: this.props.titleTable[eventKey],
      categoryId: eventKey,
    })
    // this.formActionList(); doesnt work for some reason
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

  handleKeyDown = (event) => {
    if (event.keyCode == 13) {
      //this.applyFilter(); same here
    }
  }

  formActionList = () => {
    var actionsList = [];
    switch(this.props.columnTypes[this.state.categoryId]) {
      case 'text':
      case 'string':
      case 'character varying':
        actionsList.concat(stringActions, 'divider');
        break;
      case 'integer':
      case 'real':
      case 'bigint':
        actionsList.concat(numericActions, 'divider');
        break;
      case 'boolean':
        actionsList.concat(booleanActions, 'divider');
        break;
      default:
    }
    this.setState({
      currentActionsList: actionsList
    })
  }

  render() { //temp real bydlo solution
    return (
      <div id="filter-wrapper">
        <DropdownButton 
          dropup 
          id="filterCategoryDropdown" 
          title={this.state.category} 
          bsSize="small" 
          className="bootstrap-elements" 
          onSelect={this.changeCategory}
        >
          {this.props.titleTable.map( function( title, id ){
            return (
              <MenuItem key={id} id={id} eventKey={id}>{title}</MenuItem>
            );
          })}
        </DropdownButton>
        <DropdownButton 
          dropup 
          id="filterActionDropdown" 
          title={this.state.action} 
          bsSize="small" 
          className="bootstrap-elements" 
          onSelect={this.changeAction}
        >
        
          {this.props.columnTypes[this.state.categoryId] == 'character varying' || 
           this.props.columnTypes[this.state.categoryId] == 'text' ||
           this.props.columnTypes[this.state.categoryId] == 'string' ?
            stringActions.map( function (action, id ) {
              return (
                <MenuItem key={id} id={id} eventKey={action}>{action}</MenuItem>
              );
            })
          : null}
          {this.props.columnTypes[this.state.categoryId] == 'character varying' || 
           this.props.columnTypes[this.state.categoryId] == 'text' ||
           this.props.columnTypes[this.state.categoryId] == 'string' ?
            <MenuItem divider />
          : null}

          {this.props.columnTypes[this.state.categoryId] == 'integer' || 
           this.props.columnTypes[this.state.categoryId] == 'real' ||
           this.props.columnTypes[this.state.categoryId] == 'bigint' ?
            numericActions.map( function (action, id ) {
              return (
                <MenuItem key={id} id={id} eventKey={action}>{action}</MenuItem>
              );
            })
          : null}
          {this.props.columnTypes[this.state.categoryId] == 'integer' || 
           this.props.columnTypes[this.state.categoryId] == 'real' ||
           this.props.columnTypes[this.state.categoryId] == 'bigint' ?
            <MenuItem divider />
          : null}

          {this.props.columnTypes[this.state.categoryId] == 'boolean' ?
            booleanActions.map( function (action, id ) {
              return (
                <MenuItem key={id} id={id} eventKey={action}>{action}</MenuItem>
              );
            })
          : null}
          {this.props.columnTypes[this.state.categoryId] == 'boolean' ?
            <MenuItem divider />
          : null}

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
          onKeyDown={this.handleKeyDown}
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
