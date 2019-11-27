import React, { Component } from 'react'
import { connect } from 'react-redux'
import Players from 'components/Players'

class HomePage extends Component {
  render() {
    const players = [
      {'name': 'toze', 'nickname': 'tomatos', 'picture': ''},
      {'name': 'batman', 'nickname': 'bruce', 'picture': ''},
      {'name': 'luffy', 'nickname': 'muggywara', 'picture': ''}
    ]

    return (
      <Players players={players}/>
    )
  }
}

const mapStateToProps = (originalState: any, originalOwnProps: any) => {
  return (state: any, ownProps: any) => {
    return {}
  }
}

const mapDispatchToProps = (dispatch: any) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage)
