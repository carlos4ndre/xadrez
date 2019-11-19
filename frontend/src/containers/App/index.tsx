import React, { Component } from 'react'
import { History } from 'history'
import { connect } from 'react-redux'
import { Switch, Router, Route } from 'react-router-dom'
import { Divider } from 'semantic-ui-react'
import Auth from 'auth/Auth'
import Header from 'components/Header'
import NotFound from 'components/NotFound'
import HomePage from 'containers/HomePage'
import Callback from 'components/Callback'

export interface AppProps {
  auth: Auth,
  history: History
}

export interface AppState {}

class App extends Component<AppProps, AppState> {

  handleAuthentication = (props: any) => {
    const location = props.location
    if (/access_token|id_token|error/.test(location.hash)) {
      this.props.auth.handleAuthentication()
    }
  }

  render() {
    return (
      <Router history={this.props.history}>
        <div>
          <Header auth={this.props.auth}/>
          <Divider hidden/>
          <Switch>
            <Route path='/callback'
              render={props => {
                this.handleAuthentication(props)
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
    return {}
  }
}

const mapDispatchToProps = (dispatch: any) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
