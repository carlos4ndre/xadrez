import React from 'react'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { CREATE_GAME_FORM } from 'containers/Forms/names'
import { Player } from 'types/player'
import SelectField from 'containers/Forms/Fields/SelectField'

interface CustomProps {
  player: Player;
}

class CreateGameForm extends React.Component<CustomProps & InjectedFormProps<{}, CustomProps>> {

  render() {
    const { handleSubmit, pristine, reset, submitting, player } = this.props
    const modeOptions = ["standard", "bullet"]

    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label>Opponent: {player ? player.name: "N/A"}</label>
          <label>Game Mode</label>
          <div>
            <Field
              name='mode'
              label='mode'
              options={modeOptions}
              placeholder='- Select -'
              component={SelectField}
            />
          </div>
        </div>
        <div>
          <button type="submit" disabled={pristine || submitting}>
            Submit
          </button>
          <button type="button" disabled={pristine || submitting} onClick={reset}>
            Clear Values
          </button>
        </div>
      </form>
    )
  }
}

export default reduxForm<{}, CustomProps>({
  form: CREATE_GAME_FORM
})(CreateGameForm)
