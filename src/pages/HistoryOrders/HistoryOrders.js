import React, { useState, useEffect, useContext, useRef } from 'react'
import { UserContext } from '../../components/context/UserContext'
import Spinner from '../../components/spinner/Spinner'
import { grinning } from '../../components/emojis/Emojis'
import axios from 'axios'
import './HistoryOrders.scss'

export default function HistoryOrders() {

  const [rawHistoryOrders, setRawHistoryOrders] = useState([])
  const [historyOrders, setHistoryOrders] = useState([])
  const [historyOrdersLength, setHistoryOrdersLength] = useState(0)
  const { userToken, user } = useContext(UserContext)
  const prevHistoryLength = useRef(historyOrdersLength)

  useEffect(() => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    const getHistoryOrders = async () => {
      await
        axios
          .get(process.env.NODE_ENV !== 'production' ? '/historial-de-ordenes' : 'https://quiick-281820.rj.r.appspot.com/historial-de-ordenes', {
            headers: {
              Authorization: `Bearer ${userToken}`
            },
            cancelToken: source.token
          })
          .then((res) => {
            setRawHistoryOrders(res.data)
          })
          .catch(err => {
            if (axios.isCancel(err)) {
              console.log(`Ok ${grinning}`);
            } else {
              throw err;
            }
          })
    }
    const cleanHistory = () => {
      const allHistory = [...rawHistoryOrders]
      let allMatchHistory = []

      allHistory.forEach(item => {
        user.user.restaurantes.forEach(local => {
          item.owner.forEach(owner => {
            if (owner.restaurant === local.slug) {
              allMatchHistory.push(item)
            }
          })
        })
      })

      setHistoryOrders(allMatchHistory)
      setHistoryOrdersLength(allMatchHistory.length)
      prevHistoryLength.current = historyOrdersLength
    }

    getHistoryOrders()
    cleanHistory()

    return () => {
      source.cancel()
    }
  }, [rawHistoryOrders, userToken, user])

  return (
    <div className="history__wrapper">
      {prevHistoryLength.current !== historyOrdersLength ? <Spinner /> : null}
      {historyOrders.map((item, index) => {
        return (
          <div key={item.id} className="history-order__wrapper">
            {historyOrdersLength <= 0 ? <div>Nada por aquí</div> : null}
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
