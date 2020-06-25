import React, { Component } from 'react'
import Wrapper from '../../components/wrapper/Wrapper'
import NumberFormat from 'react-number-format'
import Icon from '../../components/icons/Icon'
import { faPizzaSlice, faUtensils, faThumbsUp, faBeer } from '@fortawesome/free-solid-svg-icons'
import './Menu.scss'

export default class Menu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pizzas: [
        {
          name: 'De la casa',
          description: 'Mozzarella, carne, tocino, cebolla y base bbq',
          sizes: [
            { size: 'M', price: 8990 },
            { size: 'L', price: 10990 },
            { size: 'XL', price: 13490 }
          ]
        },
        {
          name: 'Hawaiana',
          description: 'Mozzarella, piña y jamón',
          sizes: [
            { size: 'M', price: 8990 },
            { size: 'L', price: 10990 },
            { size: 'XL', price: 12490 }
          ]
        },
        {
          name: 'Pollo champiñón',
          description: 'Mozzarella, pollo y champiñón',
          sizes: [
            { size: 'M', price: 7990 },
            { size: 'L', price: 9990 },
            { size: 'XL', price: 12990 }
          ]
        },
        {
          name: 'Montañera',
          description: 'Mozzarella, carne, tocino, choclo y maduro',
          sizes: [
            { size: 'M', price: 9990 },
            { size: 'L', price: 11490 },
            { size: 'XL', price: 13490 }
          ]
        },
        {
          name: 'Pollo bbq',
          description: 'Mozzarella, pollo, tocino, cebolla, base bbq',
          sizes: [
            { size: 'M', price: 7990 },
            { size: 'L', price: 9990 },
            { size: 'XL', price: 12490 }
          ]
        },
        {
          name: 'Italiana',
          description: 'Mozzarella, churrasco, tomate y palta',
          sizes: [
            { size: 'M', price: 8990 },
            { size: 'L', price: 10990 },
            { size: 'XL', price: 12990 }
          ]
        },
        {
          name: 'Napolitana',
          description: 'Mozzarella, tomate y orégano',
          sizes: [
            { size: 'M', price: 6990 },
            { size: 'L', price: 8990 },
            { size: 'XL', price: 10490 }
          ]
        },
        {
          name: 'Pepperoni',
          description: 'Extra mozzarella y pepperoni',
          sizes: [
            { size: 'M', price: 4990 },
            { size: 'L', price: 8990 },
            { size: 'XL', price: 10490 }
          ]
        },
        {
          name: 'Solo queso',
          description: 'Extra de mozzarella',
          sizes: [
            { size: 'M', price: 4990 },
            { size: 'L', price: 6990 },
            { size: 'XL', price: 8990 }
          ]
        },
        {
          name: 'Vegetariana',
          description: 'Mozzarella, tomate, pimentón verde, choclo y champiñón',
          sizes: [
            { size: 'M', price: 7990 },
            { size: 'L', price: 9990 },
            { size: 'XL', price: 12990 }
          ]
        },
        {
          name: 'Vegana',
          description: 'Queso vegano, pimentón verde, choclo, aceituna y tomate',
          sizes: [
            { size: 'M', price: 8990 },
            { size: 'L', price: 10990 },
            { size: 'XL', price: 13490 }
          ]
        },
      ],
      lasanas: [
        {
          name: 'Lasaña de pollo',
          description: 'Pasta, salsa bechamel, pollo y queso',
          price: 5490
        },
        {
          name: 'Lasaña de carne vacuno',
          description: 'Pasta, salsa bechamel, carne y queso',
          price: 5490
        },
        {
          name: 'Lasaña mixta',
          description: 'Pasta, salsa bechamel, pollo, carne, queso',
          price: 5490
        },
        {
          name: 'Lasaña tropical',
          description: 'Pasta, salsa bechamel, piña, pollo, jamón, choclo y queso',
          price: 5490
        }
      ],
      extras: [
        {
          name: 'Salsa BBQ spicy',
          price: 300
        },
        {
          name: 'Salsa de ajo',
          price: 300
        },
        {
          name: 'Salsa BBQ',
          price: 300
        },
        {
          name: 'Salsa de pizza',
          price: 300
        },
        {
          name: 'Extra de queso',
          price: 800
        },
        {
          name: 'Pimentón verde',
          price: 800
        },
        {
          name: 'Champiñón',
          price: 800
        },
        {
          name: 'Palta',
          price: 800
        },
        {
          name: 'Maduro',
          price: 800
        },
        {
          name: 'Aceitunas',
          price: 800
        },
        {
          name: 'Choclo',
          price: 800
        },
        {
          name: 'Tocino',
          price: 800
        },
        {
          name: 'Pollo',
          price: 800
        },
        {
          name: 'Borde de queso',
          price: 1990
        },
        {
          name: 'Palitos de ajo',
          price: 2990
        },
        {
          name: 'Palitos tropicales',
          price: 4490
        },
      ],
      refreshments: [
        {
          name: 'Coca cola normal lata',
          price: 1000
        },
        {
          name: 'Fanta zero lata',
          price: 1000
        },
        {
          name: 'Sprite light lata',
          price: 1000
        },
        {
          name: 'Coca cola normal 1.5lts',
          price: 2490
        },
        {
          name: 'Fanta zero 1.5lts',
          price: 2490
        },
        {
          name: 'Sprite light 1.5lts',
          price: 2490
        }
      ]
    }
  }

  render() {
    const { pizzas, lasanas, extras, refreshments } = this.state

    return (
      <Wrapper>
        <div className="menu">
          <div className="menu__wrapper">
            <div className="menu-category">
              <div className="menu-title"><Icon faIcon={faPizzaSlice} /><strong>Pizzas</strong></div>
              <ul className="menu-items">
                {pizzas.map(item => {
                  return (
                    <li className="menu-item">
                      <div className="menu-item-name">
                        <strong>{item.name}</strong>
                      </div>
                      <div className="menu-item-description">
                        <span>{item.description}</span>
                      </div>
                      {item.sizes.map(each => {
                        return (
                          <div className="menu-size-price">
                            <div className="menu-size">{each.size}</div>
                            <div className="menu-price"><NumberFormat value={each.price} displayType={'text'} thousandSeparator={'.'} prefix={'$'} decimalSeparator={','} /></div>
                          </div>)
                      })}
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="menu-category">
              <div className="menu-title"><Icon faIcon={faUtensils} /><strong>Lasañas</strong></div>
              <ul className="menu-items">
                {lasanas.map(item => {
                  return (
                    <li className="menu-item">
                      <div className="menu-item-name">
                        <strong>{item.name}</strong>
                      </div>
                      <div className="menu-item-price">
                        <strong className="menu-price"><NumberFormat value={item.price} displayType={'text'} thousandSeparator={'.'} prefix={'$'} decimalSeparator={','} /></strong>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="menu-category">
              <div className="menu-title"><Icon faIcon={faThumbsUp} /><strong>Extras</strong></div>
              <ul className="menu-items">
                {extras.map(item => {
                  return (
                    <li className="menu-item">
                      <div className="menu-item-name">
                        <strong>{item.name}</strong>
                      </div>
                      <div className="menu-item-price">
                        <strong className="menu-price"><NumberFormat value={item.price} displayType={'text'} thousandSeparator={'.'} prefix={'$'} decimalSeparator={','} /></strong>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="menu-category">
              <div className="menu-title"><Icon faIcon={faBeer} /><strong>Bebidas</strong></div>
              <ul className="menu-items">
                {refreshments.map(item => {
                  return (
                    <li className="menu-item">
                      <div className="menu-item-name">
                        <strong>{item.name}</strong>
                      </div>
                      <div className="menu-item-price">
                        <strong className="menu-price"><NumberFormat value={item.price} displayType={'text'} thousandSeparator={'.'} prefix={'$'} decimalSeparator={','} /></strong>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </Wrapper>
    )
  }
}
