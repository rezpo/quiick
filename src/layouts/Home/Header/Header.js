import React, { Component } from 'react'
import { ReactComponent as Logo } from '../../../assets/logo.svg'
import { ReactComponent as BurgerIcon } from '../../../assets/icons/burguer-menu.svg'
import Button from '../../../components/buttons/Button/Button'
import Icon from '../../../components/icons/Icon'
import { Link } from 'react-router-dom'
import { faBicycle, faUserAstronaut, faTimes, faDollarSign } from '@fortawesome/free-solid-svg-icons'
import './Header.scss'
import { faUserCircle } from '@fortawesome/free-regular-svg-icons'

export default class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isShown: false,
      mobileMenuStatus: 'menu--deactive'
    }
  }

  menuMobileDisplayToggler = () => {
    this.setState({
      isShown: !this.state.isShown
    })

    if (!this.state.isShown) {
      this.setState({
        mobileMenuStatus: 'menu--active'
      })
    } else {
      this.setState({
        mobileMenuStatus: 'menu--deactive'
      })
    }
  }

  render() {
    const { mobileMenuStatus } = this.state

    return (
      <div className="header">
        <Link to="/"><Logo /></Link>
        <div className="header__mobile-menu" onClick={this.menuMobileDisplayToggler}>{<BurgerIcon />}</div>
        <div className={`header__menu ${mobileMenuStatus}`}>
          <div className="menu__item">
            <Link to="/delivery">
              <Button isSubject='quinary' isText='Precios' isIcon={<Icon faIcon={faDollarSign} />} />
            </Link>
          </div>
          <div className="menu__item">
            <Link to="/">
              <Button isSubject='quinary' isText='¿Quienes somos?' isIcon={<Icon faIcon={faUserAstronaut} />} />
            </Link>
          </div>
          <div className="menu__item">
            <Link to="/delivery">
              <Button isSubject='quinary' isText='¿Como funciona?' isIcon={<Icon faIcon={faBicycle} />} />
            </Link>
          </div>
          <div className="menu__item">
            <Link to="/login">
              <Button isSubject='quinary' isText='Iniciar sesión' isIcon={<Icon faIcon={faUserCircle} />} />
            </Link>
          </div>
          <div className="header__menu--close" onClick={this.menuMobileDisplayToggler}>
            <Button isSubject='quinary' isText='Cerrar' isIcon={<Icon faIcon={faTimes} />} />
          </div>
        </div>
      </div>
    )
  }
}
