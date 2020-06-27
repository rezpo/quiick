import React, { Component } from 'react'
import Wrapper from '../../components/wrapper/Wrapper'
import Button from '../../components/buttons/Button/Button'
import Icon from '../../components/icons/Icon'
import { faPizzaSlice, faBicycle, faThumbsUp, faHandPointUp, faUtensils, faClipboardList, faTimes, faBeer, faCookieBite, faHandPointLeft, faPlus, faMinus, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
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
          title: 'Producto 1',
          sku: '1',
          description: 'Occaecat incididunt ea irure elit non qui deserunt nostrud nisi.',
          spec: { promo: true, units: 1, price: 13990, id: 'CMB0', selectedIndicator: '', isSelected: false, name: 'Oferta de la casa' },
        },
        {
          photo: 'https://www.dropbox.com/s/8ygdc40kho0mw3z/cmb1.jpg?raw=1',
          title: 'Producto 2',
          sku: '2',
          description: 'Duis veniam consequat consectetur incididunt labore ea labore laboris ad proident dolore non commodo.',
          spec: { promo: true, units: 1, price: 14990, id: 'CMB1', selectedIndicator: '', isSelected: false, name: 'Combo 1' },
        },
        {
          photo: 'https://www.dropbox.com/s/x95pvubgbnteirk/cmb2.jpg?raw=1',
          title: 'Producto 3',
          sku: '3',
          description: 'Culpa eiusmod culpa commodo dolore ad tempor incididunt fugiat ea nostrud nulla.',
          spec: { promo: false, units: 1, price: 19490, id: 'CMB2', selectedIndicator: '', isSelected: false, name: 'Combo 2' },
        },
        {
          photo: 'https://www.dropbox.com/s/6g07pe66pip7are/cmb3.jpg?raw=1',
          title: 'Producto 4',
          sku: '4',
          description: 'Nostrud velit pariatur excepteur aliquip mollit.',
          spec: { promo: true, units: 1, price: 19490, id: 'CMB3', selectedIndicator: '', isSelected: false, name: 'Combo 3' },
        },
      ],
      catalogSelected: [],
      totalOrder: 0,
      deliveryCost: 0,
      deliveryAddress: '',
      deliveryProvince: undefined,
      provinces: [
        {
          name: 'Selecciona una comuna'
        },
        {
          name: 'Santiago',
          cost: 300
        },
        {
          name: 'Conchalí',
          cost: 300
        },
        {
          name: 'Huechuraba',
          cost: 300
        },
        {
          name: 'Independencia',
          cost: 300
        },
        {
          name: 'Quilicura',
          cost: 300
        },
        {
          name: 'Recoleta',
          cost: 300
        },
        {
          name: 'Renca',
          cost: 300
        },
        {
          name: 'Las Condes',
          cost: 300
        },
        {
          name: 'Lo Barnechea',
          cost: 300
        },
        {
          name: 'Providencia',
          cost: 300
        },
        {
          name: 'Vitacura',
          cost: 300
        },
        {
          name: 'La Reina',
          cost: 300
        },
        {
          name: 'Macul',
          cost: 300
        },
        {
          name: 'Ñuñoa',
          cost: 300
        },
        {
          name: 'Peñalolén',
          cost: 300
        },
        {
          name: 'La Florida',
          cost: 300
        },
        {
          name: 'La Granja',
          cost: 300
        },
        {
          name: 'El Bosque',
          cost: 300
        },
        {
          name: 'La Cisterna',
          cost: 300
        },
        {
          name: 'La Pintana',
          cost: 300
        },
        {
          name: 'San Ramón',
          cost: 300
        },
        {
          name: 'Lo Espejo',
          cost: 300
        },
        {
          name: 'Pedro Aguirre Cerda',
          cost: 300
        },
        {
          name: 'San Joaquín',
          cost: 300
        },
        {
          name: 'San Miguel',
          cost: 300
        },
        {
          name: 'Cerrillos',
          cost: 300
        },
        {
          name: 'Estación Central',
          cost: 300
        },
        {
          name: 'Maipú',
          cost: 300
        },
        {
          name: 'Cerro Navia',
          cost: 300
        },
        {
          name: 'Lo Prado',
          cost: 300
        },
        {
          name: 'Pudahuel',
          cost: 300
        },
        {
          name: 'Quinta Normal',
          cost: 300
        },
      ],
      modalIsOpen: false,
      fullName: '',
      contactNumber: '',
    }
  }

  selectItemHandler = (id) => {
    const catalogItems = [...this.state.catalog]
    let onlySelected = []
    let totalAmount = []
    let deliveryMsg = []

    catalogItems.forEach(i => {
      if (i.spec.id === id) {
        i.spec.isSelected = !i.spec.isSelected
        if (i.spec.isSelected) {
          i.spec.selectedIndicator = 'check'
        } else {
          i.spec.selectedIndicator = ''
        }
      }
    })

    catalogItems.forEach(i => {
      if (i.spec.isSelected) {
        onlySelected.push(i.spec)
      }
    })

    catalogItems.forEach(i => {
      if (i.spec.isSelected) {
        totalAmount.push(i.spec.price * i.spec.units)
      }
    })

    this.setState({ catalogSelected: onlySelected})
    this.setState({ totalOrder: totalAmount.reduce((orderTotal, eachProduct) => orderTotal + eachProduct, 0) })
  }

  showModal = () => {
    this.setState({ modalIsOpen: true })
  }

  hideModal = () => {
    this.setState({ modalIsOpen: false })
  }

  clientData = (e) => {
    let provinceCost

    this.setState({
      [e.target.name]: e.target.value
    })

    this.state.provinces.map(province => {

      if (e.target.value === province.name) {
        provinceCost = province.cost
      }
      return provinceCost
    })

    this.setState({
      deliveryCost: provinceCost
    })
  }

  incrementUnits = sku => {
    const incremetUnit = this.state.catalog.map(item => {
      if (item.sku === sku) {
        return {
          ...item,
          spec: {
            ...item.spec,
            units: item.spec.units + 1
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
      if (item.sku === sku && item.spec.units > 1) {
        return {
          ...item,
          spec: {
            ...item.spec,
            units: item.spec.units - 1
          }
        }
      }
      return item
    })
    this.setState({
      catalog: decremetUnit
    });
  }

  toLowerCase = string => {
    string.toLowerCase()
  }

  componentDidUpdate(prevProps, prevState) {
    const { catalogSelected, catalog } = this.state
    let summaryTotal = []

    if (prevState.catalog !== catalog) {
      catalog.map(item => {
        catalogSelected.forEach(selected => {
          if (item.spec.id === selected.id) {
            selected.units = item.spec.units
            summaryTotal.push(selected.price * selected.units)
          }
        })
        return summaryTotal
      })

      if (catalogSelected.length >= 1) {
        this.setState({
          totalOrder: summaryTotal.reduce((orderTotal, eachProduct) => orderTotal + eachProduct, 0)
        })
      }
    }
  }

  render() {
    const {
      catalog,
      catalogSelected,
      totalOrder,
      modalIsOpen,
      deliveryCost,
      fullName,
      contactNumber,
      deliveryAddress,
      deliveryProvince,
      provinces } = this.state

    let resumeMsg = []

    catalogSelected.map(product => {
      let productsCount = `- ${product.units} ${product.name}`
      resumeMsg.push(productsCount)
      return resumeMsg
    })

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
                  <div key={index} className={`order__catalog-item ${item.spec.selectedIndicator}`} id={item.spec.id}>
                    <div className="order__catalog-pic" onClick={() => this.selectItemHandler(item.spec.id)}>
                      <div className={`toggler ${item.spec.isSelected ? 'remove' : 'add'}`}>{item.spec.isSelected ? <Icon faIcon={faTimesCircle} /> : <Icon faIcon={faCheckCircle} />}</div>
                      <img src={item.photo} alt={item.title} />
                    </div>
                    <div className="order__catalog-info">
                      <div className="order__catalog-info-title-spec">
                        <strong className="order__catalog-info-title">{item.title}</strong>
                        {item.spec.promo ?
                          <div className="order__catalog-info-spec">
                            <span className="spec">Promo</span>
                          </div> : ''}
                      </div>
                      <p className="order__catalog-info-description">{item.description}</p>
                      <div className="order__catalog-item-price">
                        <div className="order__catalog-item-spec">
                          <div className="spec-price">
                            <div className="spec-item">
                              <div className="price">
                                <NumberFormat value={item.spec.units > 1 && item.spec.isSelected ? item.spec.price * item.spec.units : item.spec.price} displayType={'text'} thousandSeparator={'.'} prefix={'$'} decimalSeparator={','} />
                              </div>
                              {item.spec.isSelected ?
                                <div className="units">
                                  <span className="unit">{item.spec.units}</span>
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
            </div>
          </div>
          <div className="order__action">
            <div className="order__total">
              <strong>Total</strong>
              <strong><NumberFormat value={totalOrder} displayType={'text'} thousandSeparator={'.'} prefix={'$'} decimalSeparator={','} /></strong>
            </div>
            <div className="order-notation">
              <small>Delivery no incluido</small>
            </div>
            {totalOrder === 0 ? <div className="order__submit--disable">
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
              {catalogSelected.map((product, index) => {
                return (
                  <div key={index} className="modal-product">
                    <span className="product-quantity">{product.units}</span>
                    <span className="product-name">{`${product.name} ${product.spec ? product.spec : ''}`}</span>
                    <span className="product-price"><NumberFormat value={product.price * product.units} displayType={'text'} thousandSeparator={'.'} prefix={'$'} decimalSeparator={','} /></span>
                  </div>
                )
              })}
              <div className="order-cost">
                <div className="modal-product">
                  <span className="product-name">Delivery</span>
                  <span className="product-price"><NumberFormat value={deliveryCost} displayType={'text'} thousandSeparator={'.'} prefix={'$'} decimalSeparator={','} /></span>
                </div>
                <strong className="product-total">Total: <NumberFormat value={totalOrder + deliveryCost} displayType={'text'} thousandSeparator={'.'} prefix={'$'} decimalSeparator={','} /></strong>
              </div>
              <form className="modal-delivery">
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
                <div className="delivery-input">
                  <label>Comuna de despacho</label>
                  <select value={deliveryProvince} name="deliveryProvince" onChange={this.clientData}>
                    {provinces.map((province, index) => {
                      return <option key={index} value={this.toLowerCase(province.name)}>{province.name}</option>
                    })}
                  </select>
                </div>
              </form>
            </div>
            {(!fullName || !contactNumber || !deliveryAddress || deliveryProvince === undefined) ?
              <div className="order__submit">
                <Button isSubject='unactive' isText='Llena el formulario' isIcon={<Icon faIcon={faHandPointUp} />} />
              </div>
              :
              <div className="order__submit">
                <a href={`https://wa.me/56961420311?text=${fullName} para completar tu pedido solo debes hacer transferencia a%0A%0AMaria Antonella Perez%0ARut 25124016-7%0ACuenta cte 0215303743%0ABanco ITAU%0Amealspizza@gmail.cl%0A%0ADetalle de tu pedido%0A%0A${resumeMsg.join('%0A')}%0A%0ATotal: $${totalOrder + deliveryCost}%0A%0ADespacho a ${deliveryAddress}%0ANº de contacto 56${contactNumber}`}>
                  <Button isSubject='secondary' isText='Confirmar pedido' isIcon={<Icon faIcon={faThumbsUp} />} />
                </a>
              </div>
            }
          </Modal>
        </div>
      </Wrapper>
    )
  }
}
