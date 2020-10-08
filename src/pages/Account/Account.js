import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../components/context/UserContext'
import PendingOrders from '../../pages/PendingOrders/PendingOrders'
import HistoryOrder from '../../pages/HistoryOrders/HistoryOrders'
import ProductList from '../../pages/Products/ProductsList/ProductsList'
import ProductsAdd from '../../pages/Products/ProductsAdd/ProductsAdd'
import Icon from '../../components/icons/Icon'
import { ReactComponent as Activemenu } from '../../assets/icons/active.svg'
import { ReactComponent as Deactivemenu } from '../../assets/icons/deactive.svg'
import { faClock, faBookmark, faEdit } from '@fortawesome/free-regular-svg-icons'
import axios from 'axios'
import './Account.scss'
import { faPizzaSlice } from '@fortawesome/free-solid-svg-icons'
export default function Account() {

  const [restaurants, setRestaurants] = useState([])
  const [selectedSection, setSelectedSection] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const { userToken, user } = useContext(UserContext)
  const pendingOrders = <PendingOrders />
  const historyOrder = <HistoryOrder />
  const products = <ProductList />
  const newProducts = <ProductsAdd />
  const viewSection = [
    {
      name: 'pending-orders',
      component: pendingOrders
    },
    {
      name: 'history-orders',
      component: historyOrder
    },
    {
      name: 'edit-products',
      component: products
    },
    {
      name: 'add-products',
      component: newProducts
    },
  ]

  useEffect(() => {

    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    const getUserAccount = async () => {
      await
        axios
          .get(process.env.NODE_ENV !== 'production' ? `/restaurantes` : 'https://quiick-281820.rj.r.appspot.com/restaurantes', {
            headers: {
              Authorization: `Bearer ${userToken}`
            },
            cancelToken: source.token
          })
          .then(res => {
            setRestaurants(user.user.restaurantes)
          })
          .catch(err => {
            console.log(err.Error)
          })
    }

    getUserAccount()

    return () => {
      source.cancel()
    }
  }, [restaurants, userToken, user])

  const viewSelectedSection = (e) => {
    viewSection.forEach(item => {
      if (e.target.id === item.name) {
        setSelectedSection(item.component)
        displayMenu()
      }
    })
  }

  const displayMenu = () => {
    setShowMenu(!showMenu)
  }

  return (
    <div className="account__wrapper">
      <div className={`account__menu-wrapper ${showMenu ? 'show-user-menu' : ''}`}>
        <div className="account__menu-user">
          <div className="account-user">
            <strong className="account-username">Hola {user.user.username},</strong>
            <span className="account-user-message">Aquí un resumen de tus ordenes</span>
          </div>
          <div className="account-view-menu" onClick={displayMenu}>
            {showMenu ? <Activemenu /> : <Deactivemenu />}
          </div>
        </div>
        <ul className="account__menu-items">
          <li className="account-menu-item" id="pending-orders" onClick={viewSelectedSection}><Icon faIcon={faClock} /><span>Ordenes pendientes</span></li>
          <li className="account-menu-item" id="history-orders" onClick={viewSelectedSection}><Icon faIcon={faBookmark} /><span>Historial de ordenes</span></li>
          <li className="account-menu-item" id="edit-products" onClick={viewSelectedSection}><Icon faIcon={faEdit} /><span>Mis productos</span></li>
          <li className="account-menu-item" id="add-products" onClick={viewSelectedSection}><Icon faIcon={faPizzaSlice} /><span>Añadir productos</span></li>
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
        {selectedSection}
      </div>
    </div>
  )
}
