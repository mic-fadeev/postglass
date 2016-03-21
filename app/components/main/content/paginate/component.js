import React, { Component } from 'react';
import { Buton, Modal, Overlay } from 'react-bootstrap';

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
    this.state = {
      showModal: false,
    };
    this.render = this.render.bind(this);
    


    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this); 


    this.prevPaginate = this.prevPaginate.bind(this);
    this.nextPaginate = this.nextPaginate.bind(this);
    this._paginate = this._paginate.bind(this);
    this._showPage = this._showPage.bind(this);
    this.showSearchPage = this.showSearchPage.bind(this);

  }

  getMaxPage() {
    return Math.ceil(this.props.totalCount / 100);
  }

  getRow() {
    let page = this.props.currentPage;
    if (Object.keys(this.props.items).length < 100) {
      return (1 + "-" + page)
    }
    else {
      return ((1+(page-1)*100) + "-" + (page*100))
      }  
  }



  prevPaginate() {
    this._paginate('prev');
  }

  nextPaginate() {
    this._paginate('next');
  }

  openModal(event) {
    this.setState({ showModal: true });
  }

  closeModal(event) {
    this.setState({ showModal: false });
  }


  showSearchPage(event) {
    event.preventDefault();
    this._showPage(this.refs.pageForm.value);
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




  _showPage(number) {
    const currentTable = window.localStorage.currentTable;
    const maxPage = this.getMaxPage();
    let page = this.props.currentPage;
    if (number <= maxPage) {
      console.log(number);
      const params = {
        page: number,
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
    const row = this.getRow();
    const maxRow = this.props.totalCount;
    console.log(this.state);
    if (this.props.totalCount) {  
      return (
        <div className="pagination-fixed">
        <div className="searchPage">         
          </div>
            <div className="footer fixed">   
            <div className="currentRow">
            <Modal show={this.state.showModal} onHide={this.closeModal.bind(this)}>                
              <form onSubmit={this.showSearchPage}>
                <input type="text" 
                  ref="pageForm"
                  />
              </form>
            </Modal> 
            <span className="btn"> {row} of {maxRow}</span>

            </div>
            <div className="btn-group">
              <button disabled={page === 1}
                onClick={this.prevPaginate}
                className="btn btn-link"
              >
                <i className="fa fa-chevron-left"></i>
              </button>
            
            <button disabled={maxPage === 1}
              onClick={this.openModal.bind(this)}
              className="btn"
            >
            Page {page} of {maxPage}</button>
            
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
    order: state.currentTable.order,
    items: state.currentTable.items
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CurrentTableActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PaginationComponent);
