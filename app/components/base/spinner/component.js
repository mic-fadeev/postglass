import React, { Component } from 'react';

const propTypes = {
  isShow: React.PropTypes.bool.isRequired,
  msg: React.PropTypes.string
};

const defaultProps = {
  isShow: false
};

class SpinnerComponent extends Component {
  render() {
    if (this.props.isShow) {
      return (
        <div className="fetching-container">
          <div className="middle-box text-center fetching-animation">
            <div className="sk-spinner sk-spinner-three-bounce">
              <div className="sk-bounce1"></div>
              <div className="sk-bounce2"></div>
              <div className="sk-bounce3"></div>
            </div>
            <i>{this.props.msg}</i>
          </div>
        </div>
      );
    }
    return null;
  }
}


SpinnerComponent.propTypes = propTypes;
SpinnerComponent.defaultProps = defaultProps;

export default SpinnerComponent;
