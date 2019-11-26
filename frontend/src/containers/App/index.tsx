import React from 'react'
import { Switch, BrowserRouter, Route } from 'react-router-dom'
import { Divider } from 'semantic-ui-react'
import Header from 'containers/Header'
import Callback from 'containers/Callback'
import HomePage from 'containers/HomePage'
import ProfilePage from 'containers/ProfilePage'
import NotFound from 'components/NotFound'

const App = () => (
  <BrowserRouter>
    <div>
      <Header />
      <Divider hidden/>
      <Switch>
        <Route exact path='/' component={HomePage}/>
        <Route exact path='/profile' component={ProfilePage}/>
        <Route exact path='/callback' component={Callback}/>
        <Route component={NotFound}/>
      </Switch>
    </div>
  </BrowserRouter>
)

export default App
