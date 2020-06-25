import React, { Component } from 'react'
import Wrapper from '../../components/wrapper/Wrapper'
import Button from '../../components/buttons/Button/Button'
import Icon from '../../components/icons/Icon'
import { faPizzaSlice, faTrashAlt, faStar, faBicycle, faThumbsUp, faHandPointUp, faUtensils, faClipboardList, faTimes, faBeer, faCookieBite, faHandPointLeft, faPlus, faMinus, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import NumberFormat from 'react-number-format'
import Modal from 'react-modal'
import { HashLink as Link } from 'react-router-hash-link';
import './Order.scss'

Modal.setAppElement('#root')
export default class Order extends Component {

  constructor(props) {
    super(props);
    this.state = {
      catalog: [
        {
          photo: 'https://www.dropbox.com/s/xd7iw1r0mlax34a/cmb0.jpg?raw=1',
          title: 'De la casa',
          sku: '1',
          description: '2 Pizzas familiares: Pepperoni y Solo queso + Bebida 1.5lts',
          size: { size: 'FAM', units: 1, price: 13990, id: 'CMB0', selectedIndicator: '', isSelected: false, name: 'Oferta de la casa' },
          isCombo: true
        },
        {
          photo: 'https://www.dropbox.com/s/8ygdc40kho0mw3z/cmb1.jpg?raw=1',
          title: '1',
          sku: '2',
          description: '1 Pizza familiar de la casa + 1 Porción de palitos tropicales + Bebida 1.5lts',
          size: { size: 'FAM', units: 1, price: 14990, id: 'CMB1', selectedIndicator: '', isSelected: false, name: 'Combo 1' },
          isCombo: true
        },
        {
          photo: 'https://www.dropbox.com/s/x95pvubgbnteirk/cmb2.jpg?raw=1',
          title: '2',
          sku: '3',
          description: '1 Pizzas familiar (pollo bbq) + 1 Pizza mediana (napolitana) + Palitos de ajo + Bebida 1.5lts',
          size: { size: 'FAM', units: 1, price: 19490, id: 'CMB2', selectedIndicator: '', isSelected: false, name: 'Combo 2' },
          isCombo: true
        },
        {
          photo: 'https://www.dropbox.com/s/6g07pe66pip7are/cmb3.jpg?raw=1',
          title: '3',
          sku: '4',
          description: '1 Pizza pollo champiñón + 1 Pizza italiana + Bebida 1.5lts',
          size: { size: 'FAM', units: 1, price: 19490, id: 'CMB3', selectedIndicator: '', isSelected: false, name: 'Combo 3' },
          isCombo: true
        },
      ],
      extras: [
        {
          name: 'Palitos tropicales',
          price: 4490,
          isSelected: false,
          selectedIndicator: ''
        },
        {
          name: 'Alitas de pollo',
          price: 3490,
          isSelected: false,
          selectedIndicator: ''
        },
        {
          name: 'Palitos de ajo',
          price: 2990,
          isSelected: false,
          selectedIndicator: ''
        },
        {
          name: 'Papas fritas',
          price: 2990,
          isSelected: false,
          selectedIndicator: ''
        },
        {
          name: 'Borde de queso',
          price: 1990,
          isSelected: false,
          selectedIndicator: ''
        },
        {
          name: 'Extra de queso',
          price: 800,
          isSelected: false,
          selectedIndicator: ''
        },
        {
          name: 'Pimentón verde',
          price: 800,
          isSelected: false,
          selectedIndicator: ''
        },
        {
          name: 'Champiñón',
          price: 800,
          isSelected: false,
          selectedIndicator: ''
        },
        {
          name: 'Palta',
          price: 800,
          isSelected: false,
          selectedIndicator: ''
        },
        {
          name: 'Platano maduro',
          price: 800,
          isSelected: false,
          selectedIndicator: ''
        },
        {
          name: 'Aceitunas',
          price: 800,
          isSelected: false,
          selectedIndicator: ''
        },
        {
          name: 'Choclo',
          price: 800,
          isSelected: false,
          selectedIndicator: ''
        },
        {
          name: 'Tocino',
          price: 800,
          isSelected: false,
          selectedIndicator: ''
        },
        {
          name: 'Pollo',
          price: 800,
          isSelected: false,
          selectedIndicator: ''
        },
        {
          name: 'Salsa BBQ spicy',
          price: 300,
          isSelected: false,
          selectedIndicator: ''
        },
        {
          name: 'Salsa de ajo',
          price: 300,
          isSelected: false,
          selectedIndicator: ''
        },
        {
          name: 'Salsa BBQ',
          price: 300,
          isSelected: false,
          selectedIndicator: ''
        },
        {
          name: 'Salsa de pizza',
          price: 300,
          isSelected: false,
          selectedIndicator: ''
        }
      ],
      catalogSelected: [],
      extraSelected: [],
      order: [],
      deliveryCost: 0,
      modalIsOpen: false,
      fullName: '',
      contactNumber: '',
      deliveryAddress: '',
      msg: []
    }
  }

  selectItemHandler = (index) => () => {
    const catalogItems = [...this.state.catalog]
    let onlySelected = []

    catalogItems[index].size.isSelected = !catalogItems[index].size.isSelected
    if (catalogItems[index].size.isSelected) {
      catalogItems[index].size.selectedIndicator = 'check'
    } else {
      catalogItems[index].size.selectedIndicator = ''
    }

    catalogItems.forEach(item => {
      if (item.size.isSelected) {
        onlySelected.push(item.size)
      }
    })

    this.setState({ catalogSelected: onlySelected })
  };

  selectExtras = (index) => () => {
    const extrasItems = [...this.state.extras]
    let onlySelected = []

    extrasItems[index].isSelected = !extrasItems[index].isSelected
    if (extrasItems[index].isSelected) {
      extrasItems[index].selectedIndicator = 'check'
    } else {
      extrasItems[index].selectedIndicator = ''
    }

    extrasItems.forEach(item => {
      if (item.isSelected) {
        onlySelected.push(item)
      }
    })

    this.setState({ extraSelected: onlySelected })
  };

  orderSummary = () => {
    this.setState({
      order: [this.state.catalogSelected, this.state.extraSelected]
    })
  }

  showModal = () => {
    this.setState({ modalIsOpen: true })
  }

  hideModal = () => {
    this.setState({ modalIsOpen: false })
  }

  clientData = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  incrementUnits = sku => {
    const incremetUnit = this.state.catalog.map(item => {
      if (item.sku === sku) {
        return {
          ...item,
          size: {
            ...item.size,
            units: item.size.units + 1
          }
        }
      }
      return item
    })
    this.setState({
      catalog: incremetUnit
    });
  }

  decrementUnits = sku => {
    const decremetUnit = this.state.catalog.map(item => {
      if (item.sku === sku && item.size.units > 1) {
        return {
          ...item,
          size: {
            ...item.size,
            units: item.size.units - 1
          }
        }
      }
      return item
    })
    this.setState({
      catalog: decremetUnit
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { catalogSelected, extraSelected } = this.state

    if (prevState.catalogSelected !== catalogSelected || prevState.extraSelected !== extraSelected) {
      this.orderSummary()
    }
  }


  render() {
    const { catalog, extras, order, modalIsOpen, deliveryCost, fullName, contactNumber, deliveryAddress } = this.state
    const isCombo = <div className="combo"><Icon faIcon={faStar} /><strong>Combo</strong></div>
    let productsSummary = []
    let msgOrder = []
    let totalSumary, msgCompleteOrder

    order.forEach(item => {
      item.forEach(product => {
        let msgComplete
        msgComplete = `${product.name}+${product.size ? product.size : ''}`
        productsSummary.push(product.price)
        msgOrder.push(msgComplete)
      })
    })

    totalSumary = productsSummary.reduce((orderTotal, eachProduct) => orderTotal + eachProduct, 0)
    msgCompleteOrder = msgOrder.join('+')

    return (
      <Wrapper>
        <div className="order">
          <div className="order__header">
            <div className="title">
              <Icon faIcon={faUtensils} />
              <strong>Arma tu pedido</strong>
            </div>
            <div className="tabs-link">
              <Link to="#extras" className="link">
                <Button isSubject="senary" isText="Extras" isIcon={<Icon faIcon={faCookieBite} />} />
              </Link>
              <Link to="#refreshments" className="link">
                <Button isSubject="senary" isText="Bebidas" isIcon={<Icon faIcon={faBeer} />} />
              </Link>
            </div>
          </div>
          <div className="order__catalog-selector">
            <div className="order__catalog">
              {catalog.map((item, index) => {
                return (
                  <div key={index} className={`order__catalog-item ${item.size.selectedIndicator}`} id={item.size.id}>
                    <div className="order__catalog-pic" onClick={this.selectItemHandler(index)}>
                      <div className={`toggler ${item.size.isSelected ? 'remove' : 'add'}`}>{item.size.isSelected ? <Icon faIcon={faTimesCircle} /> : <Icon faIcon={faCheckCircle} />}</div>
                      <img src={item.photo} alt={item.title} />
                    </div>
                    <div className="order__catalog-info">
                      <div className="order__catalog-info-title-size">
                        {item.isCombo ? isCombo : ''}
                        <strong className="order__catalog-info-title">{item.title}</strong>
                        {item.size.size ?
                          <div className="order__catalog-info-size">
                            <span className="size">{item.size.size}</span>
                          </div> : ''}
                      </div>
                      <p className="order__catalog-info-description">{item.description}</p>
                      <div className="order__catalog-item-price">
                        <div className="order__catalog-item-size">
                          <div className="size-price">
                            <div className="size-item">
                              <div className="price">
                                <NumberFormat value={item.size.units > 1 ? item.size.price * item.size.units : item.size.price} displayType={'text'} thousandSeparator={'.'} prefix={'$'} decimalSeparator={','} />
                              </div>
                              {item.size.isSelected ?
                                <div className="units">
                                  <span className="unit">{item.size.units}</span>
                                  <div className="quantifier" onClick={() => this.incrementUnits(item.sku)}>
                                    <Icon faIcon={faPlus} />
                                  </div>
                                  <div className="quantifier" onClick={() => this.decrementUnits(item.sku)}>
                                    <Icon faIcon={faMinus} />
                                  </div>
                                </div> : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              <span className="bottom-fade"></span>
            </div>
            <div className="order__extra" id="extras">
              <div className="order__extra-title"><strong>Extras</strong></div>
              <div className="order__extra-items">
                {extras.map((extra, index) => {
                  return (
                    <div key={index} className={"order__extra-item " + extra.selectedIndicator} onClick={this.selectExtras(index)}>
                      <div className="item-name">
                        {extra.isSelected ? <Icon faIcon={faTrashAlt} /> : ''}
                        {extra.name}
                      </div>
                      <div className="item-price">
                        <NumberFormat value={extra.price} displayType={'text'} thousandSeparator={'.'} prefix={'$'} decimalSeparator={','} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="order__action">
            <div className="order__total">
              <strong>Total</strong>
              <strong><NumberFormat value={totalSumary} displayType={'text'} thousandSeparator={'.'} prefix={'$'} decimalSeparator={','} /></strong>
            </div>
            <div className="order-notation">
              <small>Delivery no incluido</small>
            </div>
            {totalSumary === 0 ? <div className="order__submit--disable">
              <Button isSubject='quinary' isText='¿Nada aún?' isIcon={<Icon faIcon={faHandPointLeft} />} />
            </div> : <div className="order__submit" onClick={this.showModal}>
                <Button isSubject='quinary' isText='Continuar' isIcon={<Icon faIcon={faPizzaSlice} />} />
              </div>}
          </div>
          <Modal isOpen={modalIsOpen} onRequestClose={this.hideModal} className='modal__wrapper' overlayClassName='modal__layout'>
            <div className="modal__header">
              <div className="modal-title"><Icon faIcon={faClipboardList} /><strong>Información de tu pedido</strong></div>
              <div className="modal-close" onClick={this.hideModal}><Icon faIcon={faTimes} /></div>
            </div>
            <div className="modal__body">
              {order.map(category => {
                return (
                  category.map((product, index) => {
                    return (
                      <div key={index} className="modal-product">
                        <span className="product-quantity">1</span>
                        <span className="product-name">{`${product.name} ${product.size ? product.size : ''}`}</span>
                        <span className="product-price"><NumberFormat value={product.price} displayType={'text'} thousandSeparator={'.'} prefix={'$'} decimalSeparator={','} /></span>
                      </div>
                    )
                  })
                )
              })}
              <div className="order-cost">
                <div className="modal-product">
                  <span className="product-name">Delivery</span>
                  <span className="product-price"><NumberFormat value={deliveryCost} displayType={'text'} thousandSeparator={'.'} prefix={'$'} decimalSeparator={','} /></span>
                </div>
                <strong className="product-total">Total: <NumberFormat value={totalSumary + deliveryCost} displayType={'text'} thousandSeparator={'.'} prefix={'$'} decimalSeparator={','} /></strong>
              </div>
              <div className="modal-delivery">
                <div className="delivery-title"><Icon faIcon={faBicycle} /><strong>Información de despacho</strong></div>
                <div className="delivery-input">
                  <label>Nombre</label>
                  <input type="text" name="fullName" placeholder="Joaquín" onChange={this.clientData} />
                </div>
                <div className="delivery-input">
                  <label>Numero de telefono</label>
                  <input type="number" name="contactNumber" pattern="[0-9]{9}" placeholder="955555555" onChange={this.clientData} />
                </div>
                <div className="delivery-input">
                  <label>Dirección de despacho</label>
                  <input type="text" name="deliveryAddress" placeholder="Calle Nº (depto)" onChange={this.clientData} />
                </div>
              </div>
            </div>
            {(!fullName || !contactNumber || !deliveryAddress) ?
              <div className="order__submit">
                <Button isSubject='unactive' isText='Llena el formulario' isIcon={<Icon faIcon={faHandPointUp} />} />
              </div>
              :
              <div className="order__submit">
                <a href={`https://wa.me/56961420311?text=${fullName} para completar tu pedido solo debes hacer transferencia a%0A%0AMaria Antonella Perez%0ARut 25124016-7%0ACuenta cte 0215303743%0ABanco ITAU%0Amealspizza@gmail.cl%0A%0ADetalle de tu pedido%0A%0A${msgCompleteOrder}%0ATotal: $${totalSumary + deliveryCost}%0ADespacho a ${deliveryAddress}%0ANº de contacto 56${contactNumber}`}>
                  <Button isSubject='primary' isText='Confirmar pedido' isIcon={<Icon faIcon={faThumbsUp} />} />
                </a>
              </div>
            }
          </Modal>
        </div>
      </Wrapper>
    )
  }
}
