import React from 'react'
import { connect } from 'react-redux'
import { reduxForm, InjectedFormProps, getFormSubmitErrors } from 'redux-form'
import { Header, Button, Divider, Modal } from 'semantic-ui-react'
import { LEAVE_GAME_FORM } from 'containers/Forms/names'
import { leaveGame } from 'actions'
import { Game } from 'types/game'
import SubmitErrorMessage from 'containers/Forms/SubmitErrorMessage'
import { LeaveGameFormProps } from 'types/props'
import { toast } from 'react-toastify'

class LeaveGameForm extends React.Component<LeaveGameFormProps & InjectedFormProps<{}, LeaveGameFormProps>> {

  state = {
    modalOpen: false
  }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => {
    this.setState({ modalOpen: false })
    this.props.reset()
  }

  submit = (values: any) => {
    const { game } = this.props
    this.props.leaveGame(game)
    toast.success('Leave game sent!')
    this.setState({ modalOpen: false })
  }

  render() {
    const { submitting, handleSubmit, submitErrors } = this.props

    return (
      <Modal
        trigger={this.props.children}
        dimmer='blurring'
        size='tiny'
        open={this.state.modalOpen}
        onOpen={this.handleOpen}
        onClose={this.handleClose}
        closeOnEscape={false}>
        <Header icon='chess' content='Create new game' />
        <Modal.Content image>
          <Modal.Description>
            <form onSubmit={handleSubmit(this.submit.bind(this))}>
              <Header as='h2'>Would you like to leave the game?</Header>
              <SubmitErrorMessage submitErrors={submitErrors}/>
              <Divider horizontal/>
              <Button.Group>
                <Button negative disabled={submitting}>Yes</Button>
                  <Button.Or />
                <Button disabled={submitting} onClick={this.handleClose}>No</Button>
              </Button.Group>
            </form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    )
  }
}

const mapStateToProps = (originalState: any, originalOwnProps: any) => {
  return (state: any, ownProps: any) => {
    return {
      user: state.user,
      submitErrors: getFormSubmitErrors(LEAVE_GAME_FORM)(state)
    }
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  leaveGame: (game: Game) => dispatch(leaveGame(game))
})

const formConfiguration = {
  form: LEAVE_GAME_FORM
}

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm<{}, LeaveGameFormProps>(formConfiguration)(LeaveGameForm)
)
