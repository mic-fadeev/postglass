import React, { Component } from 'react';


const propTypes = {
  onClickSort: React.PropTypes.func.isRequired,
  fieldName: React.PropTypes.string.isRequired,
  sortClass: React.PropTypes.string.isRequired
};


class ThComponent extends Component {
  constructor(props) {
    super(props);
    this.onClickSort = this.onClickSort.bind(this);
  }

  onClickSort(ev) {
    const icon = ev.currentTarget.getElementsByClassName('fa')[0];
    this.props.onClickSort(this.props.fieldName, icon);
  }

  render() {
    const { fieldName, sortClass, } = this.props;
    return (
      <th {...this.props} style={{ cursor: 'pointer' }} onClick={ this.onClickSort } id={fieldName}>
        <div className="table-header" id={fieldName + 1}>
          <span>{fieldName}</span>
          <span className="pull-right" style={{ position: 'fixed' }}>
            <i className={sortClass}></i>
          </span>
        </div>
        <span>{fieldName}</span>
      </th>
    );
  }
}

ThComponent.propTypes = propTypes;

export default ThComponent;
