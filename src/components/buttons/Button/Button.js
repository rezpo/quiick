import React, { Component } from 'react'
import './Button.scss'

export default class Button extends Component {

  buttonSubject = isSubject => {
    switch (isSubject) {
      case 'primary':
        return 'button--primary'
      case 'secondary':
        return 'button--secondary'
      case 'tertiary':
        return 'button--tertiary'
      case 'quaternary':
        return 'button--quaternary'
      case 'quinary':
        return 'button--quinary'
      case 'senary':
        return 'button--senary'
      case 'unactive':
        return 'button--unactive'
      default:
        return 'button--primary'
    }
  }
  render() {

    const buttonSubjectStyle = this.buttonSubject(
      this.props.isSubject ? this.props.isSubject : 'button--primary'
    )

    return (
      <button className={`button ${buttonSubjectStyle} ${this.props.plusClass}`} type={this.props.isType}>
        {this.props.isIcon}
        {this.props.isText}
      </button>
    )
  }
}
