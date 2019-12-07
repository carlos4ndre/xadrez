import React from 'react'
import { Label } from 'semantic-ui-react'
import { PlayerIconProps } from 'types/props'

const PlayerIcon: React.FunctionComponent<PlayerIconProps> = (props) => (
  <Label as='a' color='blue' image>
    <img alt='' src={props.player.picture}/>
    {props.player.name}
  </Label>
)

export default PlayerIcon
