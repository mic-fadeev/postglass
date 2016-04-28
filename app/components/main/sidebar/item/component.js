import React, { Component } from 'react';


const propTypes = {
  setCurrentTable: React.PropTypes.func.isRequired,
  getTableContent: React.PropTypes.func.isRequired,
  item: React.PropTypes.object.isRequired
};

class SidebarItemComponent extends Component {
  constructor(props) {
    super(props);
    this.showTable = this.showTable.bind(this);
  }

  showTable() {
    this.props.setCurrentTable(this.props.item.table_name);
    this.props.getTableContent({ tableName: this.props.item.table_name });
    document.getElementById('wrapper').scrollTop = 0;
  }
  render() {
    return (
      <li {...this.props}>
        <a onClick={this.showTable}>
          <i className="fa fa-table"></i>
          <span>{this.props.item.table_name}</span>
        </a>
      </li>
    );
  }
}

SidebarItemComponent.propTypes = propTypes;

export default SidebarItemComponent;
