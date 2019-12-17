import React from 'react'
import { Label } from 'semantic-ui-react'
import { TimerProps } from 'types/props'
import Countdown, { zeroPad } from 'react-countdown-now'


const renderer = ({ minutes, seconds, completed }: any) => {
  const color = (minutes === 0 && seconds < 30 ? 'red' : 'green')
  return (
    <Label circular color={color}>
      {zeroPad(minutes, 2)}:{zeroPad(seconds, 2)}
    </Label>
  )
}


const Timer: React.FunctionComponent<TimerProps> = (props) => {
  return (
    <Countdown
      key={Date.now() + props.time}
      date={Date.now() + props.time}
      intervalDelay={0}
      precision={3}
      renderer={renderer}
      autoStart={props.autoStart}
    />
  )
}

export default Timer
