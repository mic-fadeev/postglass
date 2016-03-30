import React, { Component } from 'react';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as CurrentTableActions from '../../../../actions/currentTable';

const propTypes = {
  order: React.PropTypes.array.isRequired,
  getTableContent: React.PropTypes.func.isRequired,
  changeMode: React.PropTypes.func.isRequired,
  totalCount: React.PropTypes.number.isRequired,
  currentPage: React.PropTypes.number.isRequired,
  items: React.PropTypes.array.isRequired,
  isFetching: React.PropTypes.bool.isRequired,
  titleTable: React.PropTypes.array.isRequired,
  isContent: React.PropTypes.bool.isRequired,
};


class PaginationComponent extends Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);

    this.prevPaginate = this.prevPaginate.bind(this);
    this.nextPaginate = this.nextPaginate.bind(this);
    this.showContent = this.showContent.bind(this);
    this.showStructure = this.showStructure.bind(this);
    this._switchStructure = this._switchStructure.bind(this);
    this._paginate = this._paginate.bind(this);
    this._showPage = this._showPage.bind(this);
    this.showSearchPage = this.showSearchPage.bind(this);
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


  showSearchPage(event) {
    event.preventDefault();
    this._showPage(this.refs.pageForm.value);
  }

  showContent() {
    this._switchStructure('content');
  }

  showStructure() {
    this._switchStructure('structure');
  }

  _switchStructure(view) {
    let stay = this.props.isContent;
    if (view === 'content') stay = true;
    if (view === 'structure') stay = false;
    const params = stay;
    this.props.changeMode(params);
    document.getElementById('wrapper').scrollTop = 0;
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
        titleTable: this.props.titleTable,
      };
      this.props.getTableContent(params);
      document.getElementById('wrapper').scrollTop = 0;
    }
  }

  _showPage(number) {
    const close = this.refs.trigger;
    close.hide();
    const currentTable = window.localStorage.currentTable;
    const maxPage = this.getMaxPage();
    if (number <= maxPage && number > 0) {
      const params = {
        page: Number(number),
        order: this.props.order,
        tableName: currentTable,
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
              {this.props.isFetching ?
                <span className="btn">Loading rows...</span> :
                <span className="btn"> {row} of {maxRow}</span>
              }
              </div>
            <div className="btn-group">
            <button

              onClick={this.showContent}
              className={this.props.isContent ? 'btn btn-empty' : 'btn btn-link'}
            >
            Content
            </button>
            <button
              onClick={this.showStructure}
              className={this.props.isContent ? 'btn btn-link' : 'btn btn-empty'}
            >
            Structure
            </button>
            <button disabled={page === 1}
              onClick={this.prevPaginate}
              className="btn btn-link"
            >
              <i className="fa fa-chevron-left"></i>
            </button>
          <OverlayTrigger
            ref="trigger"
            disabled={maxPage < 2}
            trigger="click"
            rootClose={true}
            placement="top"
            overlay={<Popover id="popover"><form onSubmit={this.showSearchPage}>
                <input
                  type="text"
                  size="8"
                  placeholder={page}
                  ref="pageForm"
                />
                <button className="btn btn-link">
              Go
              </button>
              </form>
              </Popover>}
          >
          <Button bsStyle="default"
            disabled={page === maxPage}
          >
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
    isFetching: state.currentTable.isFetching,
    titleTable: state.currentTable.titleTable,
    isContent: state.currentTable.isContent,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CurrentTableActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PaginationComponent);
