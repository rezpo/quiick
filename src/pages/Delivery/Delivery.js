import React, { Component } from 'react'
import Wrapper from '../../components/wrapper/Wrapper'
import Button from '../../components/buttons/Button/Button'
import Icon from '../../components/icons/Icon'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import './Delivery.scss'

export default class Delivery extends Component {
  render() {
    return (
      <Wrapper>
        <div className="delivery">
          <div className="curtain__announce">
            <h2 className="announce-title">¿Quieres saber el estado de tu pedido?</h2>
            <p className="announce-paragraph">Para conocer el status de tu pedido o cualquier otra consulta puedes comunicarte con nosotros a través de nuestro WhatsApp</p>
            <div className="delivery-contact">
              <a href="https://wa.me/56920469612">
                <Button isSubject="secondary" isText="Hablemos por WhatsApp" isIcon={<Icon faIcon={faWhatsapp} />} />
              </a>
            </div>
          </div>
        </div>
      </Wrapper>
    )
  }
}
