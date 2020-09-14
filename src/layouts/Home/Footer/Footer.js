import React, { Component } from 'react'
import './Footer.scss'
import Icon from '../../../components/icons/Icon'
import { Link } from 'react-router-dom'
import { faPhone } from '@fortawesome/free-regular-svg-icons'
import { ReactComponent as Minilogo } from '../../../assets/mini-logo.svg'

export default class Footer extends Component {
  render() {
    return (
      <div className='footer'>
        <div className='footer__info'>
          <div className='address'>
            <Minilogo className='minilogo' />
            <div className="name">
              <strong>Quiick</strong>
              <span>App</span>
            </div>
          </div>
          <Link to='/contact' className='call'>
            <span>Contáctanos</span>
          </Link>
        </div>
      </div>
    )
  }
}
