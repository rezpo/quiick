import React, { Component } from 'react'
import Button from '../../../components/buttons/Button/Button'
import Icon from '../../../components/icons/Icon'
import { faHamburger } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import './Body.scss'
import Slider from '../Slider/Slider'

export default class Body extends Component {
  render() {
    return (
      <div className="body">
        <div className="body__caption">
          <h1 className="body__caption-title">Todos tus productos en un solo lugar</h1>
          <p className="body__paragraph">
            <strong className="highlight-text">sencillo</strong> y sin <strong className="highlight-text">grandes gastos</strong>.
          </p>
          <div className="body__action">
            <div className="body__action-button">
              <Link to='/order'>
                <Button isSubject="secondary" isText="Realizar pedido" isIcon={<Icon faIcon={faHamburger} />} />
              </Link>
            </div>
          </div>
        </div>
        <div className="body__promo">
          <div className="body__promo-wrapper">
            <div className="body__promo-item">
              <Slider />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
