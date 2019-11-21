import React from 'react'
import { Switch, BrowserRouter, Route } from 'react-router-dom'
import { Divider } from 'semantic-ui-react'
import Header from 'components/Header'
import Callback from 'components/Callback'
import NotFound from 'components/NotFound'
import HomePage from 'containers/HomePage'

const App = () => (
  <BrowserRouter>
    <div>
      <Header />
      <Divider hidden/>
      <Switch>
        <Route exact path='/' component={HomePage}/>
        <Route exact path='/callback' component={Callback}/>
        <Route component={NotFound}/>
      </Switch>
    </div>
  </BrowserRouter>
)

export default App
