import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Comment, Header, Input, InputOnChangeData } from 'semantic-ui-react'
import { ChatRoomState } from 'types/state'
import { ChatRoomProps } from 'types/props'

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
      console.log(this.state.text)
      this.setState({text: ''})
    }
  }

  render() {
    return (
      <Comment.Group>
        <Header as='h3' dividing>
          Chat
        </Header>

        <Comment>
          <Comment.Avatar src='/images/avatar/small/matt.jpg' />
          <Comment.Content>
            <Comment.Author as='a'>Matt</Comment.Author>
            <Comment.Metadata>
              <div>Today at 5:42PM</div>
            </Comment.Metadata>
            <Comment.Text>How artistic!</Comment.Text>
          </Comment.Content>
        </Comment>

        <Comment>
          <Comment.Avatar src='/images/avatar/small/joe.jpg' />
          <Comment.Content>
            <Comment.Author as='a'>Joe Henderson</Comment.Author>
            <Comment.Metadata>
              <div>5 days ago</div>
            </Comment.Metadata>
            <Comment.Text>Dude, this is awesome. Thanks so much</Comment.Text>
          </Comment.Content>
        </Comment>

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
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatRoom)
