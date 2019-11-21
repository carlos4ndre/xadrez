import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { Dimmer, Loader } from 'semantic-ui-react'
import { loginUserCallback } from 'actions'
import { AppState } from 'types/state'
import { CallbackProps } from 'types/props'

class Callback extends Component<CallbackProps, AppState> {

  render() {
    const { user, loginUserCallback } = this.props
    console.log(user)
    if (user && user.authenticated) {
      return <Redirect to="/" />
    }
    loginUserCallback()

    return (
      <Dimmer active>
        <Loader content='Loading' />
      </Dimmer>
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
  loginUserCallback: () => dispatch(loginUserCallback())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Callback)
