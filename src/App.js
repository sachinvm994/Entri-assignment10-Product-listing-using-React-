import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import ProductsData from "./data/products";

function App() {
  const [products] = useState(ProductsData);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("");
  const [cart, setCart] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const categories = ["all"];
  products.forEach((product) => {
    if (!categories.includes(product.category)) {
      categories.push(product.category);
    }
  });

  const filteredProducts = products
    .filter((product) => {
      return product.title.toLowerCase().includes(search.toLowerCase());
    })
    .filter((product) => {
      if (category === "all") {
        return true;
      }
      return product.category === category;
    })
    .sort((a, b) => {
      if (sort === "price-asc") {
        return a.price - b.price;
      }

      if (sort === "price-desc") {
        return b.price - a.price;
      }

      if (sort === "rating") {
        return b.rating.rate - a.rating.rate;
      }

      return 0;
    });

  const handleAddToCart = (product) => {
    const isAlreadyInCart = cart[product.id];

    setCart((prevCart) => {
      if (isAlreadyInCart) {
        if (prevCart[product.id].qty >= 5) {
          return prevCart;
        }

        return {
          ...prevCart,
          [product.id]: {
            qty: prevCart[product.id].qty + 1,
          },
        };
      }

      return {
        ...prevCart,
        [product.id]: { qty: 1 },
      };
    });
    if (isAlreadyInCart && cart[product.id]?.qty >= 5) {
      alert("Maximum 5 quantity allowed");
    } else if (!isAlreadyInCart) {
      alert(`Added to Cart: ${product.title}`);
    }
  };
  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => {
      if (!prevCart[productId]) return prevCart;

      if (prevCart[productId].qty > 1) {
        return {
          ...prevCart,
          [productId]: {
            qty: prevCart[productId].qty - 1,
          },
        };
      }

      const updatedCart = { ...prevCart };
      delete updatedCart[productId];
      return updatedCart;
    });
  };

  return (
    <>
      <button
        className="hamburger"
        onClick={() => setShowFilters(!showFilters)}
      >
        <i className="fa-solid fa-bars"></i>
      </button>
      <nav className={`filter-navbar ${showFilters ? "open" : ""}`}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) => setCategory(e.target.value)}>
          <option value="" disabled selected>
            Select Category
          </option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select onChange={(e) => setSort(e.target.value)}>
          <option value="" disabled selected>
            Sort By
          </option>
          <option value="price-asc">Price: Low &rarr; High</option>
          <option value="price-desc">Price: High &rarr; Low</option>
          <option value="rating">Rating</option>
        </select>
      </nav>

      <h1>Welcome to Product Kart</h1>
      <div className="products-container">
        {filteredProducts.map((product) => {
          let buttonText = "Add to Cart";

          if (cart[product.id]) {
            buttonText = `Added (${cart[product.id].qty})`;
          }

          return (
            <div className="product-item" key={product.id}>
              <img
                src={product.image}
                alt={product.title}
                className="product-image"
              />
              <h3>{product.title}</h3>
              <p className="category">{product.category}</p>
              <p className="product-price">
                <i className="fa-solid fa-indian-rupee-sign"></i>{" "}
                {product.price}
              </p>

              <p className="rating">
                <i className="fa-solid fa-star"></i> {product.rating.rate}
              </p>

              <div className="cart-actions">
                <button onClick={() => handleAddToCart(product)}>
                  {buttonText}
                </button>

                {cart[product.id] && (
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveFromCart(product.id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
export default App;
