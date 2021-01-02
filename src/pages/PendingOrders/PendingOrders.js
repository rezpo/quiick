import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { UserContext } from "../../components/context/UserContext";
import Spinner from "../../components/spinner/Spinner";
import { ReactComponent as PendingOrder } from "../../assets/icons/pending-glass.svg";
import { ReactComponent as PreparationOrder } from "../../assets/icons/preparation-glass.svg";
import { ReactComponent as ServeOrder } from "../../assets/icons/serve-glass.svg";
import { ReactComponent as ServedOrder } from "../../assets/icons/served-glass.svg";
import Icon from "../../components/icons/Icon";
import Button from "../../components/buttons/Button/Button";
import { grinning } from "../../components/emojis/Emojis";
import "./PendingOrders.scss";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";

const PendingOrders = () => {
  const { userToken, user } = useContext(UserContext);
  const [rawOrders, setRawOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cancelOrder, setCancelOrder] = useState(false);
  const [orderLength, setOrderLength] = useState(0);
  const prevOrderLength = useRef(orderLength);

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    const getAllPendingOrders = async () => {
      await axios
        .get(
          process.env.NODE_ENV !== "production"
            ? "/ordenes"
            : "https://quiick-281820.rj.r.appspot.com/ordenes",
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
            cancelToken: source.token,
          }
        )
        .then((res) => {
          setRawOrders(res.data);
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            console.log(`OK ${grinning}`);
          } else {
            throw err;
          }
        });
    };

    const cleanOrders = () => {
      const currentPendings = [...rawOrders];
      let allMatchPendings = [];
      currentPendings.forEach((item) => {
        user.user.restaurantes.forEach((local) => {
          item.owner.forEach((owner) => {
            if (owner.restaurant === local.slug) {
              allMatchPendings.push(item);
            }
          });
        });
      });

      setOrders(allMatchPendings);
      setOrderLength(allMatchPendings.length);
      prevOrderLength.current = orderLength;
    };

    getAllPendingOrders();
    cleanOrders();

    return () => {
      source.cancel();
    };
  }, [rawOrders, userToken, user, orderLength]);

  const updateOrder = async (target, status) => {
    await axios.put(
      process.env.NODE_ENV !== "production"
        ? `/ordenes/${target}`
        : `https://quiick-281820.rj.r.appspot.com/ordenes/${target}`,
      status,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
  };

  const removeOrder = async (target) => {
    await axios.delete(
      process.env.NODE_ENV !== "production"
        ? `/ordenes/${target}`
        : `https://quiick-281820.rj.r.appspot.com/ordenes/${target}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
  };

  const addOrderToHistory = async (orderDone) => {
    await axios.post(
      process.env.NODE_ENV !== "production"
        ? `/historial-de-ordenes`
        : `https://quiick-281820.rj.r.appspot.com/historial-de-ordenes`,
      orderDone,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
  };

  const cancelCurrentOrder = (orderId) => {
    return (
      <div
        className={`pending-order--cancel ${
          cancelOrder ? "cancel-button--show" : ""
        }`}
      >
        {cancelOrder ? (
          <Button
            isSubject="octonary"
            isText="Cancelar orden"
            clickOn={() => removeOrder(orderId)}
          />
        ) : null}
        <div onClick={() => setCancelOrder(!cancelOrder)}>
          {cancelOrder ? (
            <div className="pending-order-hide-cancel">
              <Icon faIcon={faTimes} />
            </div>
          ) : (
            <div>
              <Button
                isSubject="octonary"
                plusClass="item--remove"
                isIcon={<Icon faIcon={faTrashAlt} />}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const statusListener = (currentOrder, currentStatus) => {
    const allOrders = [...rawOrders];
    allOrders.map((item) => {
      if (currentOrder === item.id && item.id === currentOrder) {
        item.status[currentStatus].isActive = !item.status[currentStatus]
          .isActive;
        updateOrder(currentOrder, item);
      }
      return item;
    });

    allOrders.forEach((item) => {
      item.status.forEach((status) => {
        if (status.id === "served" && status.isActive) {
          item.isDone = true;
          addOrderToHistory(item);
          removeOrder(currentOrder);
        }
      });
    });
  };

  return (
    <div className="pending-orders__wrapper">
      {prevOrderLength.current !== orderLength ? <Spinner /> : null}
      {orders.map((item) => {
        return (
          <div className="pending-order__wrapper" id={item.id} key={item.id}>
            {orderLength <= 0 ? (
              <div className="pending-orders-empty">No hay nada</div>
            ) : null}
            {item.isDone ? <Spinner /> : null}
            <div className="pending-order__owner-wrapper">
              <div className="pending-order-owner">
                {item.owner.map((client) => {
                  return (
                    <div key={client.contact}>
                      <div className="pending-order-owner-name">
                        <strong>
                          {client.name}, {client.restaurant}{" "}
                          {client.table ? `Mesa ${client.table}` : null}{" "}
                          {client.delivery
                            ? `Despacho ${client.address}`
                            : null}{" "}
                          {client.clickCollect ? "Retiro en tienda" : null}
                        </strong>
                        {cancelCurrentOrder(item.id)}
                      </div>
                      <div className="pending-order-date">
                        {client.orderDate}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="pending-order__resume">
                <div className="pending-order__detail">
                  {item.order.map((product) => {
                    return (
                      <div key={product.sku} className="pending-order">
                        <div className="pending-order-units">
                          <span>{product.units}</span>
                        </div>
                        <span className="pending-order-item">
                          {product.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <ul className="pending-order__status">
              {item.status.map((status, index) => {
                return (
                  <li
                    key={status.id}
                    className={`pending-order__status-wrapper ${
                      status.isActive ? "active-order" : "deactive-order"
                    }`}
                    onClick={() => statusListener(item.id, index)}
                  >
                    <div className={`pending-order-status-indicator`}>
                      {(status.id === "pending" ? <PendingOrder /> : null) ||
                        (status.id === "preparation" ? (
                          <PreparationOrder />
                        ) : null) ||
                        (status.id === "serve" ? <ServeOrder /> : null) ||
                        (status.id === "served" ? <ServedOrder /> : null)}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default PendingOrders;
