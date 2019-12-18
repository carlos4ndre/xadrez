import React from 'react'
import ReactDOM from 'react-dom'
import App from 'containers/App'
import store, { history } from 'config/store'
import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'semantic-ui-css/semantic.min.css'
import 'emoji-mart/css/emoji-mart.css'

toast.configure()

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)
