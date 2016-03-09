import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
const dialog = require('remote').require('dialog');
const os = require('remote').require('os');
const path = require('remote').require('path');

import ValidateMixin from '../../base/validate-mixin/mixin';
import * as CurrentTableActions from '../../../actions/currentTable';
import * as FavoritesActions from '../../../actions/favorites';


const ContentConnectComponent = React.createClass({ // eslint-disable-line react/prefer-es6-class
  propTypes: {
    favorites: React.PropTypes.array.isRequired,
    setFavorit: React.PropTypes.func.isRequired,
    connectDB: React.PropTypes.func.isRequired
  },

  mixins: [ValidateMixin],

  getInitialState() {
    return {
      currentFavorit: {},
      errors: {},
      fields: {
        id: { converter: this.converters.int },
        name: null,
        useSSH: null,
        user: this.validators.required,
        password: null,
        database: this.validators.required,
        port: this.validators.required,
        sshUser: { depends: {
          useSSH: this.validators.equal({ value: true }) }, validators: this.validators.required
        },
        sshServer: { depends: {
          useSSH: this.validators.equal({ value: true }) }, validators: this.validators.required
        },
        sshPort: {
          depends: { useSSH: this.validators.equal({ value: true }) },
          validators: this.validators.required
        }
      }
    };
  },

  componentWillReceiveProps(nextProps) {
    for (const favorit of nextProps.favorites) {
      if (favorit.isCurrent) {
        this.setState({ currentFavorit: Object.assign({}, favorit) });
        return;
      }
    }
    this.setState({ currentFavorit: {} });
  },

  setFavorit() {
    const res = this.validate();
    const favorites = this.props.favorites;
    let favorit = null;

    if (Object.keys(res.errors).length !== 0) {
      this.setState({ errors: res.errors });
    } else {
      let index = 0;
      for (const favoritItem of favorites) {
        if (favoritItem.id === res.data.id) {
          favorit = favoritItem;
          break;
        }
        index += 1;
      }
      if (favorit) {
        favorites[index] = res.data;
      } else {
        if (favorites.length) {
          res.data.id = favorites[favorites.length - 1].id + 1;
        } else {
          res.data.id = 1;
        }
        favorites.push(res.data);
      }
      res.data.privateKey = this.state.currentFavorit.privateKey;
      this.props.setFavorit(favorites, res.data.id);
    }
  },

  handleSubmit(event) {
    event.preventDefault();
    const res = this.validate();

    if (Object.keys(res.errors).length !== 0) {
      this.setState({ errors: res.errors });
    } else {
      res.data.privateKey = this.state.currentFavorit.privateKey;
      this.props.connectDB(res.data);
    }
  },


  handleChange(event) {
    const validateObj = {};
    const fieldName = event.target.name;
    const currentFavorit = this.state.currentFavorit;

    validateObj[fieldName] = this.state.fields[fieldName];
    const res = this.validate('change', validateObj);
    currentFavorit[fieldName] = res.data[fieldName];
    this.setState({ errors: res.errors, currentFavorit });
  },

  showDialog(event) {
    event.preventDefault();
    const defaultPath = path.join(os.homedir(), '.ssh');
    dialog.showOpenDialog({ defaultPath, properties: ['openFile'] }, (file) => {
      const currentFavorit = this.state.currentFavorit;
      currentFavorit.privateKey = file[0];
      this.setState({ currentFavorit });
    });
  },


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
  },

  render() {
    const errors = this.state.errors;
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
                          <input type="hidden" ref="id" value={currentFavorit.id} />
                          <div className="form-group">
                            <input className="form-control" name="name"
                              onChange={this.handleChange}
                              placeholder="Connection name"
                              ref="name"
                              value={currentFavorit.name}
                              type="text"
                            />
                          </div>

                          <div className={errors.user ? 'form-group has-error' : 'form-group'}>
                            <label className="error">{errors.user}</label>
                            <input className="form-control" name="user"
                              onChange={this.handleChange}
                              placeholder="User"
                              ref="user"
                              value={currentFavorit.user}
                              type="text"
                            />
                          </div>

                          <div className="form-group">
                            <input className="form-control" name="password"
                              onChange={this.handleChange}
                              placeholder="Password"
                              ref="password"
                              value={currentFavorit.password}
                              type="password"
                            />
                          </div>

                          <div className={errors.database ? 'form-group has-error' : 'form-group'}>
                            <label className="error">{errors.database}</label>
                            <input className="form-control" name="database"
                              onChange={this.handleChange}
                              placeholder="Database"
                              ref="database"
                              value={currentFavorit.database}
                              type="text"
                            />
                          </div>

                          <div className={errors.port ? 'form-group has-error' : 'form-group'}>
                            <label className="error">{errors.database}</label>
                            <input className="form-control" name="port"
                              onChange={this.handleChange}
                              placeholder="Port"
                              ref="port"
                              value={currentFavorit.port}
                              defaultValue="5432"
                              type="text"
                            />
                          </div>

                          <div className="checkbox">
                            <label>
                              <input ref="useSSH" name="useSSH" checked={currentFavorit.useSSH}
                                onChange={this.handleChange} type="checkbox"
                              /> Connect via SSH
                            </label>
                          </div>
                          { currentFavorit && currentFavorit.useSSH &&
                            <div>
                              <div className="form-group">
                                <label className="error">{errors.sshUser}</label>
                                <input className="form-control" name="sshUser"
                                  onChange={this.handleChange}
                                  placeholder="SSH user"
                                  value={currentFavorit.sshUser}
                                  ref="sshUser"
                                  type="text"
                                />
                              </div>

                              <div className="form-group">
                                <label className="error">{errors.sshUser}</label>
                                <input className="form-control" name="sshPassword"
                                  onChange={this.handleChange}
                                  placeholder="SSH password"
                                  value={currentFavorit.sshPassword}
                                  ref="sshPassword"
                                  type="password"
                                />
                              </div>

                              <div className="form-group">
                                <label className="error">{errors.sshServer}</label>
                                <input className="form-control" name="sshServer"
                                  onChange={this.handleChange}
                                  placeholder="SSH server"
                                  value={currentFavorit.sshServer}
                                  ref="sshServer"
                                  type="text"
                                />
                              </div>

                              <div className="form-group">
                                <label className="error">{errors.sshPort}</label>
                                <input className="form-control" name="sshPort"
                                  onChange={this.handleChange}
                                  placeholder="SSH port"
                                  defaultValue="22"
                                  value={currentFavorit.sshPort}
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
});


function mapStateToProps(state) {
  return {
    favorites: state.favorites
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...CurrentTableActions, ...FavoritesActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentConnectComponent);
