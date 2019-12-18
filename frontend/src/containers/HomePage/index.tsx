import React, { Component } from 'react'
import * as selectors from 'selectors'
import { connect } from 'react-redux'
import { Dimmer, Loader, Grid, Header } from 'semantic-ui-react'
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
    if (!this.props.user.authenticated) {
      return <Welcome />
    }

    return (
      <Grid textAlign='center' columns={3}>
        <Grid.Row>
          <Header as='h1'>Players</Header>
        </Grid.Row>
        <Grid.Row>
        {
          this.props.isFetchingPlayers
          ? <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>
          : <Players players={this.props.players}/>
        }
        </Grid.Row>
      </Grid>
    )
  }
}

const mapStateToProps = (originalState: any, originalOwnProps: any) => {
  return (state: any, ownProps: any) => {
    const user = state.user
    const filteredPlayers = selectors.getPlayers(state).filter(player => player.id !== user.profile.sub)

    return {
      user,
      players: filteredPlayers,
      isFetchingPlayers: selectors.isFetchingPlayers(state)
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
