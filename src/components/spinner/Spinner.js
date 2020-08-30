import React, { Component } from 'react'
import './Spinner.scss'

export default class Spinner extends Component {
  render() {
    return (
      <div className="spinner">
        <div className="spinner__wrapper">
          <div className="spinner-animation">
            Wait for it...
          </div>
        </div>
      </div>
    )
  }
}
