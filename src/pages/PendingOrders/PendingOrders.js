import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Spinner from '../../components/spinner/Spinner'
import './PendingOrders.scss'

const PendingOrders = () => {

  const [orders, setOrders] = useState([])
  const [orderLength, setOrderLength] = useState(0)

  useEffect(() => {
    getAllPendingOrders()
  }, [orders])

  const getAllPendingOrders = async () => {
    await
      axios
        .get(process.env.NODE_ENV !== 'production' ? '/ordenes' : 'https://quiick-281820.rj.r.appspot.com/ordenes')
        .then(res => {
          setOrders(res.data)
          setOrderLength(res.data.length)
        })
  }

  const updateOrder = async (target, status) => {
    await axios
      .put(process.env.NODE_ENV !== 'production' ? `/ordenes/${target}` : `https://quiick-281820.rj.r.appspot.com/ordenes/${target}`, status)
  }

  const removeOrder = async (target) => {
    await axios
      .delete(process.env.NODE_ENV !== 'production' ? `/ordenes/${target}` : `https://quiick-281820.rj.r.appspot.com/ordenes/${target}`)
  }

  const addOrderToHistory = async (orderDone) => {
    await axios
      .post(process.env.NODE_ENV !== 'production' ? `/historial-de-ordenes` : `https://quiick-281820.rj.r.appspot.com/historial-de-ordenes`, orderDone)
  }

  const updateOrderStatus = (e) => {
    const currentOrder = [...orders]
    const parentTarget = e.target.parentNode.parentNode.id
    let statusOrder = []
    let orderIsDone = false
    currentOrder.map(order => {
      let statusArr = []

      order.status.forEach(status => {
        if (e.target.id === status.id) {
          status.isActive = !status.isActive
        }

        if (status.isActive) {
          let statusCounter = 0
          statusArr.push(status.isActive)
          statusCounter += statusArr.length

          if (statusCounter === 4) {
            order.isDone = !order.isDone
          }
        }
      })

      statusOrder = order.status
      orderIsDone = order.isDone

      console.log(orderIsDone)

      if (parentTarget === String(order.id)) {
        updateOrder(parentTarget, { status: statusOrder, isDone: orderIsDone })
        checkOrderStatus()
      }
    })

  }

  const checkOrderStatus = () => {
    const currentOrder = [...orders]

    currentOrder.map(order => {
      let statusArr = []
      order.status.forEach(status => {
        if (status.isActive) {
          let statusCounter = 0
          statusArr.push(status.isActive)
          statusCounter += statusArr.length

          if (statusCounter === 4) {
            setTimeout(() => {
              addOrderToHistory({
                order: order.order,
                owner: order.owner
              })
              removeOrder(order.id)
            }, 1000)
          }
        }
      })
    })
  }

  return (
    <div className="pending-orders__wrapper">
      {orderLength <= 0 ?
        <div className="pending-orders-empty">No hay nada</div>
        : orders.map(item => {

          return (
            <div className="pending-order__wrapper" id={item.id}>
              {item.isDone ? <Spinner /> : null}
              <div className="pending-order__owner-wrapper">
                <div className="pending-order-owner">
                  {item.owner.map(client => {
                    return (
                      <div>
                        <strong className="pending-order-owner-name">{client.name}, mesa {client.table}</strong>
                        <div className="pending-order-date">{client.orderDate}</div>
                      </div>
                    )
                  })}
                </div>
                <div className="pending-order__resume" >
                  <div className="pending-order__detail">
                    {item.order.map(product => {
                      return (
                        <div key={product.sku} className="pending-order">
                          <div className="pending-order-units"><span>{product.unidades}</span></div>
                          <span className="pending-order-item">{product.nombre}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className="pending-order__status">
                {item.status.map(status => {
                  return (
                    <div key={status.id} id={status.id} className={`pending-order__status-wrapper ${status.isActive ? 'active-order' : 'deactive-order'}`} onClick={updateOrderStatus}>
                      <div className={`pending-order-status-indicator`}></div>
                    </div>
                  )
                })}
              </div>
            </div>
          )

        })}
    </div>
  )
}

export default PendingOrders
