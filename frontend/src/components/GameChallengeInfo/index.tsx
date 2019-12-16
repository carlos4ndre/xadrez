import React from 'react'
import { List } from 'semantic-ui-react'
import { GameChallengeInfoProps } from 'types/props'
import PlayerIcon from 'components/PlayerIcon'

function displayTime(timeInSeconds: number) {
    const pad = function(num: number, size: number) { return ('000' + num).slice(size * -1) }
    const minutes = Math.floor(timeInSeconds / 60 % 60)
    const seconds = Math.floor(timeInSeconds - minutes * 60)

    return pad(minutes, 2) + ':' + pad(seconds, 2)
}

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
      <List.Content>{props.game.time === 0 ? 'No time' : displayTime(props.game.time / 1000) }</List.Content>
    </List.Item>
  </List>
)

export default GameChallengeInfo
