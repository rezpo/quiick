import React, { Component } from 'react'
import spin from '../../assets/spinner.gif'
import './Spinner.scss'

export default class Spinner extends Component {
  render() {
    return (
      <div className="spinner">
        <div className="spinner__wrapper">
          <div className="spinner-animation">
            <img src={spin} alt="Wait for it"/>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}
