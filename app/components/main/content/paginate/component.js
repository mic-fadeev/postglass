import React, { Component } from 'react';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as CurrentTableActions from '../../../../actions/currentTable';

const propTypes = {
  order: React.PropTypes.array.isRequired,
  getTableContent: React.PropTypes.func.isRequired,
  totalCount: React.PropTypes.number.isRequired,
  currentPage: React.PropTypes.number.isRequired,
  items: React.PropTypes.array.isRequired,
  titleTable: React.PropTypes.array.isRequired,
  toggleFilter: React.PropTypes.func.isRequired,
  toShowFilter: React.PropTypes.bool.isRequired,
};


class PaginationComponent extends Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    this.prevPaginate = this.prevPaginate.bind(this);
    this.nextPaginate = this.nextPaginate.bind(this);
    this._paginate = this._paginate.bind(this);
    this._showPage = this._showPage.bind(this);
    this.showSearchPage = this.showSearchPage.bind(this);
    this.showFilter = this.showFilter.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  getMaxPage() {
    return Math.ceil(this.props.totalCount / 100);
  }

  getRow() {
    const page = this.props.currentPage;
    if (Object.keys(this.props.items).length < 100) {
      return `1 -  ${page}`;
    }
    return `${1 + (page - 1) * 100} - ${page * 100}`;
  }

  prevPaginate() {
    this._paginate('prev');
  }

  nextPaginate() {
    this._paginate('next');
  }

  showFilter() {
    this.props.toShowFilter ? 
    document.getElementById('table-wrapper').style.maxHeight = 'calc(100vh - 55px)' :
    document.getElementById('table-wrapper').style.maxHeight = 'calc(100vh - 147px)';
    this.props.toggleFilter(!this.props.toShowFilter);
  }

  handleKeyDown(event) {
    if (event.ctrlKey && event.keyCode === 71) {
      this.showFilter();
    }
  }

  showSearchPage(event) {
    event.preventDefault();
    this._showPage(this.refs.pageForm.value);
  }

  _paginate(side) {
    const currentTable = window.localStorage.currentTable;
    let page = this.props.currentPage;
    const maxPage = this.getMaxPage();
    if (maxPage >= page) {
      if (side === 'prev') page--;
      if (side === 'next') page++;
      const params = {
        page,
        order: this.props.order,
        tableName: currentTable,
        titleTable: this.props.titleTable
      };
      this.props.getTableContent(params);
      document.getElementById('wrapper').scrollTop = 0;
    }
  }

  _showPage(number) {
    const currentTable = window.localStorage.currentTable;
    const maxPage = this.getMaxPage();
    if (number <= maxPage) {
      const params = {
        page: Number(number),
        order: this.props.order,
        tableName: currentTable,
        titleTable: this.props.titleTable
      };
      this.props.getTableContent(params);
      document.getElementById('wrapper').scrollTop = 0;
    }
  }

  render() {
    const page = this.props.currentPage;
    const maxPage = this.getMaxPage();
    const row = this.getRow();
    const maxRow = this.props.totalCount;

    return (
      <div className="pagination-fixed">
      <div className="searchPage">
        </div>
          <div className="footer fixed">
          <div className="currentRow">
          {this.props.items.length ?
            <span className="btn"> {row} of {maxRow}</span> :
            <span className="btn">Loading rows...</span>
          }
          </div>

          <Button
            bsStyle="default"
            style={{ float: 'right' }}
            onKeyDown={ this.handleKeyDown }
            onClick={ this.showFilter }
          >
            Filter
          </Button>

          <div className="btn-group">
            <button disabled={page === 1}
              onClick={this.prevPaginate}
              className="btn btn-link"
            >
              <i className="fa fa-chevron-left"></i>
            </button>
          <OverlayTrigger trigger="click"
            placement="top"
            overlay={ 
              <Popover id="popover">
                <form onSubmit={this.showSearchPage}>
                  <input type="text" ref="pageForm" />
                </form>
              </Popover> }
          >
           <Button bsStyle="default">
            Page {page} of {maxPage}</Button>
          </OverlayTrigger>
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
}

PaginationComponent.propTypes = propTypes;
function mapStateToProps(state) {
  return {
    totalCount: state.currentTable.totalCount,
    currentPage: state.currentTable.page,
    order: state.currentTable.order,
    items: state.currentTable.items,
    titleTable: state.currentTable.titleTable,
    toShowFilter: state.currentTable.toShowFilter,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CurrentTableActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PaginationComponent);
