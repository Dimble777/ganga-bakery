
import { useState } from "react";
import { supabase } from "../../utils/supabase";
import "./OrderForm.css";

function OrderForm({ cart, total, onClose }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [orderType, setOrderType] = useState("Pickup");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim()) {
      alert("Please enter your name and phone number.");
      return;
    }

    if (orderType === "Delivery" && !address.trim()) {
      alert("Please enter your delivery address.");
      return;
    }

    if (!cart || cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (saving) return;

    // Calculate the total from the cart items.
    const orderTotal = cart.reduce(
      (sum, item) =>
        sum + Number(item.price) * Number(item.quantity),
      0
    );

    if (
      !Number.isFinite(orderTotal) ||
      orderTotal < 0 ||
      cart.some(
        (item) =>
          !Number.isFinite(Number(item.price)) ||
          Number(item.price) < 0 ||
          !Number.isInteger(Number(item.quantity)) ||
          Number(item.quantity) <= 0
      )
    ) {
      alert("Your cart contains invalid product details. Please check your cart.");
      return;
    }

    setSaving(true);

    let orderId = null;

    try {
      // 1. Save the customer order in Supabase.
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: name.trim(),
          phone: phone.trim(),
          order_type: orderType,
          address: orderType === "Delivery" ? address.trim() : null,
          notes: notes.trim() || null,
          total: orderTotal,
          status: "Pending",
        })
        .select("id")
        .single();

      if (orderError) throw orderError;

      orderId = order.id;

      // 2. Save the individual products for this order.
      const orderItems = cart.map((item) => ({
        order_id: order.id,
        product_id: String(item.id),
        product_name: item.name,
        quantity: Number(item.quantity),
        unit_price: Number(item.price),
        subtotal: Number(item.price) * Number(item.quantity),
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        throw new Error(
          `Order #${order.id} was saved, but its items could not be saved. ${itemsError.message}`
        );
      }

      // 3. Prepare the WhatsApp message.
      const orderItemsMessage = cart
        .map(
          (item) =>
            `• ${item.name} × ${item.quantity} — ₹${
              Number(item.price) * Number(item.quantity)
            }`
        )
        .join("\n");

      const message = `*GANGA BAKERY — NEW ORDER* 🥐

*ORDER REQUEST ID: ${order.id}*

*CUSTOMER DETAILS*
Name: ${name.trim()}
Phone: ${phone.trim()}
Order Type: ${orderType}
${
  orderType === "Delivery"
    ? `Delivery Address: ${address.trim()}`
    : ""
}

*ORDER DETAILS*
${orderItemsMessage}

━━━━━━━━━━━━━━━━
*TOTAL: ₹${orderTotal}*
━━━━━━━━━━━━━━━━

${
  notes.trim()
    ? `*SPECIAL INSTRUCTIONS*
${notes.trim()}

`
    : ""
}Please confirm my order. Thank you! 🙏`;

      const whatsappUrl =
        "https://wa.me/919747253996?text=" +
        encodeURIComponent(message);

      // 4. Open WhatsApp after both Supabase inserts succeed.
      const whatsappWindow = window.open(
        whatsappUrl,
        "_blank"
      );

      if (!whatsappWindow) {
        alert(
          `Order #${order.id} has been saved, but your browser blocked WhatsApp. Allow pop-ups to continue. Do not submit again; your order is already saved.`
        );
        return;
      }

      onClose();
    } catch (error) {
      console.error("Order submission error:", error);

      if (orderId !== null) {
        alert(
          `Order #${orderId} was saved, but the full order could not be completed. Please contact the bakery before submitting again.\n\n${error.message || "Unknown error"}`
        );
      } else {
        alert(
          "We couldn't save your order. Please check your connection and try again.\n\n" +
            (error.message || "Unknown error")
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="order-form-overlay">
      <div className="order-form">
        <button
          type="button"
          className="order-form-close"
          onClick={onClose}
          disabled={saving}
        >
          ✕
        </button>

        <div className="order-form-heading">
          <p>GANGA BAKERY</p>
          <h2>Complete Your Order</h2>
          <span>Please provide your details</span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* NAME */}
          <div className="order-input">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={saving}
            />
          </div>

          {/* PHONE */}
          <div className="order-input">
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={saving}
            />
          </div>

          {/* ORDER TYPE */}
          <div className="order-input">
            <label>Order Type</label>

            <div className="order-type-options">
              <label>
                <input
                  type="radio"
                  value="Pickup"
                  checked={orderType === "Pickup"}
                  onChange={(e) => setOrderType(e.target.value)}
                  disabled={saving}
                />
                Pickup
              </label>

              <label>
                <input
                  type="radio"
                  value="Delivery"
                  checked={orderType === "Delivery"}
                  onChange={(e) => setOrderType(e.target.value)}
                  disabled={saving}
                />
                Delivery
              </label>
            </div>
          </div>

          {/* ADDRESS */}
          {orderType === "Delivery" && (
            <div className="order-input">
              <label>Delivery Address</label>
              <textarea
                placeholder="Enter your complete delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                disabled={saving}
              />
            </div>
          )}

          {/* NOTES */}
          <div className="order-input">
            <label>Special Instructions</label>
            <textarea
              placeholder="Any special request?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={saving}
            />
          </div>

          {/* TOTAL */}
          <div className="order-form-total">
            <span>Order Total</span>
            <strong>₹{total}</strong>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="send-whatsapp-btn"
            disabled={saving}
          >
            {saving
              ? "Saving Order..."
              : "💬 Continue to WhatsApp"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default OrderForm;
