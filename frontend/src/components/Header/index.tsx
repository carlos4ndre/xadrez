import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Menu } from 'semantic-ui-react'
import Logo from 'components/Logo'
import { AppState } from 'types/state'
import { HeaderProps } from 'types/props'
import { loginUser, logoutUser } from 'actions'

class Header extends Component<HeaderProps, AppState> {

  componentWillMount() {
    this.handleLoginUser = this.handleLoginUser.bind(this)
    this.handleLogoutUser = this.handleLogoutUser.bind(this)
  }

  handleLoginUser() {
    this.props.loginUser()
  }

  handleLogoutUser() {
    this.props.logoutUser()
  }

  logInLogOutButton() {
    if (this.props.user.authenticated) {
      return (
        <Menu.Item name="logout" onClick={this.handleLogoutUser}>
          <Button primary>Logout</Button>
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={this.handleLoginUser}>
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

const mapStateToProps = (originalState: any, originalOwnProps: any) => {
  return (state: any, ownProps: any) => {
    return {
      user: state.user
    }
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  loginUser: () => dispatch(loginUser()),
  logoutUser: () => dispatch(logoutUser())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)
