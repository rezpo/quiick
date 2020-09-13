import React, { Component } from 'react'
import './Slider.scss'
import Carousel from 'nuka-carousel'
import Button from '../../../components/buttons/Button/Button'
import Icon from '../../../components/icons/Icon'
import { Link } from 'react-router-dom'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import NumberFormat from 'react-number-format'
export default class Slider extends Component {
	constructor(props) {
		super(props)
		this.state = {
			promos: [
				{
					photo: require('../../../assets/slyder/slide_01.png'),
					title: 'Oferta de la casa',
					price: 13990,
					isPromo: false,
				},
			],
		}
	}
	render() {
		const { promos } = this.state

		return (
			<Carousel
				dragging={true}
				cellSpacing={10}
				slidesToShow={1}
				slidesToScroll={1}
				cellAlign='center'
				withoutControls={true}
				slideWidth={1}
				heightMode={'max'}
			>
				{promos.map((promo, index) => {
					return (
						<div key={index} className='promo__carousel-wrapper'>
							<div className='promo__carousel-pic'>
								<img src={promo.photo} alt={promo.title} />
							</div>
							<div className='promo__carousel-info'>
								{promo.isPromo ? (
									<div className='promo__carousel-is-promo'>Promo</div>
								) : (
									''
								)}
								<h2 className='promo__carousel-title'>{promo.title}</h2>
								<div className='promo__carousel-action'>
									<div className='promo__carousel-price'>
										<NumberFormat
											value={promo.price}
											displayType={'text'}
											thousandSeparator={'.'}
											prefix={'$'}
											decimalSeparator={','}
										/>
									</div>
									<div className='promo__carousel-viewer'>
										<Link to='/order'>
											<Button
												isSubject='quaternary'
												isText='Ver todo'
												isIcon={<Icon faIcon={faEye} />}
											/>
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
