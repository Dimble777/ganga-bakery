
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderForm from "../../components/OrderForm/OrderForm";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    return JSON.parse(
      localStorage.getItem("ganga-bakery-cart") || "[]"
    );
  });

  const [showOrderForm, setShowOrderForm] = useState(false);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);

    localStorage.setItem(
      "ganga-bakery-cart",
      JSON.stringify(updatedCart)
    );
  };

  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    );

    updateCart(updatedCart);
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      )
      .filter((item) => item.quantity > 0);

    updateCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter(
      (item) => item.id !== id
    );

    updateCart(updatedCart);
  };

  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <section className="cart-page">

        <button
          className="cart-back-btn"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>

        <div className="empty-cart">

          <p className="cart-label">
            GANGA BAKERY
          </p>

          <h1>Your Cart is Empty</h1>

          <p>
            Add some delicious treats to your cart.
          </p>

          <button
            className="continue-shopping-btn"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>

        </div>

      </section>
    );
  }

  return (
    <section className="cart-page">

      <button
        className="cart-back-btn"
        onClick={() => navigate(-1)}
      >
        ← Continue Shopping
      </button>

      <div className="cart-heading">

        <p>GANGA BAKERY</p>

        <h1>Your Cart</h1>

        <div className="cart-line">
          <span></span>
          <strong>✦</strong>
          <span></span>
        </div>

      </div>

      <div className="cart-container">

        <div className="cart-items">

          {cart.map((item) => (

            <div
              className="cart-item"
              key={item.id}
            >

              <div className="cart-item-image">

                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                  />
                ) : (
                  <span>No Image</span>
                )}

              </div>

              <div className="cart-item-info">

                <span>
                  {item.category}
                </span>

                <h2>
                  {item.name}
                </h2>

                <p>
                  ₹{item.price}
                </p>

                <div className="quantity-controls">

                  <button
                    onClick={() =>
                      decreaseQuantity(item.id)
                    }
                  >
                    −
                  </button>

                  <strong>
                    {item.quantity}
                  </strong>

                  <button
                    onClick={() =>
                      increaseQuantity(item.id)
                    }
                  >
                    +
                  </button>

                </div>

              </div>

              <div className="cart-item-total">

                <strong>
                  ₹{item.price * item.quantity}
                </strong>

                <button
                  className="remove-item-btn"
                  onClick={() =>
                    removeItem(item.id)
                  }
                >
                  Remove
                </button>

              </div>

            </div>

          ))}

        </div>

        <aside className="cart-summary">

          <h2>Order Summary</h2>

          <div className="summary-line">
            <span>Items</span>
            <span>{cart.length}</span>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <strong>₹{total}</strong>
          </div>

          <button
            className="checkout-btn"
            onClick={() => setShowOrderForm(true)}
          >
            Order on WhatsApp
          </button>

        </aside>

      </div>

      {showOrderForm && (
        <OrderForm
          cart={cart}
          total={total}
          onClose={() => setShowOrderForm(false)}
        />
      )}

    </section>
  );
}

export default Cart;

