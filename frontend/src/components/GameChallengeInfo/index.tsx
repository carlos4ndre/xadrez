import React from 'react'
import { List } from 'semantic-ui-react'
import { GameChallengeInfoProps } from 'types/props'
import PlayerIcon from 'components/PlayerIcon'

const GameChallengeInfo: React.FunctionComponent<GameChallengeInfoProps> = (props) => (
  <List>
    <List.Item>
      <PlayerIcon player={props.player} />
    </List.Item>
    <List.Item>
      <List.Icon name='chess' />
      <List.Content>{props.game.mode}</List.Content>
    </List.Item>
    <List.Item>
      <List.Icon name='clock outline' />
      <List.Content>{props.game.time === 0 ? 'No time' : props.game.time}</List.Content>
    </List.Item>
  </List>
)

export default GameChallengeInfo
