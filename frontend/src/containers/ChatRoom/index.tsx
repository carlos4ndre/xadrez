import React, { Component } from 'react'
import { connect } from 'react-redux'
import { sendMessage } from 'actions'
import { Comment, Header, Input, InputOnChangeData } from 'semantic-ui-react'
import { ChatRoomState } from 'types/state'
import { ChatRoomProps } from 'types/props'
import { Game } from 'types/game'

class ChatRoom extends Component<ChatRoomProps, ChatRoomState> {

  constructor(props: ChatRoomProps) {
    super(props)
    this.state = {text: ''}

    this.handleChange = this.handleChange.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
    this.setState({text: data.value})
  }

  handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if(e.key === 'Enter' && this.state.text !== ''){
      this.props.sendMessage(this.state.text, this.props.game)
      this.setState({text: ''})
    }
  }

  render() {
    const comments = [
      {
        "id": "12345",
        "game_id": "123",
        "author": {
          "id": "3234",
          "name": "john",
          "picture": "http://something",
        },
        "text": "Great game!",
        "created_at": "2019-01-01"
      }
    ]

    return (
      <Comment.Group>
        <Header as='h3' dividing>
          Chat
        </Header>
        {
          comments.map(comment => (
            <Comment>
              <Comment.Avatar src={comment.author.picture} />
              <Comment.Content>
                <Comment.Author as='a'>{comment.author.name}</Comment.Author>
                <Comment.Metadata>
                  <div>{comment.created_at}</div>
                </Comment.Metadata>
                <Comment.Text>{comment.text}</Comment.Text>
              </Comment.Content>
            </Comment>
          ))
        }
        <Input
          icon='paper plane'
          placeholder='Write something...'
          value={this.state.text}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
        />
      </Comment.Group>
    )
  }
}

const mapStateToProps = (originalState: any, originalOwnProps: any) => {
  return (state: any, ownProps: any) => {
    return {}
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  sendMessage: (text: string, game: Game) => dispatch(sendMessage(text, game))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatRoom)
