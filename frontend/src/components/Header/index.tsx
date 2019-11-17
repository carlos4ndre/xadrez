import React, { Component } from 'react'
import { Button, Menu } from 'semantic-ui-react'
import Logo from 'components/Logo'
import Auth from 'auth/Auth'

export interface AppProps {
  auth: Auth
}

export interface AppState {}

class Header extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="logout" onClick={this.handleLogout}>
          <Button primary>Logout</Button>
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={this.handleLogin}>
          <Button primary>Login</Button>
        </Menu.Item>
      )
    }
  }

  render() {
    return (
      <Menu>
        <Menu.Item>
          <Logo />
        </Menu.Item>
        <Menu.Menu position="right">{this.logInLogOutButton()}</Menu.Menu>
      </Menu>
    )
  }
}

export default Header
