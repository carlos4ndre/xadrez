import React, { Component } from 'react'
import { connect } from 'react-redux'

class HomePage extends Component {
  render() {
    return (
      <div>Home Page</div>
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
