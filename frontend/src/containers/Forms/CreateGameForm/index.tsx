import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, InjectedFormProps, getFormSubmitErrors } from 'redux-form'
import { Header, Label, Button, Divider, Modal } from 'semantic-ui-react'
import { CREATE_GAME_FORM } from 'containers/Forms/names'
import { Player } from 'types/player'
import { required } from 'containers/Forms/Fields/validators'
import SubmitErrorMessage from 'containers/Forms/SubmitErrorMessage'
import SelectField from 'containers/Forms/Fields/SelectField'

interface CustomProps {
  player: Player,
  submitErrors: object,
  children: object
}

class CreateGameForm extends React.Component<CustomProps & InjectedFormProps<{}, CustomProps>> {

  state = {
    modalOpen: false
  }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => {
    this.setState({ modalOpen: false })
    this.props.reset()
  }

  submit = (values: object) => {
    this.setState({ modalOpen: false })
  }

  render() {
    const { player, submitting, handleSubmit, submitErrors } = this.props
    const gameModeOptions = [
      {'key': 'standard', 'text': 'standard', 'value': 'standard'}
    ]
    const gameTimeOptions = [
      {'key': 'notime', 'text': 'notime', 'value': 'No Time'},
      {'key': '5m', 'text': '5m', 'value': '5 minutes'},
      {'key': '10m', 'text': '10m', 'value': '10 minutes'}
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
        closeOnEscape={false}
        closeOnRootNodeClick={false}>
        <Header icon='chess' content='Create new game' />
        <Modal.Content image>
          <Modal.Description>
            <form onSubmit={handleSubmit(this.submit.bind(this))}>
              <Header as='h2'>Opponent</Header>
              <Label as='a' image>
                <img alt='' src={player.picture}/>
                {player.name}
              </Label>

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

const mapStateToProps = (state: any) => ({
  submitErrors: getFormSubmitErrors(CREATE_GAME_FORM)(state)
})
const mapDispatchToProps = (dispatch: object) => ({})

const formConfiguration = {
  form: CREATE_GAME_FORM
}

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm<{}, CustomProps>(formConfiguration)(CreateGameForm)
)
