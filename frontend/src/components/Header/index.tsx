import React, { Component } from 'react'
import { Button, Menu } from 'semantic-ui-react'
import Logo from 'components/Logo'
import { AppState } from 'types/state'
import { HeaderProps as AppProps } from 'types/props'

class Header extends Component<AppProps, AppState> {

  logInLogOutButton() {
    if (this.props.isLoggedIn) {
      return (
        <Menu.Item name="logout" onClick={this.props.onLogout}>
          <Button primary>Logout</Button>
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={this.props.onLogin}>
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
