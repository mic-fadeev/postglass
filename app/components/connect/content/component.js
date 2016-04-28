import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';
import Joi from 'joi';
import classnames from 'classnames';

const dialog = require('remote').require('dialog');
const os = require('remote').require('os');
const path = require('remote').require('path');

import * as CurrentTableActions from '../../../actions/currentTable';
import * as FavoritesActions from '../../../actions/favorites';
import getValidatorData, { getFieldValue } from '../../base/validatorData';


const propTypes = {
  favorites: React.PropTypes.array.isRequired,
  setFavorit: React.PropTypes.func.isRequired,
  connectDB: React.PropTypes.func.isRequired,
  isValid: React.PropTypes.func,
  handleValidation: React.PropTypes.func,
  getValidationMessages: React.PropTypes.func,
  clearValidations: React.PropTypes.func,
  validate: React.PropTypes.func
};


class ContentConnectComponent extends Component {
  constructor(props) {
    super(props);
    this.validatorTypes = {
      user: Joi.string().required().label('User'),
      password: Joi.string().allow(''),
      address: Joi.string().required(),
      database: Joi.string().required().label('Database'),
      port: Joi.number().integer().required().label('Port'),
      useSSH: Joi.boolean(),
      sshUser: Joi.alternatives().when('useSSH',
          { is: true,
            then: Joi.string().required(),
            otherwise: Joi.string().allow('')
          }),
      sshPassword: Joi.string().allow(''),
      sshServer: Joi.alternatives().when('useSSH',
          { is: true,
            then: Joi.string().required(),
            otherwise: Joi.string().allow('')
          }),
      sshPort: Joi.alternatives().when('useSSH',
          { is: true,
            then: Joi.number().integer().required(),
            otherwise: Joi.string().allow('')
          })
    };
    this.getValidatorData = this.getValidatorData.bind(this);
    this.getClasses = this.getClasses.bind(this);
    this.showDialog = this.showDialog.bind(this);
    this.setFavorit = this.setFavorit.bind(this);
    this.delFavorit = this.delFavorit.bind(this);
    this.getValue = this.getValue.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state = { currentFavorit: { address: 'localhost', port: '5432', sshPort: '22', useSSH: false } };

  componentWillReceiveProps(nextProps) {
    for (const favorit of nextProps.favorites) {
      if (favorit.isCurrent) {
        if (this.state.currentFavorit.id !== favorit.id) {
          this.setState({ currentFavorit: Object.assign({}, favorit) });
          this.props.clearValidations();
        }
        return;
      }
    }
    if (this.state.currentFavorit.id) {
      this.setState({ currentFavorit: {} });
    }
  }

  onChange(field) {
    return event => {
      const currentFavorit = this.state.currentFavorit;
      this.props.validate(field);
      currentFavorit[field] = getFieldValue(event.target);
      this.setState({ currentFavorit });
    };
  }

  getClasses(field) {
    return classnames({
      'form-group': true,
      'has-error': !this.props.isValid(field)
    });
  }

  getValidatorData() {
    return getValidatorData(this.refs, this.validatorTypes);
  }

  setFavorit() {
    const favorites = this.props.favorites;
    let favorit = null;
    const currentFavorit = Object.assign({}, this.state.currentFavorit, this.getValidatorData());
    this.setState({ currentFavorit });
    const onValidate = (error) => {
      if (!error) {
        let index = 0;
        for (const favoritItem of favorites) {
          if (favoritItem.id === currentFavorit.id) {
            favorit = favoritItem;
            break;
          }
          index += 1;
        }
        if (favorit) {
          favorites[index] = currentFavorit;
        } else {
          if (favorites.length) {
            currentFavorit.id = favorites[favorites.length - 1].id + 1;
          } else {
            currentFavorit.id = 1;
          }
          favorites.push(currentFavorit);
        }
        this.props.setFavorit(favorites, currentFavorit.id);
      }
    };
    this.props.validate(onValidate);
  }

  getValue(name) {
    return this.state.currentFavorit[name] ? this.state.currentFavorit[name] : '';
  }

  handleSubmit(event) {
    event.preventDefault();
    const currentFavorit = Object.assign({}, this.state.currentFavorit, this.getValidatorData());
    this.setState({ currentFavorit });
    const onValidate = (error) => {
      if (!error) {
        this.props.connectDB(this.state.currentFavorit);
      }
    };
    this.props.validate(onValidate);
  }

  showDialog(event) {
    event.preventDefault();
    const defaultPath = path.join(os.homedir(), '.ssh');
    dialog.showOpenDialog({ defaultPath, properties: ['openFile'] }, (file) => {
      const currentFavorit = this.state.currentFavorit;
      currentFavorit.privateKey = file[0];
      this.setState({ currentFavorit });
    });
  }

  delFavorit() {
    const favorites = this.props.favorites;
    let index = 0;
    for (const favoritItem of favorites) {
      if (favoritItem.id === this.state.currentFavorit.id) {
        break;
      }
      index += 1;
    }
    favorites.splice(index, 1);
    this.props.setFavorit(favorites);
  }

  render() {
    const currentFavorit = this.state.currentFavorit;

    return (
      <div className="gray-bg dashbard-1" id="page-wrapper">
        <div className="wrapper wrapper-content">
          <div className="row">
            <div className="col-lg-12">
              <div className="row">
                <div className="ibox">
                  <div className="ibox-title">
                    <h5>New connection</h5>
                  </div>
                  <div className="ibox-content">
                    <div className="middle-box text-center loginscreen"
                      style={{ marginTop: '-5px' }}
                    >
                      <div>
                        <form className="m-t" role="form" onSubmit={this.handleSubmit}>
                          <input type="hidden" ref="id" value={this.getValue('id')} />
                          <div className={this.getClasses('name')}>
                            <label className="error">
                              {this.props.getValidationMessages('name')}
                            </label>
                            <input className="form-control" name="name"
                              onChange={this.onChange('name')}
                              placeholder="Connection name"
                              ref="name"
                              value={this.getValue('name')}
                              type="text"
                            />
                          </div>

                          <div className={this.getClasses('user')}>
                            <label className="error">
                              {this.props.getValidationMessages('user')}
                            </label>
                            <input className="form-control" name="user"
                              placeholder="User"
                              ref="user"
                              type="text"
                              value={this.getValue('user')}
                              onChange={this.onChange('user')}
                            />
                          </div>

                          <div className={this.getClasses('password')}>
                            <label className="error">
                              {this.props.getValidationMessages('password')}
                            </label>
                            <input className="form-control" name="password"
                              placeholder="Password"
                              ref="password"
                              value={this.getValue('password')}
                              type="password"
                              onChange={this.onChange('password')}
                            />
                          </div>


                          <div className={this.getClasses('address')}>
                            <label className="error">
                              {this.props.getValidationMessages('address')}
                            </label>
                            <input className="form-control" name="address"
                              onChange={this.onChange('address')}
                              placeholder="Host"
                              ref="address"
                              value={this.getValue('address')}
                              type="text"
                            />
                          </div>


                          <div className={this.getClasses('database')}>
                            <label className="error">
                              {this.props.getValidationMessages('database')}
                            </label>
                            <input className="form-control" name="database"
                              onChange={this.onChange('database')}
                              placeholder="Database"
                              ref="database"
                              value={this.getValue('database')}
                              type="text"
                            />
                          </div>

                          <div className={this.getClasses('port')}>
                            <label className="error">
                              {this.props.getValidationMessages('port')}
                            </label>
                            <input className="form-control" name="port"
                              onChange={this.onChange('port')}
                              placeholder="Port"
                              ref="port"
                              value={this.getValue('port')}
                              type="text"
                            />
                          </div>

                          <div className="checkbox">
                            <label>
                              <input ref="useSSH" name="useSSH" checked={currentFavorit.useSSH}
                                onChange={this.onChange('useSSH')} type="checkbox"
                              /> Connect via SSH
                            </label>
                          </div>
                          { currentFavorit.useSSH &&
                          <div>
                            <div className={this.getClasses('sshUser')}>
                              <label className="error">
                                {this.props.getValidationMessages('sshUser')}
                              </label>
                              <input className="form-control" name="sshUser"
                                onChange={this.onChange('sshUser')}
                                placeholder="SSH user"
                                value={this.getValue('sshUser')}
                                ref="sshUser"
                                type="text"
                              />
                            </div>

                            <div className={this.getClasses('sshPassword')}>
                              <label className="error">
                                {this.props.getValidationMessages('sshPassword')}
                              </label>
                              <input className="form-control" name="sshPassword"
                                onChange={this.onChange('sshPassword')}
                                placeholder="SSH password"
                                value={this.getValue('sshPassword')}
                                ref="sshPassword"
                                type="password"
                              />
                            </div>

                            <div className={this.getClasses('sshServer')}>
                              <label className="error">
                                {this.props.getValidationMessages('sshServer')}
                              </label>
                              <input className="form-control" name="sshServer"
                                onChange={this.onChange('sshServer')}
                                placeholder="SSH server"
                                value={this.getValue('sshServer')}
                                ref="sshServer"
                                type="text"
                              />
                            </div>

                            <div className={this.getClasses('sshPort')}>
                              <label className="error">
                                {this.props.getValidationMessages('sshPort')}
                              </label>
                              <input className="form-control" name="sshPort"
                                onChange={this.onChange('sshPort')}
                                placeholder="SSH port"
                                value={this.getValue('sshPort')}
                                ref="sshPort"
                                type="text"
                              />
                            </div>

                            <div className="form-group">
                              <label>{currentFavorit.privateKey}</label><br />
                              <label className="btn btn-primary">
                                <input ref="sshKey" type="file" className="hide"
                                  onClick={this.showDialog}
                                />
                                Private key
                              </label>
                            </div>

                          </div>
                          }

                          <button className="btn btn-primary block full-width m-b" type="submit">
                            Connect
                          </button>

                          <button className="btn btn-primary block full-width m-b"
                            onClick={this.setFavorit} type="button"
                          >
                            Save
                          </button>

                          { currentFavorit.id &&
                          <button className="btn btn-primary block full-width m-b"
                            onClick={this.delFavorit} type="button"
                          >
                            Delete
                          </button>
                          }

                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ContentConnectComponent.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    favorites: state.favorites
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...CurrentTableActions, ...FavoritesActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  validation(strategy)(ContentConnectComponent)
);
