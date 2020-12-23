import React, { Component } from 'react'
import './Success.scss'

export default class Success extends Component {
  render() {
    return (
      <div className="success">
        <div className="success__wrapper">
          <div className="success-message">Tu orden ha sido creada con éxito, no te preocupes, te informaremos cuando este listo</div>
        </div>
      </div>
    )
  }
}
