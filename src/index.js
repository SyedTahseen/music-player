import 'normalize.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import Router from './router'
import LoadingScreen from './screens/LoadingScreen'

import services from './services'
import getReduxStore from './redux'

const SHOW_LOADING_SCREEN_IN = 600 // ms

class Root extends React.Component {
  state = { store: null, error: null, loading: true, showLoadingScreen: false }

  componentDidMount() {
    const timeout = setTimeout(() => {
      if (this.state.loading) {
        this.setState({ showLoadingScreen: true })
      }
    }, SHOW_LOADING_SCREEN_IN)
    Promise.all([getReduxStore(), ...services.map(service => service.load())])
      .then(([store]) => {
        clearTimeout(timeout)
        this.setState({ store, loading: false, showLoadingScreen: false })
      })
      .catch(error => {
        this.setState({ error })
      })
  }

  render() {
    const { error, store, loading, showLoadingScreen } = this.state

    if (error) {
      return <div>Error while getting store: {error && error.message}</div>
    }
    if (showLoadingScreen) {
      return <LoadingScreen />
    }
    if (loading) {
      return <div />
    }

    return (
      <Provider store={store}>
        <Router />
      </Provider>
    )
  }
}

ReactDOM.render(<Root />, document.getElementById('root'))
