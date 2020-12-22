import React, { Component } from 'react';
import axios from 'axios';
import Button from '../../../components/buttons/Button/Button'
import Icon from '../../../components/icons/Icon'
import Spinner from '../../../components/spinner/Spinner'
import { wink } from '../../../components/emojis/Emojis'
import { UserContext } from '../../../components/context/UserContext'
import { ChromePicker } from 'react-color'
import './LocalsAdd.scss'
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const loadedPercent = (value, total) => Math.round(value / total * 100)
class LocalsAdd extends Component {

  static contextType = UserContext

  constructor(props) {
    super(props);
    this.state = {
      showForm: true,
      isLogged: null,
      user: null,
      localUser: null,
      userId: null,
      userLocals: null,
      userToken: null,
      name: null,
      address: '',
      restid: '',
      slug: '',
      categories: null,
      percent: 0,
      localLogo: null,
      localLogoPreview: null,
      resetState: false,
      localCreated: null,
      resetForm: false,
      successSubmit: false,
      currColor: '',
      colors: {
        color_1: '#FF5252',
        color_2: '#3FF0E1',
        color_3: '#EEEEEE',
        color_4: '#7835CF',
        color_5: '#FFE44D',
      },
      displayColorPicker_1: true
    }
    this.handleLocalData = this.handleLocalData.bind(this)
    this.handleDataSubmit = this.handleDataSubmit.bind(this)
    this.pickColors = this.pickColors.bind(this)
    this.colorPickerDisplay = this.colorPickerDisplay.bind(this)
  }

  handleLocalData(e) {
    const inputValue = e.target.type === 'file' ? e.target.files[0] : e.target.value

    this.setState({
      ...this.state,
      [e.target.name]: inputValue
    })

    if (e.target.type === 'file') {
      const reader = new FileReader()
      reader.readAsDataURL(inputValue)
      reader.onload = (reader) => {
        this.setState({
          localLogoPreview: reader.target.result
        })
      }
    }

  }

  pickColors(color) {
    this.setState({
      colors: { ...this.state.colors, [this.state.currColor]: color.hex }
    })
  }

  colorPickerDisplay(colorState) {
    this.setState({
      currColor: colorState
    })
  }

  async handleDataSubmit(e) {
    e.preventDefault()

    const localSlug = this.state.name.split(' ').join('_').toLowerCase()

    const res = await axios({
      method: "POST",
      url: process.env.NODE_ENV !== 'production' ? `/restaurantes` : `https://quiick-281820.rj.r.appspot.com/restaurantes`,
      data: {
        name: this.state.name,
        address: this.state.address,
        restid: this.state.restid,
        slug: localSlug,
        cats: this.state.categories,
        users: this.state.localUser,
        color_1: this.state.colors.color_1,
        color_2: this.state.colors.color_2,
        color_3: this.state.colors.color_3,
        color_4: this.state.colors.color_4,
        color_5: this.state.colors.color_5,

      },
      headers: { Authorization: `Bearer ${this.state.userToken}` }
    })

    this.setState({
      localCreated: res.data
    })

    this.handleLogoUpload(this.state.localCreated.id)

    if (res.status === 200) {
      this.setState({
        name: null,
        address: null,
        restid: null,
        slug: null,
        percent: 0,
        localLogo: null,
        localLogoPreview: null
      })
    }

    this.setState({ showForm: false })

    setTimeout(() => {
      this.setState({ showForm: true })
    }, 1000)

  }

  async handleLogoUpload(id) {
    const data = new FormData()
    data.append('files', this.state.localLogo)
    data.append('ref', 'restaurante')
    data.append('refId', `${id}`)
    data.append('field', 'avatar')

    await axios({
      method: 'POST',
      url: process.env.NODE_ENV !== 'production' ? `/upload` : `https://quiick-281820.rj.r.appspot.com/upload`,
      data,
      onUploadProgress: (progress) => this.setState({ percent: loadedPercent(progress.loaded, progress.total) }),
      headers: { Authorization: `Bearer ${this.state.userToken}` }
    })
  }

  componentDidMount() {
    const user = this.context

    this.setState({
      isLogged: user.isLogin,
      user: user.user.user.username,
      userId: user.user.user.id,
      userLocals: user.user.user.restaurantes,
      userToken: user.userToken,
      localUser: [{
        username: user.user.user.username,
        id: user.user.user.id,
        email: user.user.user.email,
        provider: user.user.user.provider,
        confirmed: user.user.user.confirmed,
        blocked: user.user.user.blocked,
        role: user.user.user.role,
        created_at: user.user.user.created_at,
        updated_at: user.user.user.updated_at,
      }],
      categories: user.user.user.categorias
    })

  }

  render() {
    const { colors, currColor, localLogoPreview, name, address, showForm } = this.state

    return (
      <div className="local__wrapper">
        {showForm ? <form className="local__form-wrapper" onSubmit={this.handleDataSubmit}>
          <div className="local__identifier-wrapper">
            <div className="local__form-element local__logo-wrapper">
              <img src={`${localLogoPreview === null ? 'https://via.placeholder.com/100' : localLogoPreview}`} className="local-logo" alt="Avatar" />
              <div className="local-change-logo"><Icon faIcon={faPlus} /></div>
              <input type="file" name="localLogo" onChange={this.handleLocalData} />
            </div>
            <div className="identifier-welcome">
              <div className="identifier-name">Bienvenidos a <strong>{name === null || name === '' ? 'Tu Negocio' : name}</strong></div>
              <div className="identifier-address">Ubicado en {address === null || address === '' ? 'Dirección de tu negocio' : address}</div>
            </div>
          </div>
          <div className="local__form-element">
            <label>Nombre de local</label>
            <input type="text" name="name" onChange={this.handleLocalData} placeholder="Ej: Mi Local" />
          </div>
          <div className="local__form-element">
            <label>Dirección</label>
            <input type="text" name="address" onChange={this.handleLocalData} placeholder="Ej: San Rivas 2233, local Nº 10" />
          </div>
          <div className="local__form-element">
            <label>Identificador único</label>
            <input type="text" name="restid" onChange={this.handleLocalData} placeholder="Ej: milocal01" />
          </div>
          <div className="local__colors-wrapper">
            <div className="local__color-theme-title">
              <h2 className="title">Es importante crear tu propia identidad</h2>
              <span className="instruction">Escoge 5 colores para tu negocio, solo haz click en el color que quieras cambiar y cambialo {wink}</span>
            </div>
            <div className="local__color-theme">
              <div className={`color-bucket ${currColor === 'color_1' ? 'color-selected' : ''}`} onClick={() => this.colorPickerDisplay('color_1')} style={{ background: colors.color_1 }}></div>
              <div className={`color-bucket ${currColor === 'color_2' ? 'color-selected' : ''}`} onClick={() => this.colorPickerDisplay('color_2')} style={{ background: colors.color_2 }}></div>
              <div className={`color-bucket ${currColor === 'color_3' ? 'color-selected' : ''}`} onClick={() => this.colorPickerDisplay('color_3')} style={{ background: colors.color_3 }}></div>
              <div className={`color-bucket ${currColor === 'color_4' ? 'color-selected' : ''}`} onClick={() => this.colorPickerDisplay('color_4')} style={{ background: colors.color_4 }}></div>
              <div className={`color-bucket ${currColor === 'color_5' ? 'color-selected' : ''}`} onClick={() => this.colorPickerDisplay('color_5')} style={{ background: colors.color_5 }}></div>
            </div>
            <div className="local__color-picker">
              {currColor !== ''
                ? <div className="chrome-color-picker">{<ChromePicker color={colors.[currColor]} onChangeComplete={this.pickColors} />}</div>
                : <div className="chrome-color-picker unactive">{<ChromePicker color={colors.[currColor]} onChangeComplete={this.pickColors} />}</div>}
            </div>
          </div>
          <Button isSubject="primary" isType="submit" isText="Añadir local" />
        </form> : <Spinner />}
      </div>
    );
  }
}

export default LocalsAdd;
