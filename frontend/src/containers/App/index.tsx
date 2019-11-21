import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Switch, Router, Route } from 'react-router-dom'
import { Divider } from 'semantic-ui-react'
import Header from 'components/Header'
import NotFound from 'components/NotFound'
import HomePage from 'containers/HomePage'
import Callback from 'components/Callback'
import Auth0 from 'auth/Auth0'
import { loginUser, loginUserCallback, logoutUser } from 'actions'
import { AppState } from 'types/state'
import { AppProps } from 'types/props'

class App extends Component<AppProps, AppState> {

  componentWillMount() {
    this.handleLoginUser = this.handleLoginUser.bind(this)
    this.handleLogoutUser = this.handleLogoutUser.bind(this)
  }

  handleLoginUser() {
    this.props.loginUser(this.props.auth0)
  }

  handleLogoutUser() {
    this.props.logoutUser(this.props.auth0)
  }

  handleLoginUserCallback() {
    this.props.loginUserCallback(this.props.auth0)
  }

  render() {
    return (
      <Router history={this.props.history}>
        <div>
          <Header
            isLoggedIn={this.props.isLoggedIn}
            onLogin={this.handleLoginUser}
            onLogout={this.handleLogoutUser}
          />
          <Divider hidden/>
          <Switch>
            <Route path='/callback'
              render={props => {
                if (!this.props.isLoggedIn) {
                  this.handleLoginUserCallback()
                }
                return <Callback />
              }}
            />
            <Route exact path='/' component={HomePage}/>
            <Route component={NotFound}/>
          </Switch>
        </div>
      </Router>
    )
  }
}

const mapStateToProps = (originalState: any, originalOwnProps: any) => {
  return (state: any, ownProps: any) => {
    return {
      isLoggedIn: state.auth.isLoggedIn,
      auth0: state.auth.auth0,
      history: state.auth.auth0.history
    }
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  loginUser: (auth0: Auth0) => dispatch(loginUser(auth0)),
  loginUserCallback: (auth0: Auth0) => dispatch(loginUserCallback(auth0)),
  logoutUser: (auth0: Auth0) => dispatch(logoutUser(auth0))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
