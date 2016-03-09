import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as CurrentTableActions from '../../../../actions/currentTable';


const propTypes = {
  order: React.PropTypes.array.isRequired,
  getTableContent: React.PropTypes.func.isRequired,
  totalCount: React.PropTypes.number.isRequired,
  currentPage: React.PropTypes.number.isRequired
};


class PaginationComponent extends Component {
  constructor(props) {
    super(props);
    this.prevPaginate = this.prevPaginate.bind(this);
    this.nextPaginate = this.nextPaginate.bind(this);
    this._paginate = this._paginate.bind(this);
  }

  getMaxPage() {
    return Math.ceil(this.props.totalCount / 100);
  }

  prevPaginate() {
    this._paginate('prev');
  }

  nextPaginate() {
    this._paginate('next');
  }

  _paginate(side) {
    const currentTable = window.localStorage.currentTable;
    let page = this.props.currentPage;
    const maxPage = this.getMaxPage();
    if (maxPage > page) {
      if (side === 'prev') page--;
      if (side === 'next') page++;
      const params = {
        page,
        order: this.props.order,
        tableName: currentTable
      };
      this.props.getTableContent(params);
      document.getElementById('wrapper').scrollTop = 0;
    }
  }

  render() {
    const page = this.props.currentPage;
    const maxPage = this.getMaxPage();

    if (this.props.totalCount) {
      return (
        <div className="pagination-fixed">
          <div className="panel pull-left">
            <div className="btn-group">
              <button disabled={page === 1}
                onClick={this.prevPaginate}
                className="btn btn-link"
              >
                <i className="fa fa-chevron-left"></i>
              </button>
            </div>
            <span className="btn-group">Page {page} of {maxPage}</span>
            <div className="btn-group">
              <button disabled={page === maxPage}
                onClick={this.nextPaginate}
                className="btn btn-link"
              >
                <i className="fa fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}

PaginationComponent.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    totalCount: state.currentTable.totalCount,
    currentPage: state.currentTable.page,
    order: state.currentTable.order
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CurrentTableActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PaginationComponent);
