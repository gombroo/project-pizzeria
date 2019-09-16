import {settings, select, classNames, templates} from '../settings.js';
import utils from './utils.js';
import CartProduct from './components/CartProduct.js';

class Cart{
  constructor(element){
    const thisCart = this;

    thisCart.products = [];
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;

    thisCart.getElements(element);
    thisCart.initActions();

    // console.log('new Cart', thisCart);
  }

  getElements(element){
    const thisCart = this;

    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = document.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = document.querySelector(select.cart.productList);
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.formSubmit = thisCart.dom.wrapper.querySelector(select.cart.formSubmit);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);

    thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];

    for(let key of thisCart.renderTotalsKeys){
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
    }
    // console.log(Cart);
  }

  initActions(){
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function(){
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });

    thisCart.dom.productList.addEventListener('updated', function(){
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function(){
      thisCart.remove(event.detail.cartProduct);
    });

    console.log('Show form:', thisCart.dom.form);

    thisCart.dom.formSubmit.addEventListener('click', function(event){
      event.preventDefault();
      console.log('dupa blada');
      thisCart.sendOrder();
    });
  }

  sendOrder(){
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.order;

    const payload = {
      phone: thisCart.dom.phone,
      address: thisCart.dom.address,
      totalPrice: thisCart.totalPrice,
      totalNumber: thisCart.totalNumber,
      subtotalPrice: thisCart.subtotalPrice,
      deliveryFee: thisCart.deliveryFee,
      products: [],
    };

    for(let product of thisCart.products){
      payload.products.push(product.getData());
      // tablica.dodajemy(to co zwracaane przez getData);
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function(response) {
        return response.json();
      })
      .then(function(parsedResponse) {
        console.log('parsedResponse', parsedResponse);
      });
  }

  add(menuProduct){
    const thisCart = this;

    /* generate HTML based on template */
    const generatedHTML = templates.cartProduct(menuProduct);
    //console.log('generatedHTML:', generatedHTML);

    /* create element using utils.createElementFromHTML */
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    //console.log('generatedDOM:', generatedDOM);

    /* find cart container */
    const cartContainer = document.querySelector(select.containerOf.cart);
    console.log('cartContainer', cartContainer);

    /* add DOM elements to thisCart.dom.productList */
    thisCart.dom.productList.appendChild(generatedDOM);

    /* make new instance of CartProduct class + add instance to thisCart.products array */
    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));

    // console.log('thisCart products', thisCart.products);
    // console.log('adding product', menuProduct);

    thisCart.update();
  }

  update(){
    const thisCart = this;

    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;

    for(let singleProduct of thisCart.products){
      thisCart.subtotalPrice = thisCart.subtotalPrice + singleProduct.price;
      //thisCart.subtotalPrice += singleProduct.price; // też działa
      thisCart.totalNumber = thisCart.totalNumber + singleProduct.amount;
      //thisCart.totalNumber += singleProduct.amount;
    }

    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;

    for(let key of thisCart.renderTotalsKeys){
      for(let elem of thisCart.dom[key]){
        elem.innerHTML = thisCart[key];
      }
    }

    // console.log('thisCart.totalNumber', thisCart.totalNumber);
    // console.log('thisCart.subtotalPrice', thisCart.subtotalPrice);
    // console.log('thisCart.totalPrice', thisCart.totalPrice);
  }

  remove(cartProduct){
    const thisCart = this;

    const index = thisCart.products.indexOf(cartProduct);
    const removedProduct = thisCart.products.splice(index, 1);
    console.log(removedProduct);

    const removeDOM = cartProduct.dom.wrapper;
    removeDOM.remove();

    thisCart.update();
  }

/* END class Cart */
}

export default Cart;
