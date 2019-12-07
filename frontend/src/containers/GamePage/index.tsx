import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AppState } from 'types/state'
import { GameProps } from 'types/props'

class GamePage extends Component<GameProps, AppState> {
  render() {
    return (
      <div>Game Page</div>
    )
  }
}

const mapStateToProps = (originalState: any, originalOwnProps: any) => ({})

const mapDispatchToProps = (dispatch: any) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GamePage)
