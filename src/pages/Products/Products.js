import React, { useState } from "react";
import ProductsAdd from "./ProductsAdd/ProductsAdd";
import ProductsList from "./ProductsList/ProductsList";
import Icon from "../../components/icons/Icon";
import Button from "../../components/buttons/Button/Button";
import "./Products.scss";
import { faEye, faPizzaSlice, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";

export default function Products() {
  const [addProducts, setAddProducts] = useState(false);
  const [removeProducts, setRemoveProducts] = useState(false);
  const [removeReady, setRemoveReady] = useState(false);

  const addProductsHandler = () => {
    setAddProducts(!addProducts);
  };

  const removeProductsHandler = () => {
    setRemoveProducts(!removeProducts);
  };

  const readyToRemoveHandler = () => {
    setRemoveReady(true);
    setTimeout(() => {
      setRemoveReady(false);
    }, 1000);
  };

  return (
    <div className="products__wrapper">
      <div className="products__top-menu">
        {!removeProducts ? (
          <Button
            isSubject="quinary"
            plusClass={`${addProducts ? "products-menu--selected" : ""}`}
            isText={`${addProducts ? "Ocultar panel" : "Agregar producto"}`}
            isIcon={
              addProducts ? <Icon faIcon={faEye} /> : <Icon faIcon={faPlus} />
            }
            clickOn={addProductsHandler}
          />
        ) : null}
        {!addProducts ? (
          <Button
            isSubject="quinary"
            plusClass={`${removeProducts ? "products-menu--selected" : ""}`}
            isText={`${
              removeProducts ? "Ocultar panel" : "Seleccionar productos"
            }`}
            isIcon={
              removeProducts ? (
                <Icon faIcon={faEye} />
              ) : (
                <Icon faIcon={faPizzaSlice} />
              )
            }
            clickOn={removeProductsHandler}
          />
        ) : null}
        {removeProducts ? (
          <Button
            isSubject="quaternary"
            isText="Eliminar productos"
            isIcon={<Icon faIcon={faTrashAlt} />}
            clickOn={readyToRemoveHandler}
          />
        ) : null}
      </div>
      {addProducts ? (
        <ProductsAdd />
      ) : (
        <ProductsList
          removeProducts={removeProducts}
          isRemove={removeReady}
          displayProductsAddition={() => console.log("test")}
        />
      )}
    </div>
  );
}
