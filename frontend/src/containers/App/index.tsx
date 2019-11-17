import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Switch, BrowserRouter, Route } from 'react-router-dom'
import { Divider } from 'semantic-ui-react'
import Auth from 'auth/Auth'
import Header from 'components/Header'
import NotFound from 'components/NotFound'
import HomePage from 'containers/HomePage'

export interface AppProps {
  auth: Auth
}

export interface AppState {}

class App extends Component<AppProps, AppState> {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Header auth={this.props.auth}/>
          <Divider hidden/>
          <Switch>
            <Route exact path='/' component={HomePage}/>
            <Route component={NotFound}/>
          </Switch>
        </div>
      </BrowserRouter>
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
