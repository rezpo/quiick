import React, { Component } from 'react'
import Wrapper from '../../components/wrapper/Wrapper'
import Button from '../../components/buttons/Button/Button'
import Icon from '../../components/icons/Icon'
import { faPhoneAlt } from '@fortawesome/free-solid-svg-icons'
import './Contact.scss'

export default class Delivery extends Component {
  render() {
    return (
      <Wrapper>
        <div className="contact">
          <div className="curtain__announce">
            <h2 className="announce-title">¿Te gustaría hablar con nosotros?</h2>
            <p className="announce-paragraph">Si nos visitas desde tu celular solo presiona en "llamar a Meal's Pizza" y nos contactarás de forma inmediata</p>
            <div className="contact-btn">
              <a href="tel:+56920469612">
                <Button isSubject="secondary" isText="Llamar a Meal's Pizza" isIcon={<Icon faIcon={faPhoneAlt} />} />
              </a>
            </div>
          </div>
        </div>
      </Wrapper>
    )
  }
}
