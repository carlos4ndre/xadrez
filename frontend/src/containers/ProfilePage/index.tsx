import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { AppState } from 'types/state'
import { ProfileProps } from 'types/props'
import { Grid, Image, Header, Card, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

class ProfilePage extends Component<ProfileProps, AppState> {
  render() {
    if (!this.props.user.authenticated) {
      return <Redirect to='/' />
    }

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Header as='h1' color='black' textAlign='center'>Profile</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered columns={3}>
          <Grid.Column>
            <Card centered>
              <Image alt='' src={this.props.user.profile.picture} wrapped ui={false} />
              <Card.Content>
                <Card.Header>{this.props.user.profile.name}</Card.Header>
                <Card.Meta>
                  <span className='date'>{this.props.user.profile.nickname}</span>
                </Card.Meta>
                <Card.Description>
                  Playing Chess for fun!
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <Icon name='trophy' />
                Ranking #1
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column textAlign='center'>
            <Link to='/'>Go back to home page</Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
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

const mapDispatchToProps = (dispatch: any) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfilePage)
