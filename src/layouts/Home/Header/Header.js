import React, { useState, useContext } from 'react'
import { UserContext } from '../../../components/context/UserContext'
import { ReactComponent as Logo } from '../../../assets/logo.svg'
import { ReactComponent as BurgerIcon } from '../../../assets/icons/burguer-menu.svg'
import Button from '../../../components/buttons/Button/Button'
import Icon from '../../../components/icons/Icon'
import { Link } from 'react-router-dom'
import { faBicycle, faUserAstronaut, faTimes, faDollarSign, } from '@fortawesome/free-solid-svg-icons'
import { faUserCircle, faSmileWink } from '@fortawesome/free-regular-svg-icons'
import './Header.scss'


export default function Header() {

  const { isLogin, user } = useContext(UserContext)
  const [isShown, setIsShown] = useState(false)
  const [mobileMenuStatus, setMobileMenuStatus] = useState('menu--deactive')

  const menuMobileDisplayToggler = () => {
    setIsShown(!isShown)

    if (!isShown) {
      setMobileMenuStatus('menu--active')
    } else {
      setMobileMenuStatus('menu--deactive')
    }
  }

  return (
    <header className="header">
      <Link to="/"><Logo /></Link>
      <div className="header__mobile-menu" onClick={menuMobileDisplayToggler}>{<BurgerIcon />}</div>
      <div className={`header__menu ${mobileMenuStatus}`}>
        <div className="menu__item" onClick={menuMobileDisplayToggler}>
          <Link to="/delivery">
            <Button isSubject='quinary' isText='Precios' isIcon={<Icon faIcon={faDollarSign} />} />
          </Link>
        </div>
        <div className="menu__item" onClick={menuMobileDisplayToggler}>
          <Link to="/">
            <Button isSubject='quinary' isText='¿Quienes somos?' isIcon={<Icon faIcon={faUserAstronaut} />} />
          </Link>
        </div>
        <div className="menu__item" onClick={menuMobileDisplayToggler}>
          <Link to="/delivery">
            <Button isSubject='quinary' isText='¿Como funciona?' isIcon={<Icon faIcon={faBicycle} />} />
          </Link>
        </div>
        <div className="menu__item" onClick={menuMobileDisplayToggler}>
          {isLogin ?
            <Link to={`/${user.user.id}/${user.user.username}/account`}>
              <Button plusClass='user--loggeding' isSubject='quinary' isText={`Hola, ${user.user.username}`} isIcon={<Icon faIcon={faSmileWink} />} />
            </Link>
            :
            <Link to="/login">
              <Button isSubject='quinary' isText='Iniciar sesión' isIcon={<Icon faIcon={faUserCircle} />} />
            </Link>}
        </div>
        <div className="header__menu--close" onClick={menuMobileDisplayToggler}>
          <Button isSubject='quinary' isText='Cerrar' isIcon={<Icon faIcon={faTimes} />} />
        </div>
      </div>
    </header>
  )
}
