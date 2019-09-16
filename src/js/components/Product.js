import {select, classNames, templates} from '../settings.js';
import {utils} from '../utils.js';
import AmountWidget from './AmountWidget.js';

class Product{
  constructor(id, data){
    const thisProduct = this; // single product

    thisProduct.id = id;
    thisProduct.data = data; // save instance properties
    // display products in console

    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
    // console.log('new product:', thisProduct);
  }

  renderInMenu(){ // display produts on site
    const thisProduct = this; // single product

    /* generate HTML based on template */
    const generatedHTML = templates.menuProduct(thisProduct.data);

    /* create element using utils.createElementFromHTML */
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);

    /* find menu container */
    const menuContainer = document.querySelector(select.containerOf.menu);

    /* add element to menu */
    menuContainer.appendChild(thisProduct.element);
  }

  getElements(){ // how to find single element in product's container
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }

  initAccordion(){
    const thisProduct = this;

    /* find the clickable trigger (the element that should react to clicking) */
    // const trigger = thisProduct.querySelector(select.menuProduct.clickable);
    const trigger = thisProduct.accordionTrigger; // change after adding getElements function

    /* START: click event listener to trigger */
    trigger.addEventListener('click', function(event){

      /* prevent default action for event */
      event.preventDefault();

      /* toggle active class on element of thisProduct */
      thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
    });

    /* find all active products */
    const activeProducts = document.querySelectorAll(select.all.menuProducts.active);

    /* START LOOP: for each active product */
    for(let activeProduct in activeProducts){

      /* START: if the active product isn't the element of thisProduct */
      if (activeProduct == !thisProduct.element) {

        /* remove class active for the active product */
        activeProduct.classList.remove(classNames.menuProduct.wrapperActive);

        /* END: if the active product isn't the element of thisProduct */
      }
      /* END LOOP: for each active product */
    }
    /* END: click event listener to trigger */
  }

  initOrderForm(){
    const thisProduct = this;
    //console.log('initOrderForm');

    thisProduct.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisProduct.processOrder();
    });

    for(let input of thisProduct.formInputs){
      input.addEventListener('change', function(){
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function(event){
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }

  processOrder(){
    const thisProduct = this;

    /* read all data from the form and save it to const formData */
    const formData = utils.serializeFormToObject(thisProduct.form);
    // console.log('Show all data from the form:', formData);
    thisProduct.params = {};

    /* set variable price to equal thisProduct.data.price */
    let price = thisProduct.data.price;

    /* START LOOP: for each paramId in thisProduct.data.params */
    /* save the element in thisProduct.data.params with key paramId as const param */
    for(let paramId in thisProduct.data.params){
      const param = thisProduct.data.params[paramId];
      // console.log('Show param:', param); // sos, ciasto, dodatki

      /* START LOOP: for each optionId in param.options */
      /* save the element in param.options with key optionId as const option */
      for(let optionId in param.options){
        const option = param.options[optionId];
        // console.log('Show option:', option); // oliwki, papryczki

        /* START IF: if option is selected and option is not default */
        /* add price of option to variable price */
        const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;

        if(optionSelected && !option.default){
          price = price + option.price;

        /* END IF: if option is selected and option is not default */
        }

        /* START ELSE IF: if option is not selected and option is default */
        /* odlicz price of option from price */
        else if(!optionSelected && option.default){
          price = price - option.price;

        /* END ELSE IF: if option is not selected and option is default */
        }

        /* images selector  */

        const imagesClass = thisProduct.imageWrapper.querySelectorAll('.' + paramId + '-' + optionId);

        if(optionSelected){
          if(!thisProduct.params[paramId]){
            thisProduct.params[paramId] = {
              label: param.label,
              options: {},
            };
          }
          thisProduct.params[paramId].options[optionId] = option.label;

          for(let singleClass of imagesClass){
            singleClass.classList.add(classNames.menuProduct.imageVisible);
          }
        } else {
          for(let singleClass of imagesClass){
            singleClass.classList.remove(classNames.menuProduct.imageVisible);
          }
        }

        /* END LOOP: for each optionId in pSaram.options */
      }
      /* END LOOP: for each paramId in thisProduct.data.params */
    }

    /* multiply price by amout */
    // price *= thisProduct.amountWidget.value;
    thisProduct.priceSingle = price;
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;

    /* set the contents of thisProduct.priceElem to be the value of variable price */
    // thisProduct.priceElem = price; // shows price in console only
    // let totalPrice = thisProduct.priceElem;
    // totalPrice.innerHTML = price;
    // thisProduct.priceElem.innerHTML = price;
    thisProduct.priceElem.innerHTML = thisProduct.price;

    // console.log('Show product params:', thisProduct.params);
  }

  initAmountWidget(){
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);

    thisProduct.amountWidgetElem.addEventListener('updated', function(){
      thisProduct.processOrder();
    });
  }

  addToCart(){
    const thisProduct = this;

    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;

    // app.cart.add(thisProduct);

    const event = new CustomEvent('add-to-cart', { // CE klasa js wbudowana w przegladarkę
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });

    thisProduct.element.dispatchEvent(event);
  }

/* END class Product */
}

export default Product;
