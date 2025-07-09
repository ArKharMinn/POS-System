import { createStore } from "redux";
import img1 from "../image/mocha.jpg";
import img2 from "../image/strawberry.jpg";
import img3 from "../image/malashankaw.jpg";
import img4 from "../image/ice-cream.jpg";
import img5 from "../image/burger.jpg";
import img6 from "../image/sausage-pizza.jpg";
import img7 from "../image/donut.jpg";
import img8 from "../image/soda.jpg";
import img9 from "../image/lava.jpg";
import img10 from "../image/orange.jpg";
import img11 from "../image/salad.jpg";
import img12 from "../image/hotdog.jpg";
import img13 from "../image/milk.jpg";

const initialState = {
  list: [
    {
      Id: 1,
      name: "Mocha",
      price: 10000,
      img: img1,
      stock: 10,
    },
    {
      Id: 2,
      name: "Strawberry",
      price: 10000,
      img: img2,
      stock: 4,
    },
    {
      Id: 3,
      name: "Malashankaw",
      price: 30000,
      img: img3,
      stock: 0,
    },
    {
      Id: 4,
      name: "Ice-Cream",
      price: 6000,
      img: img4,
      stock: 5,
    },
    {
      Id: 5,
      name: "Burger",
      price: 7000,
      img: img5,
      stock: 8,
    },
    {
      Id: 6,
      name: "Sausage-Pizza",
      price: 20000,
      img: img6,
      stock: 3,
    },
    {
      Id: 7,
      name: "J'Donut",
      price: 2500,
      img: img7,
      stock: 10,
    },
    {
      Id: 8,
      name: "Strawberry Soda",
      price: 3000,
      img: img8,
      stock: 14,
    },
    {
      Id: 9,
      name: "Lava Cake",
      price: 30000,
      img: img9,
      stock: 1,
    },
    {
      Id: 10,
      name: "Orange Juice",
      price: 3500,
      img: img10,
      stock: 0,
    },
    {
      Id: 11,
      name: "Thai Papaya Salad",
      price: 7000,
      img: img11,
      stock: 2,
    },
    {
      Id: 12,
      name: "HotDog",
      price: 2000,
      img: img12,
      stock: 0,
    },
    {
      Id: 13,
      name: "Milk",
      price: 5000,
      img: img13,
      stock: 1,
    },
  ],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const store = createStore(reducer);
export default store;
