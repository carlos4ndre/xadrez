import React, { Component } from 'react'
import * as selectors from 'selectors'
import { connect } from 'react-redux'
import { UserState } from 'types/state'
import { getPlayers } from 'actions'
import { AppState } from 'types/state'
import { HomeProps } from 'types/props'
import Players from 'components/Players'

class HomePage extends Component<HomeProps, AppState> {
  componentDidMount() {
    this.props.getPlayers(this.props.user)
  }

  render() {
    return (
      <Players players={this.props.players}/>
    )
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
