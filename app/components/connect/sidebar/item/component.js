import React, { Component } from 'react';


const propTypes = {
  setCurrent: React.PropTypes.func.isRequired,
  iconClass: React.PropTypes.string.isRequired,
  iconName: React.PropTypes.string.isRequired,
  item: React.PropTypes.object
};

const defaultProps = {
  item: { id: false }
};

class SidebarItemComponent extends Component {
  constructor(props) {
    super(props);
    this.setCurrent = this.setCurrent.bind(this);
  }

  setCurrent() {
    this.props.setCurrent(this.props.item.id);
  }

  render() {
    return (
      <li {...this.props}>
        <a onClick={this.setCurrent}>
          <i className={this.props.iconClass}></i>
          <span>{this.props.iconName}</span>
        </a>
      </li>
    );
  }
}

SidebarItemComponent.propTypes = propTypes;
SidebarItemComponent.defaultProps = defaultProps;

export default SidebarItemComponent;
