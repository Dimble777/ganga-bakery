
import "./TopBar.css";

import {
  FaShoppingCart,
  FaUser
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

function TopBar() {

  const navigate = useNavigate();

  return (
    <div className="topbar">

      <div className="topbar-left">
        📍 9 Outlets Across Bangalore
      </div>

      <div className="topbar-center">
        Delivering Happiness Since 1988
      </div>

      <div className="topbar-right">

        {/* CART */}

        <span
          className="topbar-icon"
          onClick={() => navigate("/cart")}
          style={{ cursor: "pointer" }}
        >
          <FaShoppingCart />
          <span>Cart</span>
        </span>


       
      </div>

    </div>
  );
}

export default TopBar;

