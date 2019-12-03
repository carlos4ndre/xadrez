import React from 'react'
import ReactDOM from 'react-dom'
import App from 'containers/App'
import store from 'config/store'
import { Provider } from 'react-redux'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import 'semantic-ui-css/semantic.min.css'

toast.configure()

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
