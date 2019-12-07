import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Divider } from 'semantic-ui-react'
import Header from 'containers/Header'
import Callback from 'containers/Callback'
import HomePage from 'containers/HomePage'
import GamePage from 'containers/GamePage'
import ProfilePage from 'containers/ProfilePage'
import NotFound from 'components/NotFound'

const App = () => (
  <div>
    <Header />
    <Divider hidden/>
    <Switch>
      <Route exact path='/' component={HomePage}/>
      <Route exact path='/profile' component={ProfilePage}/>
      <Route exact path='/game' component={GamePage}/>
      <Route exact path='/callback' component={Callback}/>
      <Route component={NotFound}/>
    </Switch>
  </div>
)

export default App
