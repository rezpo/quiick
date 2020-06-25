import React, { Component } from 'react'
import { ReactComponent as Logo } from '../../../assets/logo.svg'
import Button from '../../../components/buttons/Button/Button'
import Icon from '../../../components/icons/Icon'
import { Link } from 'react-router-dom'
import { faBicycle, faUserAstronaut } from '@fortawesome/free-solid-svg-icons'
import './Header.scss'

export default class Header extends Component {
  render() {
    return (
      <div className="header">
        <Link to="/"><Logo /></Link>
        <div className="header__menu">
          <div className="menu__item">
            <Link to="/">
              <Button isSubject='quinary' isText='Nuestra tienda' isIcon={<Icon faIcon={faUserAstronaut} />} />
            </Link>
          </div>
          <div className="menu__item">
            <Link to="/delivery">
              <Button isSubject='quinary' isText='Delivery' isIcon={<Icon faIcon={faBicycle} />} />
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
