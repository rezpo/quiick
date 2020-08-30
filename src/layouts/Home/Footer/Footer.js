import React, { Component } from 'react'
import './Footer.scss'
import Icon from '../../../components/icons/Icon'
import { Link } from 'react-router-dom'
import { faPhoneAlt, faHatWizard } from '@fortawesome/free-solid-svg-icons'

export default class Footer extends Component {
	render() {
		return (
			<div className='footer'>
				<div className='footer__info'>
					<div className='address'>
						<Icon faIcon={faHatWizard} />
						<strong>Quiick</strong>
						<span>template</span>
					</div>
					<Link to='/contact' className='call'>
						<Icon faIcon={faPhoneAlt} />
						<span>Contáctanos</span>
					</Link>
				</div>
			</div>
		)
	}
}
