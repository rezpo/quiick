import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../components/context/UserContext";
import {
  faStar,
  faCircle,
  faCheckCircle,
  faTrashAlt,
} from "@fortawesome/free-regular-svg-icons";
import Icon from "../../../components/icons/Icon";
import Spinner from "../../../components/spinner/Spinner";
import Button from "../../../components/buttons/Button/Button";
import { faEye, faEyeSlash, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./ProductsList.scss";
import axios from "axios";

export default function ProductsList(props) {
  const [products, setProducts] = useState([]);
  const [locals, setLocals] = useState([]);
  const [productRemove, setProductRemove] = useState([]);
  const [removeSuccess, setRemoveSuccess] = useState(false);
  const [removeSwitch, setRemoveSwitch] = useState(false);
  const [nonProductsSelected, setNonProductsSelected] = useState(false);
  const [displayVisibility, setDisplayVisibility] = useState({
    id: null,
    status: true,
  });
  const [waitToLoad, setWaitToLoad] = useState(false);
  const { user, userToken } = useContext(UserContext);
  const { displayProductsAddition, displayProductsState } = props;

  useEffect(() => {
    const getUserLocals = async () => {
      setLocals(user.user.restaurantes);
    };
    const getProducts = async () => {
      const res = await axios.get(
        process.env.NODE_ENV !== "production"
          ? `/productos`
          : `https://quiick-281820.rj.r.appspot.com/productos`
      );
      const userLocals = [];

      res.data.forEach((item) => {
        item.restaurantes.forEach((local) => {
          locals.forEach((userlocal) => {
            if (local.restid === userlocal.restid) {
              userLocals.push(item);
            }
          });
        });
      });

      const filterProds = userLocals.reduce((acc, curr) => {
        const x = acc.find((item) => item.id === curr.id);
        if (!x) {
          return acc.concat([curr]);
        } else {
          return acc;
        }
      }, []);

      setProducts(filterProds);
    };

    const switchVisibility = async () => {
      if (displayVisibility.id !== null) {
        const res = await axios.put(
          process.env.NODE_ENV !== "production"
            ? `/productos/${displayVisibility.id}`
            : `https://quiick-281820.rj.r.appspot.com/productos/${displayVisibility.id}`,
          {
            visible: displayVisibility.status,
          },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        if (res.status === 200) {
          setWaitToLoad(true);
          setWaitToLoad(false);
          setDisplayVisibility({ id: null, status: true });
        }
      }
    };

    if (productRemove.length <= 0) {
      setNonProductsSelected(true);
    } else {
      setNonProductsSelected(false);
    }

    getUserLocals();
    getProducts();
    switchVisibility();
  }, [
    products,
    user,
    nonProductsSelected,
    displayVisibility,
    userToken,
    locals,
    productRemove,
  ]);

  const switchRemoveHandler = () => {
    setRemoveSwitch(!removeSwitch);
  };

  const deleteSelected = () => {
    productRemove.forEach(async (item) => {
      const res = await axios.delete(
        process.env.NODE_ENV !== "production"
          ? `/productos/${item}`
          : `https://quiick-281820.rj.r.appspot.com/productos/${item}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (res.status === 200) {
        setRemoveSuccess(true);
        setProductRemove([]);

        setTimeout(() => {
          setRemoveSuccess(false);
        }, 800);
      }
    });
  };

  const addProductToRemove = (id) => {
    const current = [...productRemove];
    current.push(id);
    setProductRemove(current);
  };

  const removeProductToRemove = (id) => {
    const current = [...productRemove];
    const indexOfId = current.indexOf(id);

    if (indexOfId > -1) {
      current.splice(indexOfId, 1);
    }

    setProductRemove(current);
  };

  const setProductVisibility = (id, status) => {
    setDisplayVisibility({ id, status });
  };

  return (
    <div>
      <div className="product-list__top-menu">
        <strong>Tienes {products.length} productos</strong>
        <div>
          <div className="options-menu">
            <Button
              isSubject="quinary"
              isText={`${
                displayProductsState ? "Ocultar panel" : "Añadir productos"
              }`}
              plusClass={`menu-option ${
                displayProductsState ? "option-selected" : null
              }`}
              clickOn={displayProductsAddition}
            />
            {productRemove.length > 0 ? (
              <Button
                isSubject="quaternary"
                isText="Eliminar productos"
                clickOn={deleteSelected}
                plusClass="menu-option"
              />
            ) : null}
            {removeSwitch ? (
              <div onClick={switchRemoveHandler}>
                <Icon faIcon={faTimes} />
              </div>
            ) : (
              <div onClick={switchRemoveHandler}>
                <Icon faIcon={faTrashAlt} />
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        {nonProductsSelected && productRemove.length > 0 ? (
          <div>
            Tienes <b>{productRemove.length}</b> productos seleccionados{" "}
          </div>
        ) : null}
      </div>
      <div className="product-list__wrapper">
        {removeSuccess ? (
          <Spinner />
        ) : (
          products.map((product) => {
            return (
              <div
                key={product.id}
                className={`product-list__product ${
                  productRemove.includes(product.id) ? "selected-product" : ""
                }`}
              >
                {waitToLoad ? <Spinner /> : null}
                {removeSwitch && !productRemove.includes(product.id) ? (
                  <div
                    className="remove-product"
                    onClick={() => addProductToRemove(product.id)}
                  >
                    <Icon faIcon={faCircle} />
                  </div>
                ) : null}
                {productRemove && productRemove.includes(product.id) ? (
                  <div
                    className="remove-product"
                    onClick={() => removeProductToRemove(product.id)}
                  >
                    <Icon faIcon={faCheckCircle} />
                  </div>
                ) : null}
                <div className="product-list__picture">
                  {product.picture ? (
                    <img src={product.picture.url} alt={product.title} />
                  ) : (
                    <Spinner />
                  )}
                  {product.promo ? (
                    <div className="highlight-product">
                      <Icon faIcon={faStar} />
                    </div>
                  ) : null}
                </div>
                <div className="product-list__detail">
                  <div className="product-list__spec">
                    <div className="spec-name">
                      <div className="name-sku">
                        <strong>{product.name}</strong>
                        <div
                          className={`sku-product ${
                            productRemove.includes(product.id)
                              ? "selected-id-product"
                              : ""
                          }`}
                        >
                          {product.sku}
                        </div>
                      </div>
                      <small>{product.title}</small>
                    </div>
                    <small className="spec-description">
                      {product.description}
                    </small>
                  </div>
                  <div className="product-list__prices">
                    <div className="item">
                      <strong>Precio antes</strong>
                      <span>{product.price_before}</span>
                    </div>
                    <div className="item">
                      <strong>Precio ahora</strong>
                      <span>{product.price_now}</span>
                    </div>
                    <div className="item">
                      <strong>Stock</strong>
                      <span>{product.stock}</span>
                    </div>
                    {/* {product.visible ? (
                      <div className="visible-product">
                        <Icon faIcon={faEye} />
                        Producto visible
                      </div>
                    ) : (
                      <div className="visible-product">
                        <Icon faIcon={faEyeSlash} />
                        Producto oculto
                      </div>
                    )} */}
                  </div>
                  <div className="product-list__displayer">
                    {product.visible ? (
                      <Button
                        isSubject="secondary"
                        clickOn={() => setProductVisibility(product.id, false)}
                        isIcon={<Icon faIcon={faEyeSlash} />}
                      />
                    ) : (
                      <Button
                        isSubject="septenary"
                        clickOn={() => setProductVisibility(product.id, true)}
                        isIcon={<Icon faIcon={faEye} />}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
