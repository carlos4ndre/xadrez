import React, { Component } from 'react'
import * as selectors from 'selectors'
import { connect } from 'react-redux'
import { UserState } from 'types/state'
import { getPlayers } from 'actions'
import { AppState } from 'types/state'
import { HomeProps } from 'types/props'
import Players from 'components/Players'
import Welcome from 'components/Welcome'

class HomePage extends Component<HomeProps, AppState> {
  componentDidMount() {
    this.props.getPlayers(this.props.user)
  }

  render() {
    let content
    if (!this.props.user.authenticated) {
      content = <Welcome />
    } else {
      content = <Players players={this.props.players}/>
    }

    return content
  }
}

const mapStateToProps = (originalState: any, originalOwnProps: any) => {
  return (state: any, ownProps: any) => {
    return {
      user: state.user,
      players: selectors.getPlayers(state)
    }
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  getPlayers: (user: UserState) => dispatch(getPlayers(user))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage)
