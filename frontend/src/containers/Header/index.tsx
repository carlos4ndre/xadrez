import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Label, Dropdown, Menu } from 'semantic-ui-react'
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

  handleProfileUser() {
  }

  logInLogOutButton() {
    const profileMenuItem = (
      <Label as='a' color='blue' image>
        <img alt='profile' src={this.props.user.profile.picture} />
        {this.props.user.profile.name}
      </Label>
    )

    if (this.props.user.authenticated) {
      return (
        <Menu.Item>
          <Dropdown icon={null} trigger={profileMenuItem}>
            <Dropdown.Menu>
              <Dropdown.Item icon='user' text='Profile' onClick={this.handleProfileUser}/>
              <Dropdown.Item icon='log out' text='Logout' onClick={this.handleLogoutUser}/>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item onClick={this.handleLoginUser}>
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
