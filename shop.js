let categorySelected = 0;

/**
 *
 *
 */
window.onload = () => {
  getData().then((data) => {
    // Add categories
    const categories = data.responses[0][0].params.userCategories;
    const categoryContainer = document.getElementById("category-container");

    while (document.getElementById("category-container").firstChild) {
      document
        .getElementById("category-container")
        .removeChild(document.getElementById("category-container").firstChild);
    }
    categoryId = 0;
    categories.forEach((category) => {
      let element = addCategory(category, categoryId);
      categoryContainer.appendChild(element);
      categoryId++;
    });
    // Select first category by default
    const cat = document.getElementById("0");
    cat.className = "category-selected";
  });
  start(categorySelected);
};

const start = (categorySelected) => {
  getData().then((data) => {
    // Set products
    const products = data.responses[0][0].params;
    setProducts(products, categorySelected);
  });
};

/**
 * I have uploaded the json file to jsonbin.com
 * If you are not comfortable with me uploading
 * your data to a public space, contact me to
 * delete it.
 *
 *  @returns data
 */
const getData = () => {
  var myHeaders = new Headers();
  myHeaders.append("X-Bin-Meta", "false");

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(
    "https://api.jsonbin.io/b/6123b71b076a223676affdde",
    requestOptions
  )
    .then((response) => response.json())
    .then((responseData) => {
      console.log(responseData);
      return responseData;
    })
    .catch((error) => alert("error", error));
};

const addToBasketToast = () => {
  const x = document.getElementById("toast");

  x.className = "show";

  setTimeout(() => {
    x.className = x.className.replace("show", "");
  }, 3000);
};

/**
 *
 * @param {*} products
 * @param {*} categorySelected
 */
const setProducts = (products, categorySelected) => {
  const productContainer = document.getElementById("product-container");

  // Reset splide
  while (document.getElementById("product-container").firstChild) {
    document
      .getElementById("product-container")
      .removeChild(document.getElementById("product-container").firstChild);
  }

  const catName = products.userCategories[categorySelected];

  products.recommendedProducts[catName].forEach((product) => {
    // Only add products that belong to that particular category
    if (product.category[0].includes(categorySelected)) {
      const pSlide = document.createElement("li");
      pSlide.className = "splide__slide";

      const pImg = document.createElement("img");
      pImg.className = "product-image";
      pImg.setAttribute("width", 176);
      pImg.setAttribute("height", 176);
      pImg.setAttribute("loading", "lazy");

      pImg.src = product.image;

      const pName = document.createTextNode(product.name);

      const pPrice = document.createElement("p");
      pPrice.className = "product-price";
      const priceText = document.createElement("h3");
      priceText.innerHTML = product.priceText;
      pPrice.appendChild(priceText);

      pSlide.appendChild(pImg);
      pSlide.appendChild(pName);
      pSlide.appendChild(pPrice);

      if (product.params.shippingFee === "FREE") {
        const pShip = document.createElement("p");
        pShip.className = "product-shipping";
        const shippingFee = document.createTextNode("Ücretsiz Kargo");
        pShip.appendChild(shippingFee);
        pSlide.appendChild(pShip);
      }

      const addToBasketBtn = document.createElement("button");
      addToBasketBtn.className = "btn-primary";
      addToBasketBtn.setAttribute("onclick", "addToBasketToast()");
      const btnText = document.createTextNode("Sepete Ekle");
      addToBasketBtn.appendChild(btnText);
      pSlide.appendChild(addToBasketBtn);

      productContainer.appendChild(pSlide);
    }
  });

  const mountProductSlider = new Splide("#splide-product", {
    perPage: 4,
    pagination: false,
    gap: "3rem",

    breakpoints: {
      960: {
        perPage: 3,
        gap: "3rem",
      },
      640: {
        perPage: 2,
        gap: "3rem",
      },
      480: {
        perPage: 1,
        gap: "3rem",
      },
    },
  }).mount();
};

/**
 *
 * @param {*} category
 * @param {*} categoryId
 * @returns
 */
const addCategory = (category, categoryId) => {
  // Shorten category names
  if (category.includes(">")) {
    category = category.substring(category.indexOf(">") + 1);
  }

  let cDiv = document.createElement("div");
  cDiv.className = "category-item";
  cDiv.setAttribute("id", categoryId);
  cDiv.setAttribute("onClick", "onSelectCategory(this.id)");
  let cName = document.createTextNode(category);
  cDiv.appendChild(cName);
  return cDiv;
};

/**
 *
 * @param {*} selected
 */
const onSelectCategory = (selected) => {
  if (selected === null || selected === undefined) {
    selected = this.categorySelected;
  }
  let previous = document.getElementById(categorySelected);
  categorySelected = selected;
  previous.classList.add("category-item");
  previous.classList.remove("category-selected");

  const category = document.getElementById(selected);
  category.classList.add("category-selected");
  category.classList.remove("category-item");

  start(selected);
};
