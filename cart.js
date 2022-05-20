// Находим все нужные переменные(кнопки,данные)
const productsBtn = document.querySelectorAll('#add-to-bag');
const cartProductsList = document.querySelector('.cart-content_list');
const cart = document.querySelector('.cart');
const cartQuantity = document.querySelector('.cart_quantity');
const fullprice = document.querySelector('.fullPrice');
// Задаем специальную переменную для цены(в неё будет записываться цена)
let price = 0;

// функция рандомного айди для связи кнопки "добавить в корзину" и "удалить"
const randomId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// функция удаления пробелов у строки(чтобы считать общую стоимость числами)
const priceWithoutSpaces = (str) => {
    return str.replace(/\s/g, '');
};

// преобразование почитанного(полученого) числа в строку цены
const normalPrice = (str) => {
    return String(str).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
};

//сумма цены(плюсует при добавлении)
const plusFullPrice = (currentPrice) => {
    return price += currentPrice;
};

// разность цены(минусует при удалении)
const minusFullPrice = (currentPrice) => {
    return price -= currentPrice;
};

//выводит данные общей цены в корзину
const printFullPrice = () => {
    fullprice.textContent =`${normalPrice(price)} $`;
};

//получает кол-во элементов в корзине и выводит рядом с иконкой корзины

const printQuantity = () => {
    let length = cartProductsList.children.length;
    cartQuantity.textContent = length;
//проверяет класс active(если он есть - когда товры есть, то корзина выводится
//если нет товаров в корзине, то корзина не показывается при наведении)
    length > 0 ? cart.classList.add('active') : cart.classList.remove('active')
}

//возвращает шаблон товара в корзине с подставленными значениями(id,img,title,price)
//при помощи функции normalPrice price превращается в строку цены с пробелами
const generateCartProduct = (img, title, price, id) => {
    return `
    
    <li class="cart-content_item">
    <article class="cart-content_product cart-product" data-id="${id}">
      <img src="${img}" alt="photo" class="cart-product_img">
      <div class="cart-product_text">
        <h3 class="cart-product_title">${title}</h3>
        <span class="cart-product_price">${normalPrice(price)} $</span>
      </div>
      <button class="cart-product_delete" aria-label="Delete item"></button>
    </article>
  </li>
    `;
}

const deleteProducts = (productParent) => {
    //получаем id
    let id = productParent.querySelector('.cart-product').dataset.id;
    //активируем кнопку добавления в корзину заново
    document.querySelector(`.card[data-id="${id}"]`).querySelector('#add-to-bag').disabled = false;
    //находим цену текущего товара, преобразуем в число и минусуем
    let currentPrice = parseInt(priceWithoutSpaces(productParent.querySelector('.cart-product_price').textContent));
    minusFullPrice(currentPrice);
    //после вычисления выводим в корзину
    printFullPrice();
    //удаляем сам элемент
    productParent.remove();
    //пересчитываем и выводим количество товаров
    printQuantity();
}

// функция добавления в корзину
// Проходимся по всем кнопкам товра, задавая каждому продукту рандомный айди,
// по которому дальше будем работать с ним 
productsBtn.forEach(el => {
    el.closest('.card').setAttribute('data-id', randomId());
// через клик находим текущий продукт
    el.addEventListener('click', (e) => {
        let self = e.currentTarget;
        let parent = self.closest('.card');
// находим id, title, img, price
        let id = parent.dataset.id;
        let img = parent.querySelector('#products-page-all img').getAttribute('src');
        let title = parent.querySelector('.card-text').textContent;
        let priceNumber = parseInt(priceWithoutSpaces(parent.querySelector('.product_price-current').textContent));
        console.log(priceNumber)
// плюсуем число цены
        plusFullPrice(priceNumber)
// выводим плюсованную сумму в корзину
        printFullPrice();
// копируем блок товара в корзину
        cartProductsList.insertAdjacentHTML('afterbegin', generateCartProduct(img, title, priceNumber, id));
// считаем число после добавления(обязательно после)
        printQuantity();
// делаем кнопки добавить в корзину неактивынми
        self.disabled = true;
    });
});

// кликая по листу, а именно с классом delete 
cartProductsList.addEventListener('click', (e) => {
    if (e.target.classList.contains('cart-product_delete')) {
// только тогда вызывается ф-ия удаления продукта(передается элемент товара в корзине li)
        deleteProducts(e.target.closest('.cart-content_item'));
    }
});