import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const Home = () => {
  const [product, setProduct] = useState([]);
  const list = useSelector((state) => state.list);
  const [cart, setCart] = useState([]);
  const printRef = useRef();

  const fetchProducts = () => setProduct(list);

  const addToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.Id === item.Id);
      if (exists) {
        if (exists.qty < item.stock) {
          return prev.map((i) =>
            i.Id === item.Id ? { ...i, qty: i.qty + 1 } : i
          );
        } else {
          alert("Stock limit reached!");
          return prev;
        }
      } else {
        if (item.stock > 0) {
          return [...prev, { ...item, qty: 1 }];
        } else {
          alert("Item out of stock!");
          return prev;
        }
      }
    });
  };

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.Id === id) {
          if (item.qty < item.stock) {
            return { ...item, qty: item.qty + 1 };
          } else {
            alert("Stock limit reached!");
            return item;
          }
        }
        return item;
      })
    );
  };

  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.Id !== id));
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.Id === id ? { ...item, qty: Math.max(1, item.qty - 1) } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const getStockLeft = (id) => {
    const inCart = cart.find((item) => item.Id === id);
    return inCart
      ? inCart.stock - inCart.qty
      : product.find((p) => p.Id === id)?.stock || 0;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Print handler
  const handlePrint = () => {
    const printFrame = document.createElement("iframe");
    printFrame.style.position = "absolute";
    printFrame.style.left = "-9999px";
    printFrame.style.top = "0";
    printFrame.style.width = "300px";
    printFrame.style.height = "600px";
    printFrame.id = "printFrame";
    document.body.appendChild(printFrame);

    const printDocument = printFrame.contentWindow.document;

    printDocument.open();
    printDocument.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { 
              font-family: 'Courier New', monospace; 
              padding: 20px;
              max-width: 250px;
              margin: 0 auto;
            }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .divider { border-top: 1px dashed #000; margin: 10px 0; }
            .items { margin: 15px 0; }
            .item-row { display: flex; justify-content: space-between; }
            .total-row { font-weight: bold; margin-top: 10px; }
            .thank-you { margin-top: 20px; font-style: italic; text-align: center; }
          </style>
        </head>
        <body>
          ${printRef.current.innerHTML}
          <script>
            setTimeout(function() {
              window.print();
              setTimeout(function() {
                window.parent.postMessage('printComplete', '*');
              }, 500);
            }, 200);
          </script>
        </body>
      </html>
    `);
    printDocument.close();

    window.addEventListener(
      "message",
      function (event) {
        if (event.data === "printComplete") {
          document.body.removeChild(printFrame);
        }
      },
      { once: true }
    );
  };

  return (
    <div className="p-4 flex">
      {/* Product Listing */}
      <div className="w-full lg:w-2/3 p-4">
        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {product.map((item) => (
            <div
              key={item.Id}
              onClick={() => addToCart(item)}
              className="group relative cursor-pointer transition-all duration-200 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 hover:border-gray-200"
            >
              {/* Product Image */}
              <div className="aspect-square w-full relative">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x300?text=No+Image";
                    e.target.onerror = null;
                  }}
                />
                {/* Quick add to cart button */}
                <button
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(item);
                  }}
                  aria-label={`Add ${item.name} to cart`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                </button>
              </div>

              {/* Product Info */}
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {item.name}
                </h3>
                <div className="mt-1 flex justify-between items-center">
                  <p className="text-sm font-semibold text-gray-800">
                    ${item.price.toFixed(2)}
                  </p>
                  {getStockLeft(item.Id) > 0 ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      {getStockLeft(item.Id) < 5 ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1 animate-pulse"></span>
                          Only {getStockLeft(item.Id)} left
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                          In Stock
                        </>
                      )}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Checkout */}
      <div className="w-full md:w-1/3 p-4 bg-white rounded-lg shadow-md">
        <div className="p-4 bg-gray-800 text-white font-bold text-lg rounded-t-lg text-center">
          Checkout Summary
        </div>

        <div className="overflow-x-auto">
          <table className="w-full mt-4 text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="p-3 text-left font-medium text-gray-600">
                  Item
                </th>
                <th className="p-3 text-center font-medium text-gray-600">
                  Quantity
                </th>
                <th className="p-3 text-right font-medium text-gray-600">
                  Price
                </th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr
                  key={item.Id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-3 font-medium text-gray-800">{item.name}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => decreaseQty(item.Id)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        -
                      </button>
                      <span className="w-6 text-center">{item.qty}</span>
                      <button
                        onClick={() => increaseQty(item.Id)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="p-3 text-right font-medium">
                    ${(item.price * item.qty).toFixed(2)}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => removeItem(item.Id)}
                      className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                      aria-label="Remove item"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-200">
                <td className="p-3 font-bold text-gray-800">Total</td>
                <td></td>
                <td className="p-3 text-right font-bold text-lg text-gray-800">
                  ${total.toFixed(2)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Print Button */}
        <button
          onClick={handlePrint}
          className="w-full mt-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
              clipRule="evenodd"
            />
          </svg>
          Print Receipt
        </button>
      </div>

      <div ref={printRef} style={{ display: "none" }}>
        <div className="center bold">My Store</div>
        <div className="center">123 Main St, Yangon</div>
        <div className="center">Phone: (09) 456-7890</div>
        <div className="divider"></div>
        <div className="items">
          {cart.map((item) => (
            <div className="item-row" key={item.Id}>
              <span>
                {item.name} x{item.qty}
              </span>
              <span className="ml-2">
                ${(item.price * item.qty).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="divider"></div>
        <div className="total-row item-row">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="thank-you">Thank you for shopping!</div>
      </div>
    </div>
  );
};

export default Home;
