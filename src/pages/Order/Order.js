import React, { Component } from 'react'
import Button from '../../components/buttons/Button/Button'
import Icon from '../../components/icons/Icon'
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
  faList,
  faUserAstronaut,
  faGlassCheers,
} from '@fortawesome/free-solid-svg-icons'
import Spinner from '../../components/spinner/Spinner'
import NumberFormat from 'react-number-format'
import Carousel from 'nuka-carousel'
import Modal from 'react-modal'
import { HashLink as Link } from 'react-router-hash-link'
import axios from 'axios'
import './Order.scss'
import './Order-promo.scss'

Modal.setAppElement('#root')
export default class Order extends Component {
  constructor(props) {
    super(props)
    this.state = {
      prevCatalog: [],
      prevCategories: [],
      catalogSelected: [],
      allCategories: [],
      currentOrder: [],
      totalOrder: 0,
      modalIsOpen: false,
      fullName: '',
      contactNumber: '',
      orderDate: '',
      isReady: true,
      width: 0,
      height: 0,
      matchLocation: props.match.params,
      currentLocation: ''
    }
    this.clientData = this.clientData.bind(this)
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
    this.showModal = this.showModal.bind(this)
    this.hideModal = this.hideModal.bind(this)
    this.toLowerCase = this.toLowerCase.bind(this)
    this.postCurrentOrder = this.postCurrentOrder.bind(this)
    this.getDateOfOrder = this.getDateOfOrder.bind(this)
  }

  selectItemHandler(id) {
    const catalogItems = [...this.state.prevCatalog]
    let onlySelected = []
    let totalAmount = []

    catalogItems.forEach((item) => {
      if (item.id === id) {
        item.isSelected = !item.isSelected
      }

      if (!item.isSelected) {
        item.unidades = 1
      } else {
        onlySelected.push(item)
        totalAmount.push(parseInt(item.precio_ahora) * item.unidades)
      }

    })

    this.setState({ catalogSelected: onlySelected })
    this.setState({
      totalOrder: totalAmount.reduce(
        (orderTotal, eachProduct) => orderTotal + eachProduct, 0),
    })
  }

  showModal() {
    this.setState({ modalIsOpen: true })
  }

  hideModal() {
    this.setState({ modalIsOpen: false })
  }

  clientData(e) {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  incrementUnits(sku) {
    const incremetUnit = this.state.prevCatalog.map((item) => {
      if (item.sku === sku && item.unidades < item.stock) {
        return {
          ...item,
          unidades: item.unidades + 1,
        }
      }
      return item
    })
    this.setState({
      prevCatalog: incremetUnit,
    })
  }

  decrementUnits(sku) {
    const decremetUnit = this.state.prevCatalog.map((item) => {
      if (item.sku === sku && item.unidades > 1) {
        return {
          ...item,
          unidades: item.unidades - 1,
        }
      }
      return item
    })
    this.setState({
      prevCatalog: decremetUnit,
    })
  }

  toLowerCase(string) {
    string.toLowerCase()
  }

  async getProducts() {
    await
      axios
        .get(process.env.NODE_ENV !== 'production' ? `/productos` : 'https://quiick-281820.rj.r.appspot.com/productos')
        .then(res => {
          let allProds = []

          res.data.forEach(item => {
            if (item.restaurante.slug === this.state.matchLocation.restaurant) {

              allProds.push(item)

              this.setState({
                prevCatalog: allProds,
              })

            }
          })
          res.data.map(item => {
            return (
              this.setState({
                currentLocation: item.restaurante.slug
              })
            )
          })
        })
        .catch((error) => {
          console.log(error);
        })
  }

  async getPrevCategories() {
    await
      axios
        .get(process.env.NODE_ENV !== 'production' ? `/categorias` : 'https://quiick-281820.rj.r.appspot.com/categorias')
        .then((res) => {
          let allCats = []

          res.data.forEach(item => {
            item.restaurantes.forEach(restaurant => {
              if(restaurant.slug === this.state.matchLocation.restaurant) {
                allCats.push(item)

                this.setState({
                  prevCategories: allCats
                })
              }
            })
          })
        })
        .catch((error) => {
          console.log(error);
        })
  }

  postCurrentOrder(isReady) {
    this.setState({
      isReady: !isReady
    },
      async () => {
        await
          axios
            .post(process.env.NODE_ENV !== 'production' ? '/ordenes' : 'https://quiick-281820.rj.r.appspot.com/ordenes', {
              order: this.state.catalogSelected,
              owner: [
                {
                  name: this.state.fullName,
                  contact: this.state.contactNumber,
                  orderDate: this.getDateOfOrder(),
                  restaurant: this.state.matchLocation.restaurant,
                  table: this.state.matchLocation.tableId
                }
              ],
              status: [
                {
                  statusName: 'Pendiente',
                  id: 'pending',
                  isActive: false
                },
                {
                  statusName: 'En Preparación',
                  id: 'preparation',
                  isActive: false
                },
                {
                  statusName: 'A Servir',
                  id: 'serve',
                  isActive: false
                },
                {
                  statusName: 'Servido',
                  id: 'served',
                  isActive: false
                },
              ],
              isDone: false
            })
            .then((res) => {
              if (res.status === 200) {
                window.location = "/success"

                this.setState({
                  isReady: !isReady
                })
              }
            })
      })
  }

  getDateOfOrder() {
    let dateOfOrder = new Date();
    let day = String(dateOfOrder.getDate()).padStart(2, '0');
    let month = String(dateOfOrder.getMonth() + 1).padStart(2, '0');
    let year = dateOfOrder.getFullYear();
    let hour = dateOfOrder.getHours();
    let minute = dateOfOrder.getMinutes();
    return (`${day}/${month}/${year} ${hour}:${minute}hrs`);
  }

  componentDidMount() {
    this.getPrevCategories()
    this.getProducts()
    this.updateWindowDimensions()
    window.addEventListener('resize', this.updateWindowDimensions)
  }

  componentDidUpdate(prevProps, prevState) {
    const { catalogSelected, prevCatalog } = this.state
    let summaryTotal = []

    if (prevState.prevCatalog !== prevCatalog) {
      prevCatalog.map((item) => {
        catalogSelected.forEach((selected) => {
          if (item.id === selected.id) {
            selected.unidades = item.unidades
            summaryTotal.push(selected.precio_ahora * selected.unidades)
          }
        })
        return summaryTotal
      })

      if (catalogSelected.length >= 1) {
        this.setState({
          totalOrder: summaryTotal.reduce(
            (orderTotal, eachProduct) => orderTotal + eachProduct,
            0
          ),
        })
      }


    }
  }

  componentWillUnmount() {
    window.addEventListener('resize', this.updateWindowDimensions)
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight })
  }

  render() {
    const {
      prevCatalog,
      prevCategories,
      catalogSelected,
      totalOrder,
      modalIsOpen,
      fullName,
      contactNumber,
      width,
      isReady,
      matchLocation
    } = this.state

    let resumeMsg = []

    catalogSelected.map(product => {
      let productsCount = `- ${product.unidades} ${product.titulo}`
      resumeMsg.push(productsCount)
      return resumeMsg
    })

    return (
      <div>
        <div className='order'>
          <div className='order__header'>
            <div className='title'>
              <Icon faIcon={faGlassCheers} />
              <div>Estas en la mesa {matchLocation.tableId}</div>
            </div>
            <Carousel
              className='tabs-link'
              cellSpacing={width <= 1080 ? 5 : 20}
              dragging={true}
              slidesToShow={width <= 1080 ? 2 : 4}
              slidesToScroll={1}
              cellAlign='left'
              withoutControls={true}
              autoGenerateStyleTag={true}
              slideWidth={0.8}
            >
              {prevCategories.map(item => {
                return (
                  <Link key={item.id} to={`#${item.categoria}`} className='link'>
                    <Button isSubject='quinary' isText={`${item.categoria}`} />
                  </Link>
                )
              })}
            </Carousel>
          </div>
          <div className='order__catalog-selector'>
            <div className='order__catalog'>
              {prevCategories.map(item => {
                return (
                  <div className='order__catalog-category' key={item.id} id={item.categoria}>
                    <h2>{item.categoria}</h2>
                    <div key={item.categoria} className='order__catalog-products'>
                      {prevCatalog.map(product => {
                        return product.categorias.map((cat) => {
                          if (item.categoria === cat.categoria) {
                            return (
                              <div key={product.id} className={`${product.promo ? 'order__catalog-item-promo' : 'order__catalog-item'} ${product.isSelected ? 'check' : ''}`} id={product.id}>
                                <div className='order__catalog-pic' onClick={() => this.selectItemHandler(product.id)}>
                                  <div className={`toggler ${product.isSelected ? 'remove' : 'add'}`}>
                                    {product.isSelected ? (<Icon faIcon={faTimesCircle} />) : (<Icon faIcon={faCheckCircle} />)}
                                  </div>
                                  {product.promo ? (
                                    <div className='order__catalog-info-spec'>
                                      <span className='spec'>
                                        <Icon faIcon={faStar} />
                                      </span>
                                    </div>
                                  ) : ('')}

                                  <img src={product.foto.url} alt={product.titulo} />
                                </div>
                                <div className='order__catalog-info'>
                                  <div className='order__catalog-info-title-spec'>
                                    <strong className='order__catalog-info-title'>
                                      {product.nombre}
                                    </strong>
                                  </div>
                                  <p className='order__catalog-info-description'>
                                    {product.descripcion}
                                  </p>
                                  <div className='order__catalog-item-price'>
                                    <div className='order__catalog-item-spec'>
                                      <div className='spec-price'>
                                        <div className='spec-item'>
                                          <div className='price'>
                                            {parseInt(product.precio_antes) > 0 &&
                                              parseInt(product.precio_antes) >
                                              parseInt(product.precio_ahora) ? (
                                                <NumberFormat
                                                  value={parseInt(product.precio_antes)}
                                                  displayType={'text'}
                                                  thousandSeparator={'.'}
                                                  prefix={'$'}
                                                  decimalSeparator={','}
                                                  className='before'
                                                />
                                              ) : ('')}
                                            <NumberFormat
                                              value={
                                                product.unidades > 1 &&
                                                  product.isSelected
                                                  ? parseInt(product.precio_ahora) *
                                                  product.unidades
                                                  : parseInt(product.precio_ahora)
                                              }
                                              displayType={'text'}
                                              thousandSeparator={'.'}
                                              prefix={'$'}
                                              decimalSeparator={','}
                                            />
                                          </div>
                                          {product.isSelected ? (
                                            <div className='units'>
                                              <span className='unit'>
                                                {product.unidades}
                                              </span>
                                              <div className="units-actions">
                                                <div className='quantifier' onClick={() => this.incrementUnits(product.sku)}>
                                                  <Icon faIcon={faPlus} />
                                                </div>
                                                <div className='quantifier' onClick={() => this.decrementUnits(product.sku)}>
                                                  <Icon faIcon={faMinus} />
                                                </div>
                                              </div>
                                            </div>
                                          ) : ('')}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          }
                        })
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className='order__action'>
            <div className='order__total'>
              <strong>Total</strong>
              <strong>
                <NumberFormat
                  value={totalOrder}
                  displayType={'text'}
                  thousandSeparator={'.'}
                  prefix={'$'}
                  decimalSeparator={','}
                />
              </strong>
            </div>
            {totalOrder === 0 ? (
              <div className='order__submit--disable'>
                <Button
                  isSubject='quinary'
                  isText='¿Nada aún?'
                  isIcon={<Icon faIcon={faHandPointLeft} />}
                />
              </div>
            ) : (
                <div className='order__submit' onClick={this.showModal}>
                  <Button
                    isSubject='quinary'
                    isText='Continuar'
                    isIcon={<Icon faIcon={faPizzaSlice} />}
                  />
                </div>
              )}
          </div>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={this.hideModal}
            className='modal__wrapper'
            overlayClassName='modal__layout'
          >
            <div className="modal__header">
              <div className='modal-close' onClick={this.hideModal}>
                <Icon faIcon={faArrowLeft} />
                <span>Seguir comprando</span>
              </div>
            </div>
            <div className='modal__body'>
              <div className='modal-order-detail'>
                <div className='modal-info-box'>
                  <div className='modal-info-box-title'>
                    <Icon faIcon={faList} />
                    <strong>Detalle de pedido</strong>
                  </div>
                  {catalogSelected.map((product, index) => {
                    return (
                      <div key={index} className='modal-product'>
                        <div className="product-pic">
                          <div className='product-quantity'>
                            <span>{product.unidades}</span>
                          </div>
                          <img src={product.foto.url} alt={product.titulo} />
                        </div>
                        <div className='product-name'>
                          {product.titulo}
                          <small className="product-description">{product.descripcion}</small>
                        </div>
                        <span className='product-price'>
                          <NumberFormat
                            value={product.precio_ahora * product.unidades}
                            displayType={'text'}
                            thousandSeparator={'.'}
                            prefix={'$'}
                            decimalSeparator={','}
                          />
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="modal-payment-method">
                {!isReady ? <Spinner /> : null}
                <div className="modal__delivery-client">
                  <form className='modal-delivery'>
                    <div className='modal-info-box-title'>
                      <Icon faIcon={faUserAstronaut} />
                      <strong>Tu información</strong>
                    </div>
                    <div className='delivery-input'>
                      <label>Nombre</label>
                      <input
                        type='text'
                        name='fullName'
                        placeholder='Joaquín'
                        onChange={this.clientData}
                      />
                    </div>
                    <div className='delivery-input'>
                      <label>Teléfono</label>
                      <input
                        type='number'
                        name='contactNumber'
                        pattern='[0-9]{9}'
                        placeholder='955555555'
                        onChange={this.clientData}
                      />
                    </div>
                  </form>
                </div>
                <div className="modal__delivery-resume">
                  <div>
                    <strong>Total</strong>
                  </div>
                  <div className='order-cost'>
                    <strong className='product-total'>
                      <NumberFormat
                        value={totalOrder}
                        displayType={'text'}
                        thousandSeparator={'.'}
                        prefix={'$'}
                        decimalSeparator={','}
                      />
                    </strong>
                  </div>
                </div>
                <div className='modal__delivery-payment modal__delivery-focus'>
                  <div className='modal__payment-types'>
                    {!fullName ||
                      !contactNumber ? (
                        <div className='order__submit'>
                          <Button
                            isSubject='unactive'
                            isText='Debes llenar el formulario'
                            isIcon={<Icon faIcon={faHandPointUp} />}
                          />
                        </div>
                      ) : (
                        <div className='order__submit' onClick={this.postCurrentOrder}>
                          <Button
                            isSubject='secondary'
                            isText='Confirmar orden'
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
    )
  }
}
