import React, { Component } from 'react';


const propTypes = {
  onClickSort: React.PropTypes.func.isRequired,
  index: React.PropTypes.number,
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
    const { index, fieldName, sortClass } = this.props;

    return (
      <th {...this.props} style={{ cursor: 'pointer' }} onClick={ this.onClickSort }>
        <span>{fieldName}</span>
        <span className="pull-right">{index >= 0 && index + 1}<i className={sortClass}></i>
        </span>
      </th>
    );
  }
}

ThComponent.propTypes = propTypes;

export default ThComponent;
