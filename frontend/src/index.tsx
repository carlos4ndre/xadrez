import React from 'react'
import ReactDOM from 'react-dom'
import App from 'containers/App'
import store from 'config/store'
import Auth from 'auth/Auth'
import createHistory from 'history/createBrowserHistory'
import { Provider } from 'react-redux'
import 'semantic-ui-css/semantic.min.css'

const history = createHistory()
const auth = new Auth(history)

ReactDOM.render(
  <Provider store={store}>
    <App auth={auth}/>
  </Provider>,
  document.getElementById('root')
)
