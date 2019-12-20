import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, InjectedFormProps, getFormSubmitErrors } from 'redux-form'
import { Header, Button, Divider, Modal } from 'semantic-ui-react'
import { CREATE_GAME_FORM } from 'containers/Forms/names'
import { createGame } from 'actions'
import { Player } from 'types/player'
import { UserState } from 'types/state'
import { GameOptions } from 'types/game'
import { required } from 'containers/Forms/Fields/validators'
import SubmitErrorMessage from 'containers/Forms/SubmitErrorMessage'
import SelectField from 'containers/Forms/Fields/SelectField'
import { CreateGameFormProps } from 'types/props'
import PlayerIcon from 'components/PlayerIcon'
import { toast } from 'react-toastify'

class CreateGameForm extends React.Component<CreateGameFormProps & InjectedFormProps<{}, CreateGameFormProps>> {

  state = {
    modalOpen: false
  }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => {
    this.setState({ modalOpen: false })
    this.props.reset()
  }

  submit = (values: any) => {
    const { user, player } = this.props
    const gameOptions = {
      mode: values.mode,
      time: values.time,
      color: values.color
    }
    this.props.createGame(user, player, gameOptions)
    toast.success('Create game sent!')
    this.setState({ modalOpen: false })
  }

  render() {
    const { player, submitting, handleSubmit, submitErrors } = this.props
    const gameModeOptions = [
      {'key': 'standard', 'text': 'standard', 'value': 'standard'}
    ]
    const gameTimeOptions = [
      {'key': 'notime', 'text': 'No Time', 'value': '0'},
      {'key': '1m', 'text': '1 minute', 'value': '60'},
      {'key': '5m', 'text': '5 minutes', 'value': '300'},
      {'key': '10m', 'text': '10 minutes', 'value': '600'}
    ]
    const gameColorOptions = [
      {'key': 'white', 'text': 'white', 'value': 'White'},
      {'key': 'Black', 'text': 'black', 'value': 'Black'},
      {'key': 'random', 'text': 'random', 'value': 'Random'}
    ]

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
              <Header as='h2'>Opponent</Header>
              <PlayerIcon player={player} />
              <Header as='h2'>Mode</Header>
              <Field
                name='mode'
                options={gameModeOptions}
                placeholder='- Select -'
                component={SelectField}
                validate={[required]}
              />

              <Header as='h2'>Time</Header>
              <Field
                name='time'
                options={gameTimeOptions}
                placeholder='- Select -'
                component={SelectField}
                validate={[required]}
              />

              <Header as='h2'>Color</Header>
              <Field
                name='color'
                options={gameColorOptions}
                placeholder=''
                component={SelectField}
                validate={[required]}
              />

              <SubmitErrorMessage submitErrors={submitErrors}/>
              <Divider horizontal/>
              <Button.Group>
                <Button positive disabled={submitting}>Start Game!</Button>
                  <Button.Or />
                <Button disabled={submitting} onClick={this.handleClose}>Next Time</Button>
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
      submitErrors: getFormSubmitErrors(CREATE_GAME_FORM)(state)
    }
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  createGame: (user: UserState, challengee: Player, gameOptions: GameOptions) => dispatch(createGame(user, challengee, gameOptions))
})

const formConfiguration = {
  form: CREATE_GAME_FORM
}

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm<{}, CreateGameFormProps>(formConfiguration)(CreateGameForm)
)
