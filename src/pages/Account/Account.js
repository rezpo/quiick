import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../components/context/UserContext'
import PendingOrders from '../../pages/PendingOrders/PendingOrders'
import HistoryOrder from '../../pages/HistoryOrders/HistoryOrders'
import Icon from '../../components/icons/Icon'
import { faClock, faBookmark } from '@fortawesome/free-regular-svg-icons'
import axios from 'axios'
import './Account.scss'

export default function Account() {

  const [restaurants, setRestaurants] = useState([])
  const [viewPending, setViewPending] = useState(false)
  const [viewHistory, setViewHistory] = useState(false)
  const { userToken, user } = useContext(UserContext)

  useEffect(() => {
    getUserAccount()
  }, [restaurants])
  const getUserAccount = async () => {
    await
      axios
        .get(process.env.NODE_ENV !== 'production' ? `/restaurantes` : 'https://quiick-281820.rj.r.appspot.com/restaurantes', {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        })
        .then(res => {
          setRestaurants(user.user.restaurantes)
        })
        .catch(err => {
          console.log(err.Error)
        })
  }

  const viewPendingOrders = () => {
    setViewPending(true)
    setViewHistory(false)
  }

  const viewHistoryOrders = () => {
    setViewHistory(true)
    setViewPending(false)
  }

  return (
    <div className="account__wrapper">
      <div className="account__menu-wrapper">
        <strong className="account-username">Hola {user.user.username},</strong>
        <span className="account-user-message">Aquí un resumen de tus ordenes</span>
        <ul className="account__menu-items">
          <li className="account-menu-item" onClick={viewPendingOrders}><Icon faIcon={faClock} /><span>Ordenes pendientes</span></li>
          <li className="account-menu-item" onClick={viewHistoryOrders}><Icon faIcon={faBookmark} /><span>Historial de ordenes</span></li>
          <div className="account__restaurants-wrapper">
            <strong>Tus Locales</strong>
            <div className="account__restaurants-list">
              {restaurants.map(restaurant => {
                return (
                  <div key={restaurant.id} className="account-restaurant">
                    <div className="restaurant-name">{restaurant.name}</div>
                    <div className="restaurant-address">{restaurant.address}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </ul>
      </div>
      <div className="account__info-wrapper">
        {viewPending && <PendingOrders />}
        {viewHistory && <HistoryOrder />}
      </div>
    </div>
  )
}
