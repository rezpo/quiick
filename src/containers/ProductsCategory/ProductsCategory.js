import React, { useState } from "react";
import ProductsList from "../../pages/Products/ProductsList/ProductsList";
import CategoriesAdd from "../../pages/Categories/CategoriesAdd/CategoriesAdd";
import ProductsAdd from "../../pages/Products/ProductsAdd/ProductsAdd";
import "./ProductsCategory.scss";

export default function ProductsCategory() {
  const [showAddProductWrapper, setShowAddProductWrapper] = useState(false);

  const displayAddProductWrapper = () => {
    setShowAddProductWrapper(!showAddProductWrapper);
  };

  return (
    <div className="products-categories__wrapper">
      <div className="products-categories-list">
        <ProductsList
          displayProductsAddition={() => displayAddProductWrapper()}
          displayProductsState={showAddProductWrapper}
        />
        <CategoriesAdd />
      </div>
      <div
        className={`add-product ${
          showAddProductWrapper ? "wrapper--show" : "wrapper--hide"
        }`}
      >
        <ProductsAdd />
      </div>
    </div>
  );
}
