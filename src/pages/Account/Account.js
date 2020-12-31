import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../components/context/UserContext";
import PendingOrders from "../../pages/PendingOrders/PendingOrders";
import HistoryOrder from "../../pages/HistoryOrders/HistoryOrders";
import LocalsAdd from "../Locals/LocalsAdd/LocalsAdd";
import ProductsCategory from "../../containers/ProductsCategory/ProductsCategory";
import Icon from "../../components/icons/Icon";
import { ReactComponent as Activemenu } from "../../assets/icons/active.svg";
import { ReactComponent as Deactivemenu } from "../../assets/icons/deactive.svg";
import { ReactComponent as Qrtable } from "../../assets/icons/qr-table.svg";
import { ReactComponent as HideQrtable } from "../../assets/icons/qr-table-hide.svg";
import { ReactComponent as PendingOrdersIcon } from "../../assets/icons/icon-pending-orders.svg";
import { ReactComponent as HistoryOrdersIcon } from "../../assets/icons/icon-order-history.svg";
import { ReactComponent as CategoryProductsIcon } from "../../assets/icons/icon-cats-products.svg";
import { ReactComponent as NewLocalIcon } from "../../assets/icons/icon-add-local.svg";
import { useForm } from "react-hook-form";
import { saveSvgAsPng } from "save-svg-as-png";
import QRCode from "react-qr-code";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/buttons/Button/Button";
import axios from "axios";
import "./Account.scss";
export default function Account() {
  const { register, handleSubmit, reset, errors } = useForm();
  const pendingOrders = <PendingOrders />;
  const historyOrder = <HistoryOrder />;
  const products = <ProductsCategory />;
  const newLocals = <LocalsAdd />;
  const [tableId, setTableId] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedSection, setSelectedSection] = useState(pendingOrders);
  const [showMenu, setShowMenu] = useState(false);
  const [showTableForm, setShowTableForm] = useState({ local_id: null });
  const { userToken, user } = useContext(UserContext);
  const viewSection = [
    {
      name: "pending-orders",
      component: pendingOrders,
    },
    {
      name: "history-orders",
      component: historyOrder,
    },
    {
      name: "edit-products",
      component: products,
    },
    {
      name: "add-local",
      component: newLocals,
    },
  ];

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    const getUserAccount = async () => {
      await axios
        .get(
          process.env.NODE_ENV !== "production"
            ? `/restaurantes`
            : "https://quiick-281820.rj.r.appspot.com/restaurantes",
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
            cancelToken: source.token,
          }
        )
        .then((res) => {
          setRestaurants(user.user.restaurantes);
        })
        .catch((err) => {
          console.log(err.Error);
        });
    };

    getUserAccount();

    return () => {
      source.cancel();
    };
  }, [restaurants, userToken, user]);

  const viewSelectedSection = (e) => {
    viewSection.forEach((item) => {
      if (e.target.id === item.name) {
        setSelectedSection(item.component);
        displayMenu();
      }
    });
  };

  const createNewTableId = (data, e) => {
    setTableId(data);
    e.target.reset();
  };

  const showTableIdForm = (localId) => {
    const localItem = restaurants.filter((item) => item.id === localId);

    if (localItem[0].id === localId) {
      setShowTableForm({
        local_id: localItem[0].id,
      });
    }
  };

  const generateQRCode = (localName) => {
    if (tableId[localName] !== "") {
      return (
        <div
          id={`${localName}-table-${tableId[localName]}`}
          className="qr-generated"
        >
          <small className="qr--remove" onClick={() => setTableId(null)}>
            Ocultar
          </small>
          <QRCode
            value={`http://localhost:3000/${localName}/${tableId[localName]}/order`}
            level={"H"}
            size={120}
          />
          <span
            onClick={() =>
              downLoadTableQR(`${localName}-table-${tableId[localName]}`)
            }
            className="download-link"
          >
            <Icon faIcon={faDownload} /> Descargar QR
          </span>
        </div>
      );
    }
  };

  const downLoadTableQR = (tableId) => {
    const qr = document.getElementById(tableId);
    const imgUrl = qr.querySelector("svg");
    saveSvgAsPng(imgUrl, `${tableId}.png`, { scale: 3 });
  };

  const displayMenu = () => {
    setShowMenu(!showMenu);
  };

  const displayTableIdForm = (local) => {
    return (
      <div
        className="qr-code"
        onClick={() => setShowTableForm({ local_id: local })}
      >
        <Qrtable />
      </div>
    );
  };
  const closeTableIdForm = () => {
    return (
      <div
        className="qr-code"
        onClick={() => setShowTableForm({ local_id: null })}
      >
        <HideQrtable />
      </div>
    );
  };

  return (
    <div className="account__wrapper">
      <div
        className={`account__menu-wrapper ${showMenu ? "show-user-menu" : ""}`}
      >
        <div className="account__menu-user">
          <div className="account-user">
            <strong className="account-username">
              Hola {user.user.username},
            </strong>
          </div>
          <div className="account-view-menu" onClick={displayMenu}>
            {showMenu ? <Activemenu /> : <Deactivemenu />}
          </div>
        </div>
        <div className="account__restaurants-wrapper">
          <strong>Tus Locales</strong>
          <div className="account__restaurants-list">
            {restaurants.map((restaurant) => {
              return (
                <div key={restaurant.id} className="account-restaurant">
                  <div className="account-add-table-code">
                    <div>
                      <div className="restaurant-name">{restaurant.name}</div>
                      <div className="restaurant-address">
                        {restaurant.address}
                      </div>
                    </div>
                    {showTableForm.local_id === restaurant.id
                      ? closeTableIdForm()
                      : displayTableIdForm(restaurant.id)}
                  </div>
                  <div
                    className={`account-add-table-id ${
                      showTableForm.local_id === restaurant.id
                        ? "show-table-form"
                        : ""
                    }`}
                  >
                    <form onSubmit={handleSubmit(createNewTableId)}>
                      <input
                        name={restaurant.slug}
                        type="number"
                        placeholder="Ej: 2"
                        ref={register}
                      />
                      <Button
                        isSubject="primary"
                        isType="submit"
                        isText="Crear código QR"
                        clickOn={() => showTableIdForm(restaurant.id)}
                      />
                    </form>
                  </div>
                  {tableId !== null ? generateQRCode(restaurant.slug) : null}
                </div>
              );
            })}
          </div>
        </div>
        <ul className="account__menu-items">
          <li
            className="account-menu-item"
            id="pending-orders"
            onClick={viewSelectedSection}
          >
            <PendingOrdersIcon />
            <span>Ordenes pendientes</span>
          </li>
          <li
            className="account-menu-item"
            id="history-orders"
            onClick={viewSelectedSection}
          >
            <HistoryOrdersIcon />
            <span>Historial de ordenes</span>
          </li>
          <li
            className="account-menu-item"
            id="edit-products"
            onClick={viewSelectedSection}
          >
            <CategoryProductsIcon />
            <span>Productos y categorías</span>
          </li>
          <li
            className="account-menu-item"
            id="add-local"
            onClick={viewSelectedSection}
          >
            <NewLocalIcon />
            <span>Añadir local</span>
          </li>
        </ul>
      </div>
      <div className="account__info-wrapper">{selectedSection}</div>
    </div>
  );
}
