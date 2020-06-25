import React, { Component } from 'react'
import './Slider.scss'
import { Carousel } from "react-responsive-carousel"
import Button from '../../../components/buttons/Button/Button'
import Icon from '../../../components/icons/Icon'
import { Link } from 'react-router-dom'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import NumberFormat from 'react-number-format'
export default class Slider extends Component {

  constructor(props) {
    super(props);
    this.state = {
      promos: [
        {
          photo: 'https://www.dropbox.com/s/7n3mr55ifpgxll2/sample-01.png?raw=1',
          title: 'Oferta de la casa',
          price: 13990,
          isPromo: false
        },
      ]
    }
  }
  render() {
    const { promos } = this.state
    const promoLabel = <div className="promo__carousel-is-promo">Promo</div>

    return (
      <Carousel autoPlay showArrows={false} showThumbs={false} showStatus={false} infiniteLoop={true} swipeable={true}>
        {promos.map(promo => {
          return (
            <div className="promo__carousel-wrapper">
              <div className="promo__carousel-pic">
                <img src={promo.photo} alt={promo.title} />
              </div>
              <div className="promo__carousel-info">
                {promo.isPromo ? promoLabel : ''}
                <h2 className="promo__carousel-title">{promo.title}</h2>
                <div className="promo__carousel-action">
                  <div className="promo__carousel-price">
                    <NumberFormat value={promo.price} displayType={'text'} thousandSeparator={'.'} prefix={'$'} decimalSeparator={','} />
                  </div>
                  <div className="promo__carousel-viewer">
                    <Link to="/order">
                      <Button isSubject='quaternary' isText='Ver todo' isIcon={<Icon faIcon={faEye} />} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </Carousel>
    )
  }
}
