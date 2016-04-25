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
    this.getStyle = this.getStyle.bind(this);
  }

  onClickSort(ev) {
    const icon = ev.currentTarget.getElementsByClassName('fa')[0];
    this.props.onClickSort(this.props.fieldName, icon);
  }

  getStyle(item) {
    let length = item.length * 10;
    if (length < 100) {
      length = 100;
    }
    return { cursor: 'pointer', width: length };
  }

  render() {
    const { fieldName, sortClass, } = this.props;
    return (
      <th {...this.props} style={this.getStyle(fieldName)} onClick={ this.onClickSort }>
        <div className="table-header">
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
