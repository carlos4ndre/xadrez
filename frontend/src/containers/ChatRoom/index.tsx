import React, { Component } from 'react'
import { connect } from 'react-redux'
import { sendMessage } from 'actions'
import { Container, Comment, Header, Input, InputOnChangeData } from 'semantic-ui-react'
import { ChatRoomState } from 'types/state'
import { ChatRoomProps } from 'types/props'
import { Game } from 'types/game'
import { getChatRoom } from 'selectors/chatrooms'


class ChatRoom extends Component<ChatRoomProps, ChatRoomState> {
  chatRoomRef = React.createRef<HTMLDivElement>()

  constructor(props: ChatRoomProps) {
    super(props)
    this.state = {text: ''}

    this.handleChange = this.handleChange.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  componentDidUpdate() {
    if (this.chatRoomRef.current) {
      this.chatRoomRef.current.scrollIntoView({behavior: 'smooth'})
    }
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
    const { messages } = this.props

    return (
      <Container>
        <div ref={this.chatRoomRef} style={{overflow: 'auto', maxHeight: '350px'}}>
        <Comment.Group>
          <Header as='h3' dividing>
            Chat
          </Header>
          {
            messages.map(message => (
              <Comment>
                <Comment.Avatar src={message.author.picture} />
                <Comment.Content>
                  <Comment.Author as='a'>{message.author.name}</Comment.Author>
                  <Comment.Metadata>
                    <div>{message.created_at}</div>
                  </Comment.Metadata>
                  <Comment.Text>{message.text}</Comment.Text>
                </Comment.Content>
              </Comment>
            ))
          }
        </Comment.Group>
        </div>
        <Input
          icon='paper plane'
          placeholder='Write something...'
          value={this.state.text}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
        />
      </Container>

    )
  }
}

const mapStateToProps = (originalState: any, originalOwnProps: any) => {
  return (state: any, ownProps: any) => {
    const chatRoom = getChatRoom(state, ownProps.game.id)
    const messages = (chatRoom && chatRoom.messages) || []
    return {
      messages
    }
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  sendMessage: (text: string, game: Game) => dispatch(sendMessage(text, game))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatRoom)
