import React, { Component } from "react";
import { UserContext } from "../../../components/context/UserContext";
import Button from "../../../components/buttons/Button/Button";
import axios from "axios";
import "./CategoriesAdd.scss";
import Icon from "../../../components/icons/Icon";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faEye, faEyeSlash, faTimes } from "@fortawesome/free-solid-svg-icons";
import Spinner from "../../../components/spinner/Spinner";

export default class CategoriesAdd extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      categoria: null,
      user: null,
      userId: null,
      userCategories: [],
      userLocals: null,
      userToken: null,
      addNewCat: false,
      removeCategory: false,
    };
    this.handleCatData = this.handleCatData.bind(this);
    this.submitNewCategory = this.submitNewCategory.bind(this);
    this.removeCategory = this.removeCategory.bind(this);
    this.listCurrentCategories = this.listCurrentCategories.bind(this);
    this.renderAddNewCat = this.renderAddNewCat.bind(this);
    this.addNewCatForm = this.addNewCatForm.bind(this);
    this.displayRemoveButton = this.displayRemoveButton.bind(this);
  }

  handleCatData(e) {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
    });
  }

  async submitNewCategory(e) {
    e.preventDefault();

    const newCat = await axios({
      method: "POST",
      url:
        process.env.NODE_ENV !== "production"
          ? `/categorias`
          : `https://quiick-281820.rj.r.appspot.com/categorias`,
      data: {
        categoria: this.state.categoria,
        restaurantes: this.state.userLocals,
        users: this.state.user,
      },
      headers: { Authorization: `Bearer ${this.state.userToken}` },
    });

    if (newCat.status === 200) {
      this.setState({
        categoria: null,
        userCategories: [...this.state.userCategories, newCat.data],
      });
    }
  }

  async removeCategory(catId) {
    const removeCat = await axios({
      method: "DELETE",
      url:
        process.env.NODE_ENV !== "production"
          ? `/categorias/${catId}`
          : `https://quiick-281820.rj.r.appspot.com/categorias/${catId}`,
      headers: { Authorization: `Bearer ${this.state.userToken}` },
    });

    const updateCats = await axios({
      method: "GET",
      url:
        process.env.NODE_ENV !== "production"
          ? `/categorias`
          : `https://quiick-281820.rj.r.appspot.com/categorias`,
    });

    if (removeCat.status === 200) {
      this.setState({
        userCategories: updateCats.data,
      });
    }
  }

  listCurrentCategories() {
    const { userCategories, removeCategory } = this.state;
    if (userCategories !== null) {
      return userCategories.map((category, index) => {
        return (
          <li className="item" key={index}>
            <strong>{category.categoria}</strong>
            {removeCategory ? (
              <Button
                isSubject="secondary"
                clickOn={() => this.removeCategory(category.id)}
                isIcon={<Icon faIcon={faTrashAlt} />}
                plusClass="item--remove"
              />
            ) : null}
          </li>
        );
      });
    }
  }

  addNewCatForm() {
    const { addNewCat } = this.state;
    if (addNewCat) {
      return (
        <form
          className="category-add__new-category"
          onSubmit={this.submitNewCategory}
        >
          <input
            type="text"
            name="categoria"
            placeholder="Ej: Bebidas frías"
            onChange={this.handleCatData}
          />
          <Button
            isSubject="primary"
            isText="Añadir nueva categoría"
            isType="submit"
          />
        </form>
      );
    } else return null;
  }

  renderAddNewCat() {
    this.setState({
      addNewCat: !this.state.addNewCat,
    });
  }

  displayRemoveButton() {
    this.setState({ removeCategory: !this.state.removeCategory });
  }

  componentDidMount() {
    const user = this.context;

    this.setState({
      isLogged: user.isLogin,
      user: user.user.user,
      userId: user.user.user.id,
      userCategories: user.user.user.categorias,
      userLocals: user.user.user.restaurantes,
      userToken: user.userToken,
    });

    this.listCurrentCategories();
  }

  render() {
    const { userCategories, addNewCat, removeCategory } = this.state;
    return (
      <div className="category-add__wrapper">
        <div className="product-list__top-menu">
          <strong>
            Tienes {userCategories !== null ? userCategories.length : "0"}{" "}
            categorías
          </strong>
          <div>
            <div className="options-menu">
              <Button
                isSubject="quinary"
                isText={addNewCat ? "Ocultar panel" : "Añadir nueva categoría"}
                plusClass={`button button--quinary menu-option ${
                  addNewCat ? "option-selected" : ""
                }`}
                clickOn={this.renderAddNewCat}
              />

              {removeCategory ? (
                <div onClick={this.displayRemoveButton}>
                  <Icon faIcon={faTimes} />
                </div>
              ) : (
                <div onClick={this.displayRemoveButton}>
                  <Icon faIcon={faTrashAlt} />
                </div>
              )}
            </div>
            {/* {`${!removeSwitch ? "Seleccionar productos" : "Cancelar"}`} */}
          </div>
        </div>

        {this.addNewCatForm()}
        <div className="category-add__list">
          <ul className="category-add__list-items">
            {this.listCurrentCategories()}
          </ul>
        </div>
      </div>
    );
  }
}
