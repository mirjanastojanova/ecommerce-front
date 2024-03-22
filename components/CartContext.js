import { createContext, useEffect, useState } from "react";

export const CartContext = createContext({});

export const CartContextProvider = ({ children }) => {
  // because it's server side rendering
  const ls = typeof window !== "undefined" ? window.localStorage : null;
  const [cartProducts, setCartProducts] = useState([]);
  // when something is in the cart and you  reload the page the cart
  // context is gone, because of that you should store the cart items
  // in local storage, so they would be in the cart again when you
  // reload the page
  useEffect(() => {
    if (cartProducts?.length > 0) {
      // set the products to the cart
      ls?.setItem("cart", JSON.stringify(cartProducts));
    }
  }, [cartProducts]);

  useEffect(() => {
    if (ls && ls.getItem("cart")) {
      // get the products from the cart
      setCartProducts(JSON.parse(ls.getItem("cart")));
    }
  }, []);
  const addProduct = (productId) => {
    setCartProducts((prev) => [...prev, productId]);
  };
  const removeProduct = (productId) => {
    setCartProducts((prev) => {
      const pos = prev.indexOf(productId);
      if (pos !== -1) {
        // check if the id exists in the cart
        return prev.filter((value, index) => index !== pos); // return all the values except the one that position is on
      }
      return prev;
    });
  };
  const clearCart = () => {
    setCartProducts({ cartProducts: [] });
    ls?.setItem("cart", JSON.stringify([]));
  };
  return (
    <CartContext.Provider
      value={{
        cartProducts,
        setCartProducts,
        addProduct,
        removeProduct,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
