import React, { Component } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import * as FavoritesActions from '../../../actions/favorites';
import SidebarItemComponent from './item/component';


const propTypes = {
  getFavorites: React.PropTypes.func.isRequired,
  setCurrent: React.PropTypes.func.isRequired,
  favorites: React.PropTypes.array.isRequired
};


class SidebarConnectComponent extends Component {
  constructor(props) {
    super(props);
    this.setCurrent = this.setCurrent.bind(this);
  }

  componentWillMount() {
    this.props.getFavorites();
  }

  setCurrent(itemId) {
    this.props.setCurrent(itemId);
  }

  render() {
    const { favorites } = this.props;
    let noFavorits = true;
    for (const favorit of favorites) {
      if (favorit.isCurrent) {
        noFavorits = false;
        break;
      }
    }

    return (
      <nav className="navbar-default navbar-static-side scrollable">
        <div className="sidebar-collapse">
          <ul className="nav metismenu">
            <SidebarItemComponent
              iconName="New connection"
              iconClass="fa fa-plus"
              className={noFavorits && 'active'}
              setCurrent={this.setCurrent}
            />
          </ul>
          <hr />
          { (favorites.length > 0) &&
          <div>
            <h3>Favorites</h3>
            <ul className="nav metismenu">
              { favorites.map((item) =>
                  (
                    <SidebarItemComponent
                      key={item.id}
                      item={item}
                      iconName={item.name || item.user}
                      iconClass="fa fa-database"
                      className={item.isCurrent && 'active'}
                      setCurrent={this.setCurrent}
                    />
                  )
                )
              }
            </ul>
          </div>
          }
        </div>
      </nav>
    );
  }
}

SidebarConnectComponent.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    favorites: state.favorites
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(FavoritesActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarConnectComponent);
