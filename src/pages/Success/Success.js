import React, { Component } from 'react'
import './Success.scss'

export default class Success extends Component {
  render() {
    return (
      <div className="success">
        <div className="success__wrapper">
          <div className="success-message">Tu orden ha sido creada con éxito revisa tu WhatsApp para conocer el status de tu pédido</div>
        </div>
      </div>
    )
  }
}
