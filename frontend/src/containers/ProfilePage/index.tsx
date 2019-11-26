import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { AppState } from 'types/state'
import { ProfileProps } from 'types/props'
import { Grid, Image, List, Header, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

class ProfilePage extends Component<ProfileProps, AppState> {
  render() {
    if (!this.props.user.authenticated) {
      return <Redirect to="/" />
    }

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Header as='h1' color='black' textAlign='center'>Profile</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Image
              centered
              rounded
              bordered
              size='medium'
              src={this.props.user.profile.picture}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column textAlign='center'>
            <List>
              <List.Item>
                <Icon name='user' />
                {this.props.user.profile.name}
              </List.Item>
              <List.Item>
                <Icon name='gamepad' />
                {this.props.user.profile.nickname}
              </List.Item>
              <List.Item>
                <Icon name='mail' />
                {this.props.user.profile.email}
              </List.Item>
            </List>
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
