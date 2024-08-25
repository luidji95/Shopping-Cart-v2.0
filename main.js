import './style.css'

'use strict'

const itemList = document.querySelector('.item-list');
const cartContainer = document.querySelector('.cart');
const contentContainer = document.querySelector('.content');
const orderListElement = document.querySelector('.order-list');
const numberOrder = document.querySelector('.number-order');
const back = document.querySelector('.backtocart');


// Kreiramo klasu Product koja sadrži osnovne informacije o svakom proizvodu
class Product {
    constructor(name, price, inStock, photoUrl) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.price = price;
        this.inStock = inStock;
        this.photoUrl = photoUrl;
    }

    // Smanjujemo broj na zalihama za onoliko koliko smo naručili
    decreaseStock(value) {
        this.inStock -= value;
    }

    // Povećavamo broj na zalihama za onoliko koliko smo vratili
    increaseStock(value) {
        this.inStock += value;
    }
}

// Kreiramo niz objekata productData i povlačimo podatke prilikom kreiranja nove instance klase
const productsData = [
    {
        name: "Magazine Rack",
        price: 29.99,
        inStock: 10,
        photoUrl: "img/rackpic.jfif"
    },
    {
        name: "Closca helmet",
        price: 49.99,
        inStock: 5,
        photoUrl: "img/helmet.jfif"
    },
    {
        name: "Sigg Water Bottle",
        price: 19.99,
        inStock: 20,
        photoUrl: "img/bottle.jfif"
    }
];
