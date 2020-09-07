import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './HistoryOrders.scss'

export default function HistoryOrders() {

  const [historyOrders, setHistoryOrders] = useState([])

  useEffect(() => {
    getHistoryOrders()
  }, [historyOrders]);


  const getHistoryOrders = () => {
    axios
      .get(process.env.NODE_ENV !== 'production' ? '/historial-de-ordenes' : 'https://quiick-281820.rj.r.appspot.com/historial-de-ordenes')
      .then((res) => {
        setHistoryOrders(res.data)
      })
  }

  return (
    <div className="history__wrapper">
      {historyOrders.map((item, index) => {
        return (
          <div className="history-order__wrapper">
            <div className="history-order-id">{index + 1}</div>
              <div className="history-order-detail" key={item.id}>
                {
                  item.order.map(order => {
                    return (
                      <div className="item-ordered">{order.titulo} <small className="item-sku">sku {order.sku}</small></div>
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
