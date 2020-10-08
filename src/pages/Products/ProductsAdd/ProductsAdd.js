import React, { Component } from 'react';
import axios from 'axios'
import { UserContext } from '../../../components/context/UserContext'
import Icon from '../../../components/icons/Icon'
import Spinner from '../../../components/spinner/Spinner'
import Button from '../../../components/buttons/Button/Button';
import { ReactComponent as CloudIconSuccess } from '../../../assets/icons/cloud-success.svg'
import { ReactComponent as CloudIcon } from '../../../assets/icons/cloud-face.svg'
import { faTrashAlt, faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import './ProductsAdd.scss'

const loadedPercent = (value, total) => Math.round(value / total * 100)

class ProductsAdd extends Component {

  static contextType = UserContext

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      userId: null,
      userToken: null,
      userLocals: null,
      userCategories: null,
      prodCreated: null,
      percent: 0,
      title: null,
      name: null,
      sku: null,
      description: null,
      promo: false,
      price_before: 0,
      price_now: 0,
      picture: null,
      stock: 100,
      categorias: null,
      picFileName: null,
      restaurantes: [],
      activeSelections: [],
      resetState: false,
      resetForm: false,
      successSubmit: false
    }

    this.picFile = React.createRef()
    this.handleProdData = this.handleProdData.bind(this)
    this.handleDataSubmit = this.handleDataSubmit.bind(this)
    this.handleSelectionData = this.handleSelectionData.bind(this)
    this.handleImageUpload = this.handleImageUpload.bind(this)
    this.setLocals = this.setLocals.bind(this)
    this.checkDoubles = this.checkDoubles.bind(this)
    this.removeProdPic = this.removeProdPic.bind(this)
  }


  handleProdData(e) {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.type === 'file' ? e.target.files[0] : e.target.value
    })
  }

  handleSelectionData(e) {

    if (e.target.name === 'categorias') {
      this.state.userCategories.forEach(item => {
        if (e.target.value === item.categoria) {
          this.setState({
            ...this.state,
            categorias: [item]
          })
        }
      })
    } else if (e.target.name === 'restaurantes') {
      this.state.userLocals.forEach(item => {
        if (e.target.value === item.name) {
          this.setState({
            ...this.state,
            restaurantes: item
          })
        }
      })
    }

  }

  async handleDataSubmit(e) {
    e.preventDefault()

    const prodData = await axios({
      method: 'POST',
      url: process.env.NODE_ENV !== 'production' ? `/productos` : `https://quiick-281820.rj.r.appspot.com/productos`,
      data: {
        title: this.state.title,
        name: this.state.name,
        sku: this.state.sku,
        description: this.state.description,
        promo: this.state.promo,
        price_before: this.state.price_before,
        price_now: this.state.price_now,
        stock: this.state.stock,
        categorias: this.state.categorias,
        restaurantes: this.state.restaurantes.length <= 1 ? this.state.restaurantes[0] : this.state.restaurantes,
      },
      headers: { Authorization: `Bearer ${this.state.userToken}` }
    })

    this.setState({
      prodCreated: prodData.data
    })

    this.handleImageUpload(this.state.prodCreated.id)


    if (prodData.status === 200) {
      this.setState({
        prodCreated: null,
        title: null,
        name: null,
        sku: null,
        description: null,
        promo: false,
        price_before: 0,
        price_now: 0,
        picture: null,
        stock: 100,
        picFileName: null,
        restaurantes: [],
        activeSelections: [],
        resetState: false,
        resetForm: true,
        successSubmit: true
      })

      setTimeout(() => {
        this.setState({
          resetForm: false,
          successSubmit: false,
          percent: 0
        })
      }, 1000)
    }
  }

  async handleImageUpload(id) {
    const data = new FormData()
    data.append('files', this.state.picture)
    data.append('ref', 'producto')
    data.append('refId', `${id}`)
    data.append('field', 'picture')

    await axios({
      method: 'POST',
      url: process.env.NODE_ENV !== 'production' ? `/upload` : `https://quiick-281820.rj.r.appspot.com/upload`,
      data,
      onUploadProgress: (progress) => this.setState({ percent: loadedPercent(progress.loaded, progress.total) }),
      headers: { Authorization: `Bearer ${this.state.userToken}` }
    })
  }

  setLocals(local) {
    const { restaurantes } = this.state
    const promise = [...restaurantes]
    const selected = []

    this.checkDoubles(promise, local)

    promise.forEach(item => {
      selected.push(item.restid)
    })

    this.setState({
      restaurantes: promise,
      activeSelections: selected
    })

  }

  checkDoubles(arr, item) {
    const index = arr.indexOf(item)
    if (index !== -1) {
      arr.splice(index, 1)
    } else {
      arr.push(item)
    }
  }

  removeProdPic() {

    this.setState({
      resetState: true,
      picture: null,
      picFileName: null
    })

    setTimeout(() => {
      this.setState({
        resetState: false,
      })
    }, 500)

  }

  componentDidMount() {
    const user = this.context

    this.setState({
      isLogged: user.isLogin,
      user: user.user.user.username,
      userId: user.user.user.id,
      userCategories: user.user.user.categorias,
      userLocals: user.user.user.restaurantes,
      categorias: [user.user.user.categorias[0]],
      userToken: user.userToken
    })

  }

  componentDidUpdate(prevProps, prevState) {
    const { picture } = this.state

    if (prevState.picture !== picture) {
      if (picture !== null && this.picFile !== null) {
        this.setState({
          picFileName: this.picFile.current.files[0].name
        })
      }

      if (this.picFile === null) {
        this.setState({
          picFileName: null
        })
      }
    }
  }

  render() {
    const { percent, userLocals, userCategories, activeSelections, picFileName, picture, resetState, resetForm, successSubmit } = this.state

    return (
      !resetForm ?
        <div className="product__wrapper">
          <form className="product__form-wrapper" onSubmit={this.handleDataSubmit}>
            <div className="product__form">
              <div className="product__form-element">
                <label>Nombre de producto</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Ej: Malteada de chocolate"
                  onChange={this.handleProdData}
                />
              </div>
              <div className="product__form-element">
                <label>Título de producto</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Ej: Malteada de chocolate y vainilla"
                  onChange={this.handleProdData}
                />
              </div>
              <div className="product__form-element">
                <label>Código único (SKU)</label>
                <input
                  type="text"
                  name="sku"
                  placeholder="Ej: 123"
                  onChange={this.handleProdData}
                />
              </div>
              <div className="product__form-element">
                <label>Categoría asociada</label>
                <select
                  name="categorias"
                  onChange={this.handleSelectionData}>
                  {userCategories !== null ?
                    userCategories.map(category => {
                      return (
                        <option key={category.id} name={category.categoria}>{category.categoria}</option>
                      )
                    }) : null
                  }
                </select>
              </div>
              <div className="product__form-element">
                <label>Precio ahora</label>
                <input
                  type="number"
                  name="price_now"
                  placeholder="Ej: $1.200"
                  onChange={this.handleProdData}
                />
              </div>
              <div className="product__form-element">
                <label>Precio antes (solo si aplica)</label>
                <input
                  type="number"
                  name="price_before"
                  placeholder="Ej: $1.500"
                  onChange={this.handleProdData}
                />
              </div>
              <div className="product__form-element">
                <label>¿Producto especial?</label>
                <select
                  name="promo"
                  onChange={this.handleProdData}>
                  <option value="true">Si</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="product__form-element">
                <label>Stock disponible</label>
                <input
                  type="number"
                  name="stock"
                  placeholder="Ej: 100"
                  onChange={this.handleProdData}
                />
              </div>
            </div>
            <div>
              <div className="product__form-element product__form-element-full product-form-local-relation">
                <label>Selecciona que local dispondrán de este producto</label>
                {userLocals !== null ?
                  userLocals.map(local => {
                    return (
                      <div key={local.restid} className={`product__form-local-selector ${activeSelections.includes(local.restid) ? 'local-selected' : ''}`} onClick={() => this.setLocals(local)}>
                        <strong>{local.name}</strong>
                        <div className={`switch__selector-wrapper ${activeSelections.includes(local.restid) ? 'switch__selector-wrapper--active' : 'switch__selector-wrapper--deactive'}`}>
                          <div className={`switch ${activeSelections.includes(local.restid) ? 'switch--right' : 'switch--left'}`}></div>
                        </div>
                      </div>)
                  }) : null
                }
              </div>
              <div className="product__form-element product__form-element-full product-form-attach-file">
                {picture !== null
                  ? <div className="indicator"><CloudIconSuccess /><span>Imagen agregada con éxito</span></div>
                  : <div className="indicator"><CloudIcon /><span>Arrastra la imagen o haz click aquí para cargarla</span></div>
                }
                {resetState ? <Spinner /> :
                  <input
                    type="file"
                    name="picture"
                    ref={this.picFile}
                    accept="image/png, image/jpeg"
                    onChange={this.handleProdData}
                  />}
                {picture !== null ?
                  <div className="product-form-file">
                    <div className="product-form-file-name">{<Icon faIcon={faCheckCircle} />}{picFileName}</div>
                    <div className="product-form-remove-file" onClick={this.removeProdPic}>{<Icon faIcon={faTrashAlt} />}</div>
                  </div> : null
                }
              </div>
              <div className="product__form-element product__form-element-full product-form-textarea">
                <textarea
                  name="description"
                  onChange={this.handleProdData}
                  placeholder="Escribe una breve descripción..."
                />
              </div>
              {percent !== 0 ?
                <div className="product-form-file-progress">
                  <span className="progress-bar" style={{ width: `%` }} />
                </div>
                : null}
              <div className="product-form-submit">
                <Button isSubject="senary" isText="Crear producto" isType="submit" />
              </div>
            </div>
          </form>
        </div> :
        <div className="product-form-restart">
          <Spinner>
            {successSubmit ? <div><strong>¡Producto agregado!</strong></div> : null}
          </Spinner>
        </div>
    );
  }
}

export default ProductsAdd;
