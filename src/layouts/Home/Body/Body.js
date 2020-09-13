import React from 'react'
import Button from '../../../components/buttons/Button/Button'
import Icon from '../../../components/icons/Icon'
import { faHamburger } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import './Body.scss'
import Slider from '../Slider/Slider'

const Body = () => {
  return (
    <div className='body'>
      <div className='body__caption'>
        <h1 className='body__caption-title'>Realiza pedidos sin contacto</h1>
        <p className='body__paragraph'><strong className='highlight-text'>Rapido</strong> y cuidando la salud de tus {' '}<strong className='highlight-text'>clientes y empleados</strong></p>
        <div className='body__action'>
          <div className='body__action-button'>
            <Link to='/quiickcafe/1/order'>
              <Button
                isSubject='secondary'
                isText='Hacer una prueba'
                isIcon={<Icon faIcon={faHamburger} />}
              />
            </Link>
          </div>
        </div>
      </div>
      <div className='body__promo'>
        <div className='body__promo-wrapper'>
          <div className='body__promo-item'>
            <Slider />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Body;
