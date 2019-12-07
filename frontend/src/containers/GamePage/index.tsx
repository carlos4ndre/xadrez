import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AppState } from 'types/state'
import { GameProps } from 'types/props'
import { Grid, Header, Container, List } from 'semantic-ui-react'
import ChessBoard from 'containers/ChessBoard'

class GamePage extends Component<any, any> {
  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Header as='h1' color='black' textAlign='center'>Game</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered columns={3}>
          <Grid.Column>
            <Header as='h2'>Chat Room</Header>
            <Container text>
              <List>
              </List>
            </Container>
          </Grid.Column>
          <Grid.Column>
            <ChessBoard />
          </Grid.Column>
          <Grid.Column>
            <Header as='h2'>Black</Header>
            <Header as='h2'>White</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered columns={3}>
        </Grid.Row>
      </Grid>
    )
  }
}

const mapStateToProps = (originalState: any, originalOwnProps: any) => ({})

const mapDispatchToProps = (dispatch: any) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GamePage)
