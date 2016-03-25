import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import SidebarMainComponent from '../main/sidebar/component';
import SidebarConnectComponent from '../connect/sidebar/component';
import ContentConnectComponent from '../connect/content/component';

const propTypes = {
  children: PropTypes.element.isRequired,
  isConnected: PropTypes.bool
};


class BaseComponent extends Component {
  render() {
    const { isConnected } = this.props;
    return (
      <div id="wrapper" className="max-height">
      {isConnected ?
        <div>
          <SidebarMainComponent />
          {this.props.children}
        </div> :
        <div>
          <SidebarConnectComponent />
          <ContentConnectComponent />
        </div>
      }
      {
        (() => {
          if (process.env.NODE_ENV !== 'production') {
            const DevTools = require('./DevTools');
            return <DevTools />;
          }
          return null;
        })()
      }
      </div>
    );
  }
}

BaseComponent.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    isConnected: state.currentTable.isConnected
  };
}

export default connect(mapStateToProps)(BaseComponent);
