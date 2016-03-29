import React, { Component } from 'react';

import { DropdownButton, MenuItem, Input, Button } from 'react-bootstrap';

const propTypes = {
  titleTable: React.PropTypes.array.isRequired,
}

class FilterComponent extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div id="filter-wrapper">
        <DropdownButton title="sad" bsSize="xsmall" style={{ float: 'left' }}>
          {this.props.titleTable.map( function( title, id ){
            return (
              <MenuItem key={id} eventKey={id}>{title}</MenuItem>
            );
          })}
        </DropdownButton>
        <DropdownButton title="sasdasad" bsSize="xsmall" style={{ float: 'left' }}>
          <MenuItem eventKey="1">&#61;</MenuItem>
          <MenuItem eventKey="2">&ne;</MenuItem>
          <MenuItem eventKey="3">&#60;</MenuItem>
          <MenuItem eventKey="4">&#62;</MenuItem>
          <MenuItem eventKey="5">&le;</MenuItem>
          <MenuItem eventKey="6">&ge;</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey="7">is NULL</MenuItem>
          <MenuItem eventKey="8">is not NULL</MenuItem>
        </DropdownButton>
{/*        <Input
          type="text"
          value="asdas"
          placeholder="Enter text"
          ref="input"
          groupClassName="group-class"
          labelClassName="label-class"
          style={{ width: 400 }}
        />*/}
        <Button>Apply Filter</Button>
      </div>
    );
  }
}

export default FilterComponent;
