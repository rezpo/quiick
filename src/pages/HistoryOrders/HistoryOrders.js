import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../components/context/UserContext'
import axios from 'axios'
import './HistoryOrders.scss'

export default function HistoryOrders() {

  const [rawHistoryOrders, setRawHistoryOrders] = useState([])
  const [historyOrders, setHistoryOrders] = useState([])
  const { userToken, user } = useContext(UserContext)

  useEffect(() => {
    getHistoryOrders()
    cleanHistory()
  }, [rawHistoryOrders])


  const getHistoryOrders = async () => {
    await
      axios
        .get(process.env.NODE_ENV !== 'production' ? '/historial-de-ordenes' : 'https://quiick-281820.rj.r.appspot.com/historial-de-ordenes', {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        })
        .then((res) => {
          setRawHistoryOrders(res.data)
        })
  }

  const cleanHistory = () => {
    const allHistory = [...rawHistoryOrders]
    let allMatchHistory = []

    allHistory.map(item => {
      user.user.restaurantes.forEach(local => {
        item.owner.forEach(owner => {
          if(owner.restaurant === local.slug) {
            allMatchHistory.push(item)
          }
        })
      })
    })

    setHistoryOrders(allMatchHistory)
  }

  return (
    <div className="history__wrapper">
      {historyOrders.map((item, index) => {
        return (
          <div key={item.id} className="history-order__wrapper">
            <div className="history-order-id">{index + 1}</div>
            <div className="history-order-detail" key={item.id}>
              {
                item.order.map((order, index) => {
                  return (
                    <div key={index} className="item-ordered">{order.titulo} <small className="item-sku">sku {order.sku}</small></div>
                  )
                })
              }
            </div>
            {
              item.owner.map(owner => {
                return (
                  <div className="history-order-owner" key={owner.contact}>
                    <div className="history-order-owner-name">{owner.name}</div>
                    <div className="history-order-owner-contact">{owner.contact}</div>
                    <div className="history-order-owner-date">{owner.orderDate}</div>
                  </div>
                )
              })
            }
          </div>
        )
      })}
    </div>
  )
}
