import React, { Component } from "react";
import Button from "../../components/buttons/Button/Button";
import Icon from "../../components/icons/Icon";
import {
  faPizzaSlice,
  faThumbsUp,
  faHandPointUp,
  faHandPointLeft,
  faPlus,
  faMinus,
  faCheckCircle,
  faTimesCircle,
  faStar,
  faArrowLeft,
  faUserAstronaut,
} from "@fortawesome/free-solid-svg-icons";
import Spinner from "../../components/spinner/Spinner";
import NumberFormat from "react-number-format";
import Carousel from "nuka-carousel";
import Modal from "react-modal";
import { HashLink as Link } from "react-router-hash-link";
import axios from "axios";
import "./Order.scss";
import "./Order-promo.scss";
import { faAccusoft } from "@fortawesome/free-brands-svg-icons";

Modal.setAppElement("#root");
export default class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prevCatalog: [],
      catalogSelected: [],
      allCategories: [],
      currentOrder: [],
      promoBanners: [],
      totalOrder: 0,
      modalIsOpen: false,
      fullName: "",
      contactNumber: "",
      orderDate: "",
      address: "",
      delivery: false,
      clickCollect: false,
      isReady: true,
      width: 0,
      height: 0,
      local: null,
      matchLocation: props.match.params,
      showMethods: false,
      currentLocation: "",
      prevActiveCategories: null,
      deliveryMethod: false,
    };
    this.clientData = this.clientData.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.toLowerCase = this.toLowerCase.bind(this);
    this.postCurrentOrder = this.postCurrentOrder.bind(this);
    this.getDateOfOrder = this.getDateOfOrder.bind(this);
    this.showPaymentMethods = this.showPaymentMethods.bind(this);
    this.orderHandedOptions = this.orderHandedOptions.bind(this);
    this.localAvatar = this.localAvatar.bind(this);
    this.currentTable = this.currentTable.bind(this);
    this.externalOrder = this.externalOrder.bind(this);
    this.promoBanner = this.promoBanner.bind(this);
    this.getPromoBanners = this.getPromoBanners.bind(this);
  }

  selectItemHandler(id) {
    const catalogItems = [...this.state.prevCatalog];
    let onlySelected = [];
    let totalAmount = [];

    catalogItems.forEach((item) => {
      if (item.id === id) {
        item.isSelected = !item.isSelected;
      }

      if (!item.isSelected) {
        item.units = 1;
      } else {
        onlySelected.push(item);
        totalAmount.push(parseInt(item.price_now) * item.units);
      }
    });

    this.setState({ catalogSelected: onlySelected });
    this.setState({
      totalOrder: totalAmount.reduce(
        (orderTotal, eachProduct) => orderTotal + eachProduct,
        0
      ),
    });
  }

  showModal() {
    this.setState({ modalIsOpen: true });
  }

  hideModal() {
    this.setState({ modalIsOpen: false });
  }

  clientData(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  showPaymentMethods() {
    this.setState({
      showMethods: !this.state.showMethods,
    });
  }

  orderHandedOptions(clickTarget) {
    if (clickTarget === "delivery-option") {
      this.setState({
        delivery: !this.state.delivery,
        clickCollect: false,
      });
    }
    if (clickTarget === "ccollect-option") {
      this.setState({
        delivery: false,
        clickCollect: !this.state.clickCollect,
      });
    }
  }

  incrementUnits(sku) {
    const incremetUnit = this.state.prevCatalog.map((item) => {
      if (item.sku === sku && item.units < item.stock) {
        return {
          ...item,
          units: item.units + 1,
        };
      }
      return item;
    });
    this.setState({
      prevCatalog: incremetUnit,
    });
  }

  decrementUnits(sku) {
    const decremetUnit = this.state.prevCatalog.map((item) => {
      if (item.sku === sku && item.units > 1) {
        return {
          ...item,
          units: item.units - 1,
        };
      }
      return item;
    });
    this.setState({
      prevCatalog: decremetUnit,
    });
  }

  toLowerCase(string) {
    string.toLowerCase();
  }

  async getProducts() {
    await axios
      .get(
        process.env.NODE_ENV !== "production"
          ? `/productos`
          : "https://quiick-281820.rj.r.appspot.com/productos"
      )
      .then((res) => {
        let allProds = [];
        let allCats = [];

        res.data.forEach((item) => {
          item.restaurantes.forEach((local) => {
            if (local.slug === this.state.matchLocation.restaurant) {
              allProds.push(item);
              allCats.push(...item.categorias);
              const removeDoubles = [
                ...new Map(allCats.map((item) => [item.id, item])).values(),
              ];

              this.setState({
                prevCatalog: allProds,
                prevActiveCategories: removeDoubles,
              });
            }
          });
        });

        res.data.forEach((item) => {
          item.restaurantes.forEach((local) => {
            if (local.slug === this.state.matchLocation.restaurant) {
              return this.setState({
                currentLocation: local,
              });
            }
          });
        });
      })

      .catch((error) => {
        console.log(error);
      });
  }

  async getPromoBanners() {
    await axios
      .get(
        process.env.NODE_ENV !== "production"
          ? "/promo-banners"
          : "https://quiick-281820.rj.r.appspot.com/promo-banners"
      )
      .then((res) => {
        let allBanners = [];
        res.data.forEach((item) => {
          item.restaurantes.forEach((local) => {
            if (local.slug === this.state.matchLocation.restaurant) {
              allBanners.push(item);

              this.setState({
                promoBanners: allBanners,
              });
            }
          });
        });
      })
      .catch((err) => {
        console.log(err.error);
      });
  }

  postCurrentOrder(isReady) {
    this.setState(
      {
        isReady: !isReady,
      },
      async () => {
        await axios
          .post(
            process.env.NODE_ENV !== "production"
              ? "/ordenes"
              : "https://quiick-281820.rj.r.appspot.com/ordenes",
            {
              order: this.state.catalogSelected,
              owner: [
                {
                  name: this.state.fullName,
                  contact: this.state.contactNumber,
                  orderDate: this.getDateOfOrder(),
                  restaurant: this.state.matchLocation.restaurant,
                  table: this.state.matchLocation.tableId,
                  address: this.state.address,
                  delivery: this.state.delivery,
                  clickCollect: this.state.clickCollect,
                },
              ],
              status: [
                {
                  statusName: "Pendiente",
                  id: "pending",
                  isActive: false,
                },
                {
                  statusName: "En Preparación",
                  id: "preparation",
                  isActive: false,
                },
                {
                  statusName: "A Servir",
                  id: "serve",
                  isActive: false,
                },
                {
                  statusName: "Servido",
                  id: "served",
                  isActive: false,
                },
              ],
              isDone: false,
            }
          )
          .then((res) => {
            if (res.status === 200) {
              window.location = "/success";

              this.setState({
                isReady: !isReady,
              });
            }
          });
      }
    );
  }

  getDateOfOrder() {
    let dateOfOrder = new Date();
    let day = String(dateOfOrder.getDate()).padStart(2, "0");
    let month = String(dateOfOrder.getMonth() + 1).padStart(2, "0");
    let year = dateOfOrder.getFullYear();
    let hour = dateOfOrder.getHours();
    let minute = dateOfOrder.getMinutes();
    return `${day}/${month}/${year} ${hour}:${minute}hrs`;
  }

  componentDidMount() {
    this.getProducts();
    this.updateWindowDimensions();
    this.getPromoBanners();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  localAvatar(picture, name) {
    const { currentLocation } = this.state;

    return (
      <div
        className="order__header-local"
        style={{
          background: `linear-gradient(319deg, ${currentLocation.color_2} 12%, ${currentLocation.color_1} 52%, ${currentLocation.color_5} 82%)`,
        }}
      >
        <img src={`${picture}`} className="local-avatar" alt={`${name}`} />
      </div>
    );
  }

  currentTable(tableId) {
    return (
      <div className="location-msg">
        Estas en la <strong className="location">mesa {tableId},</strong> toma
        tu tiempo y realiza tu orden
      </div>
    );
  }

  externalOrder(option_1, option_2) {
    const {
      currentLocation,
      delivery,
      clickCollect,
      deliveryMethod,
    } = this.state;

    return (
      <div className="order__header-options">
        <div className="options-wrapper">
          <div
            id="delivery-option"
            className={`option ${option_1 ? "order-opt-selected" : ""}`}
            onClick={() => this.orderHandedOptions("delivery-option")}
            style={
              deliveryMethod && delivery
                ? {
                    background: `${currentLocation.color_4}`,
                    boxShadow: `0px 4px 8px ${currentLocation.color_2}30`,
                    color: "white",
                  }
                : {
                    background: `${currentLocation.color_2}`,
                    boxShadow: `0px 4px 8px ${currentLocation.color_2}30`,
                  }
            }
          >
            <div className="icon-wrapper">
              <Icon faIcon={faAccusoft} />
            </div>
            <div
              className="action-button"
              style={
                deliveryMethod && delivery
                  ? {
                      background: `${currentLocation.color_4}`,
                      color: "white",
                    }
                  : { background: `${currentLocation.color_2}` }
              }
            >
              {`${option_1 ? "Despacho seleccionado" : "Despacho"}`}
            </div>
          </div>
          <div
            id="ccollect-option"
            className={`option ${option_2 ? "order-opt-selected" : ""}`}
            onClick={() => this.orderHandedOptions("ccollect-option")}
            style={
              deliveryMethod && clickCollect
                ? {
                    background: `${currentLocation.color_4}`,
                    boxShadow: `0px 4px 8px ${currentLocation.color_2}30`,
                    color: "white",
                  }
                : {
                    background: `${currentLocation.color_2}`,
                    boxShadow: `0px 4px 8px ${currentLocation.color_2}30`,
                  }
            }
          >
            <div className="icon-wrapper">
              <Icon faIcon={faAccusoft} />
            </div>
            <div
              className="action-button"
              style={
                deliveryMethod && clickCollect
                  ? {
                      background: `${currentLocation.color_4}`,
                      color: "white",
                    }
                  : { background: `${currentLocation.color_2}` }
              }
            >
              {`${
                option_2 ? "Retiro en tienda seleccionado" : "Retiro en tienda"
              }`}
            </div>
          </div>
        </div>
      </div>
    );
  }

  promoBanner() {
    let bannerInfo = [];

    this.state.promoBanners.forEach((item) => {
      item.banner_img.forEach((item) => {
        bannerInfo.push({ img: item.url, name: item.name });
      });
    });

    return bannerInfo.map((item) => {
      return <img src={`${item.img}`} alt={`${item.name}`} />;
    });
  }

  getCategories() {
    const { prevActiveCategories } = this.state;
    let localCategories = [];

    if (prevActiveCategories !== null) {
      prevActiveCategories.forEach((item) => {
        localCategories.push({ id: item.id, category: item.categoria });
      });
    }

    return localCategories.map((item) => {
      return (
        <Link key={item.id} to={`${item.category}`} className="link">
          <Button isSubject="quinary" isText={`${item.category}`} />
        </Link>
      );
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { catalogSelected, prevCatalog, delivery, clickCollect } = this.state;
    let summaryTotal = [];

    if (prevState.prevCatalog !== prevCatalog) {
      prevCatalog.map((item) => {
        catalogSelected.forEach((selected) => {
          if (item.id === selected.id) {
            selected.units = item.units;
            summaryTotal.push(selected.price_now * selected.units);
          }
        });
        return summaryTotal;
      });

      if (catalogSelected.length >= 1) {
        this.setState({
          totalOrder: summaryTotal.reduce(
            (orderTotal, eachProduct) => orderTotal + eachProduct,
            0
          ),
        });
      }
    }
    if (
      prevState.delivery !== delivery ||
      prevState.clickCollect !== clickCollect
    ) {
      if (delivery || clickCollect) {
        this.setState({
          deliveryMethod: true,
        });
      } else {
        this.setState({
          deliveryMethod: false,
        });
      }
    }
  }

  componentWillUnmount() {
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  render() {
    const {
      prevCatalog,
      catalogSelected,
      totalOrder,
      modalIsOpen,
      fullName,
      contactNumber,
      width,
      isReady,
      showMethods,
      matchLocation,
      delivery,
      address,
      clickCollect,
      currentLocation,
      deliveryMethod,
      prevActiveCategories,
    } = this.state;

    let resumeMsg = [];

    catalogSelected.map((product) => {
      let productsCount = `- ${product.units} ${product.title}`;
      resumeMsg.push(productsCount);
      return resumeMsg;
    });

    return (
      <div>
        <div className="order">
          <div className="order__header">
            <div className="order__header-carpet">
              <div className="order__header-presentation">
                <div className="presentation">
                  {matchLocation.restaurant === currentLocation.slug
                    ? this.localAvatar(currentLocation.avatar.url)
                    : null}
                  <div className="order__header-welcome">
                    <div className="welcome-title">
                      Bienvenidos a <strong>{currentLocation.name}</strong>
                      {matchLocation.tableId ? (
                        this.currentTable(matchLocation.tableId)
                      ) : (
                        <div className="location-msg">{`Selecciona despacho a domicilio o retiro en tienda`}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Carousel
                className="promo-banner-slider"
                dragging={true}
                slidesToScroll={1}
                withoutControls={true}
                autoGenerateStyleTag={true}
              >
                {this.promoBanner()}
              </Carousel>
            </div>

            <div className="order__external">
              {!matchLocation.tableId
                ? this.externalOrder(delivery, clickCollect)
                : null}
            </div>

            <Carousel
              className="tabs-link"
              cellSpacing={width <= 1080 ? 5 : 20}
              dragging={true}
              slidesToShow={width <= 1080 ? 2 : 4}
              slidesToScroll={1}
              cellAlign="left"
              withoutControls={true}
              autoGenerateStyleTag={true}
              slideWidth={0.8}
            >
              {this.getCategories()}
            </Carousel>
          </div>

          <div className="order__catalog-selector">
            <div className="order__catalog">
              {prevActiveCategories !== null ? (
                prevActiveCategories.map((item) => {
                  return (
                    <div
                      className="order__catalog-category"
                      key={item.id}
                      id={item.categoria}
                    >
                      <h2>{item.categoria}</h2>
                      <div
                        key={item.categoria}
                        className="order__catalog-products"
                      >
                        {prevCatalog.map((product) => {
                          return product.categorias.map((cat) => {
                            return item.categoria === cat.categoria &&
                              product.visible ? (
                              <div
                                key={product.id}
                                className={`${
                                  product.promo
                                    ? "order__catalog-item-promo"
                                    : "order__catalog-item"
                                } ${product.isSelected ? "check" : ""}`}
                                id={product.id}
                                style={
                                  product.isSelected
                                    ? {
                                        boxShadow: `0px 4px 8px ${currentLocation.color_2}30`,
                                        background: `${currentLocation.color_4}`,
                                      }
                                    : {
                                        boxShadow: `0px 4px 8px ${currentLocation.color_2}30`,
                                        background: `${
                                          product.promo
                                            ? currentLocation.color_5
                                            : "#FFF"
                                        }`,
                                      }
                                }
                              >
                                <div
                                  className="order__catalog-pic"
                                  onClick={() =>
                                    this.selectItemHandler(product.id)
                                  }
                                >
                                  <div
                                    className={`toggler ${
                                      product.isSelected ? "remove" : "add"
                                    }`}
                                    style={
                                      product.isSelected
                                        ? {
                                            background: `${currentLocation.color_4}`,
                                          }
                                        : {
                                            background: `${currentLocation.color_2}`,
                                          }
                                    }
                                  >
                                    {product.isSelected ? (
                                      <Icon faIcon={faTimesCircle} />
                                    ) : (
                                      <Icon faIcon={faCheckCircle} />
                                    )}
                                  </div>
                                  {product.promo ? (
                                    <div className="order__catalog-info-spec">
                                      <span className="spec">
                                        <Icon faIcon={faStar} />
                                      </span>
                                    </div>
                                  ) : null}

                                  <img
                                    src={product.picture.url}
                                    alt={product.title}
                                  />
                                </div>
                                <div className="order__catalog-info">
                                  <div
                                    className="order__catalog-info-title-spec"
                                    style={
                                      product.isSelected && product.promo
                                        ? {
                                            background: `${currentLocation.color_2}`,
                                          }
                                        : null
                                    }
                                  >
                                    <strong className="order__catalog-info-title">
                                      {product.name}
                                    </strong>
                                  </div>
                                  <p className="order__catalog-info-description">
                                    {product.description}
                                  </p>
                                  <div className="order__catalog-item-price">
                                    <div className="order__catalog-item-spec">
                                      <div className="spec-price">
                                        <div className="spec-item">
                                          <div className="price">
                                            {parseInt(product.price_before) >
                                              0 &&
                                            parseInt(product.price_before) >
                                              parseInt(product.price_now) ? (
                                              <NumberFormat
                                                value={parseInt(
                                                  product.price_before
                                                )}
                                                displayType={"text"}
                                                thousandSeparator={"."}
                                                prefix={"$"}
                                                decimalSeparator={","}
                                                className="before"
                                              />
                                            ) : (
                                              ""
                                            )}
                                            <NumberFormat
                                              value={
                                                product.units > 1 &&
                                                product.isSelected
                                                  ? parseInt(
                                                      product.price_now
                                                    ) * product.units
                                                  : parseInt(product.price_now)
                                              }
                                              displayType={"text"}
                                              thousandSeparator={"."}
                                              prefix={"$"}
                                              decimalSeparator={","}
                                            />
                                          </div>
                                          {product.isSelected ? (
                                            <div className="units">
                                              <span className="unit">
                                                {product.units}
                                              </span>
                                              <div className="units-actions">
                                                <div
                                                  className="quantifier"
                                                  onClick={() =>
                                                    this.incrementUnits(
                                                      product.sku
                                                    )
                                                  }
                                                >
                                                  <Icon faIcon={faPlus} />
                                                </div>
                                                <div
                                                  className="quantifier"
                                                  onClick={() =>
                                                    this.decrementUnits(
                                                      product.sku
                                                    )
                                                  }
                                                >
                                                  <Icon faIcon={faMinus} />
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : null;
                          });
                        })}
                      </div>
                    </div>
                  );
                })
              ) : (
                <Spinner />
              )}
            </div>
          </div>
          <div className="order__action">
            <div className="order__total">
              <strong>Total</strong>
              <strong>
                <NumberFormat
                  value={totalOrder}
                  displayType={"text"}
                  thousandSeparator={"."}
                  prefix={"$"}
                  decimalSeparator={","}
                />
              </strong>
            </div>
            {currentLocation.tableId === null ? (
              totalOrder === 0 || !deliveryMethod ? (
                <div className="order__submit--disable">
                  <Button
                    isSubject="quinary"
                    isText="¿Nada aún?"
                    isIcon={<Icon faIcon={faHandPointLeft} />}
                  />
                </div>
              ) : (
                <div className="order__submit" onClick={this.showModal}>
                  <Button
                    isSubject="quinary"
                    isText="Continuar"
                    isIcon={<Icon faIcon={faPizzaSlice} />}
                  />
                </div>
              )
            ) : totalOrder === 0 ? (
              <div className="order__submit--disable">
                <Button
                  isSubject="quinary"
                  isText="¿Nada aún?"
                  isIcon={<Icon faIcon={faHandPointLeft} />}
                />
              </div>
            ) : (
              <div className="order__submit" onClick={this.showModal}>
                <Button
                  isSubject="quinary"
                  isText="Continuar"
                  isIcon={<Icon faIcon={faPizzaSlice} />}
                />
              </div>
            )}
          </div>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={this.hideModal}
            className="modal__wrapper"
            overlayClassName="modal__layout"
          >
            <div className="modal__header">
              <div className="modal-close" onClick={this.hideModal}>
                <Button
                  isSubject="quinary"
                  isText={"Seguir comprando"}
                  isIcon={<Icon faIcon={faArrowLeft} />}
                />
              </div>
            </div>
            <div className="modal__body">
              <div className="modal-order-detail">
                <div className="modal-info-box">
                  <div className="modal-info-box-title">
                    <strong>Detalle de pedido</strong>
                  </div>
                  <div className="modal-info-box-products">
                    {catalogSelected.map((product, index) => {
                      return (
                        <div key={index} className="modal-product">
                          <div className="product-pic">
                            <div
                              className="product-quantity"
                              style={{
                                background: `${currentLocation.color_2}`,
                              }}
                            >
                              <span>{product.units}</span>
                            </div>
                            <img
                              src={product.picture.url}
                              alt={product.title}
                            />
                          </div>
                          <div className="product-name">
                            {product.title}
                            <small className="product-description">
                              {product.description}
                            </small>
                          </div>
                          <span className="product-price">
                            <NumberFormat
                              value={product.price_now * product.units}
                              displayType={"text"}
                              thousandSeparator={"."}
                              prefix={"$"}
                              decimalSeparator={","}
                            />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div
                className={`modal-payment-method ${
                  showMethods ? "show-methods" : null
                }`}
              >
                {!isReady ? <Spinner /> : null}
                <div className="modal__delivery-client">
                  <form className="modal-delivery">
                    <div className="modal-info-box-title title-desktop">
                      <Icon faIcon={faUserAstronaut} />
                      <strong>Tu información</strong>
                    </div>
                    <div
                      className={"modal-info-box-title title-mobile"}
                      onClick={this.showPaymentMethods}
                    >
                      {showMethods ? (
                        <strong>Completa estos datos</strong>
                      ) : (
                        <strong>Realizar pedido</strong>
                      )}
                    </div>
                    <div className="delivery-input">
                      <label>Nombre</label>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Joaquín"
                        onChange={this.clientData}
                      />
                    </div>
                    <div className="delivery-input">
                      <label>Teléfono</label>
                      <input
                        type="number"
                        name="contactNumber"
                        pattern="[0-9]{9}"
                        placeholder="955555555"
                        onChange={this.clientData}
                      />
                    </div>
                    {delivery ? (
                      <div className="delivery-input">
                        <label>Dirección de despacho</label>
                        <input
                          type="text"
                          name="address"
                          placeholder="Ej: Calle Número, Depto/Casa/Oficina, Comuna"
                          onChange={this.clientData}
                        />
                      </div>
                    ) : null}
                    {clickCollect ? (
                      <div>
                        Debes retirar tu pedido en {currentLocation.address}
                      </div>
                    ) : null}
                  </form>
                </div>
                <div className="modal__delivery-resume">
                  <div>
                    <strong>Total</strong>
                  </div>
                  <div className="order-cost">
                    <strong className="product-total">
                      <NumberFormat
                        value={totalOrder}
                        displayType={"text"}
                        thousandSeparator={"."}
                        prefix={"$"}
                        decimalSeparator={","}
                      />
                    </strong>
                  </div>
                </div>
                <div className="modal__delivery-payment modal__delivery-focus">
                  <div className="modal__payment-types">
                    {delivery ? (
                      !fullName || !contactNumber || !address ? (
                        <div className="order__make-order">
                          <Button
                            isSubject="unactive"
                            isText="Debes llenar el formulario"
                            isIcon={<Icon faIcon={faHandPointUp} />}
                          />
                        </div>
                      ) : (
                        <div
                          className="order__make-order"
                          onClick={this.postCurrentOrder}
                        >
                          <Button
                            isSubject="secondary"
                            isText="Confirmar orden"
                            isIcon={<Icon faIcon={faThumbsUp} />}
                          />
                        </div>
                      )
                    ) : !fullName || !contactNumber ? (
                      <div className="order__make-order">
                        <Button
                          isSubject="unactive"
                          isText="Debes llenar el formulario"
                          isIcon={<Icon faIcon={faHandPointUp} />}
                        />
                      </div>
                    ) : (
                      <div
                        className="order__make-order"
                        onClick={this.postCurrentOrder}
                      >
                        <Button
                          isSubject="secondary"
                          isText="Confirmar orden"
                          plusStyle={{
                            background: `${currentLocation.color_2}`,
                          }}
                          isIcon={<Icon faIcon={faThumbsUp} />}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}
