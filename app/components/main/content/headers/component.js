import _ from 'lodash';
import cx from 'classnames';
import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ThComponent from './thComponent';

import * as CurrentTableActions from '../../../../actions/currentTable';


const propTypes = {
  getTableContent: React.PropTypes.func.isRequired,
  currentPage: React.PropTypes.number.isRequired,
  order: React.PropTypes.array.isRequired,
  titleTable: React.PropTypes.array.isRequired
};


class HeadersComponent extends Component {
  constructor(props) {
    super(props);
    this.onClickSort = this.onClickSort.bind(this);
  }

  onClickSort(fieldName, icon) {
    const order = this.props.order;
    switch (icon.className) {
      case 'fa fa-sort':
        order.length = 0;
        order.push({ fieldName, type: 'ASC' });
        break;
      case 'fa fa-sort-asc': {
        order.length = 0;
        order.push({ fieldName, type: 'DESC' });
        break;
      }
      case 'fa fa-sort-desc': {
        order.length = 0;
        break;
      }
      default:
        break;
    }
    const params = {
      order,
      page: this.props.currentPage,
      tableName: window.localStorage.currentTable
    };
    this.props.getTableContent(params);
  }
  render() {
    const headers = [];
    let key = 0;
    const order = this.props.order;
    for (const fieldName of (this.props.titleTable || [])) {
      key += 1;
      const orderItem = _.find(order, { fieldName });
      const index = orderItem && _.findIndex(order, { fieldName, type: orderItem.type });

      const sortClass = cx({
        fa: true,
        'fa-sort': !orderItem,
        'fa-sort-asc': orderItem && orderItem.type === 'ASC',
        'fa-sort-desc': orderItem && orderItem.type === 'DESC'
      });
      headers.push(
        <ThComponent key={key} onClickSort={this.onClickSort} index={index} fieldName={fieldName}
          sortClass={sortClass}
        />
      );
    }
    return <tr>{headers}</tr>;
  }
}

HeadersComponent.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    currentPage: state.currentTable.page,
    order: state.currentTable.order
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CurrentTableActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HeadersComponent);
