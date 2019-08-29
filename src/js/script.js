/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  class Product{
    constructor(id, data){
      const thisProduct = this; // single product

      thisProduct.id = id;
      thisProduct.data = data; // save instance properties
      // display products in console

      thisProduct.renderInMenu();

      console.log('new product:', thisProduct);
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

    initAccordion(){
      const thisProduct = this;

      /* find the clickable trigger (the element that should react to clicking) */
      const trigger = thisProduct.querySelector(select.menuProduct.clickable);

      /* START: click event listener to trigger */
      trigger.addEventListener('click', function(){
        console.log('clicked');
      });

        /* prevent default action for event */
        event.preventDefault();

        /* toggle active class on element of thisProduct */
        const toggle = thisProduct.element(classNames.menuProduct.wrapperActive);

        /* find all active products */
        const activeProducts = document.querySelectorAll(select.menuProduct.clickable);

        /* START LOOP: for each active product */
        for(let activeProduct in activeProducts){

          /* START: if the active product isn't the element of thisProduct */
          if (!activeProduct == thisProduct.element) {

            /* remove class active for the active product */
            activeProduct.remove('active');

          /* END: if the active product isn't the element of thisProduct */
            
        /* END LOOP: for each active product */
        }
      /* END: click event listener to trigger */
    }
  }

  const app = {
    initMenu: function(){
      // const testProduct = new Product();
      // console.log('testProduct: ', testProduct);
      const thisApp = this;
      console.log('thisApp.data:', thisApp.data);

      for(let productData in thisApp.data.products){
        new Product(productData, thisApp.data.products[productData]);
        // ta pętla wypisze nam poszczególne produkty bez zawartości
        // żeby pobrała zawartość trzeba w konstruktorze dodać argumenty id i data
        // tworzy instancję Product
      }
    },


    initData: function(){
      const thisApp = this;
      thisApp.data = dataSource;
    },

    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();

      thisApp.initMenu();
    },
  };

  app.init();
}
