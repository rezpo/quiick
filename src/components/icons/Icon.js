import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Icon.scss'

export default class Icon extends Component {
  render() {
    return (
      <div className="icon">
        <FontAwesomeIcon icon={this.props.faIcon} />
      </div>
    )
  }
}
