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

class ProductManager {
    constructor() {
        this.ProductArray = [];
    }

    // Dodavanje novog proizvoda u array
    addProduct(product) {
        this.ProductArray.push(product);
    }

    // Prikazivanje svih proizvoda
    renderAllProducts() {
        itemList.innerHTML = "";
        this.ProductArray.forEach(product => {
            const html = `
                <div class="product product-styling" id="${product.id}">
                    <img class="photo" src="${product.photoUrl}" alt="${product.name}" />
                    <h3>${product.name}</h3>
                    <p>Price: $${product.price}</p>
                    <p>In Stock: ${product.inStock}</p>
                    <input class="quantity-input" type="number" min="0" max="${product.inStock}" value="0" />
                    <button class="addToCart">Add to Cart</button>
                </div>
            `;
            itemList.insertAdjacentHTML('beforeend', html);
        });

        // Dodajemo event listener za dugmad Add to Cart unutar metode renderAllProducts
        document.querySelectorAll('.addToCart').forEach(button => {
            button.addEventListener('click', function(event) {
                const productElement = event.target.closest('.product');
                const quantityInput = productElement.querySelector('.quantity-input');
                const quantity = parseInt(quantityInput.value);

                if (quantity > 0) {
                    const productId = productElement.id;
                    const selectedProduct = productManager.ProductArray.find(product => product.id === productId);
                    selectedProduct.quantity = quantity;

                    // Dodavanje proizvoda u listu za kupovinu
                    orderedListManager.addToOrderList(selectedProduct);

                    // Ažuriraj notifikaciju o korpi
                    updateCartNotification();
                    selectedProduct.decreaseStock(quantity);

                    // Ponovno renderovanje svih proizvoda kako bi se ažuriralo stanje
                    productManager.renderAllProducts();
                } else {
                    alert("Please select a quantity greater than 0.");
                }
            });
        });
    }
}

class OrderedListManager {
    constructor() {
        this.orderedList = [];
        this.total = 0;
    }

    addToOrderList(product) {
        const existingProduct = this.orderedList.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += product.quantity;
        } else {
            this.orderedList.push({ ...product });
        }

        // Ažuriraj prikaz liste naručenih proizvoda
        this.renderOrderList();
        this.updateTotal();
        this.renderTotal();
    }

    renderOrderList() {
        orderListElement.innerHTML = "";
        this.orderedList.forEach(item => {
            const html = `
                <div class="order-item" data-id="${item.id}">
                    <p>${item.name}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Total Price: $${(item.quantity * item.price).toFixed(2)}</p>
                    <button class="delete">Delete</button>
                </div>
            `;
            orderListElement.insertAdjacentHTML('beforeend', html);
        });

        // Dodaj event listener za delete dugmad
        document.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.closest('.order-item').dataset.id;
                this.deleteItem(productId);
            });
        });
    }

    deleteItem(productId) {
        const productToDelete = this.orderedList.find(item => item.id === productId);
        if (productToDelete) {
            const productInStock = productManager.ProductArray.find(product => product.id === productId);
            if (productInStock) {
                productInStock.increaseStock(productToDelete.quantity);
            }
            this.orderedList = this.orderedList.filter(item => item.id !== productId);
            this.renderOrderList(); 
            productManager.renderAllProducts(); 
            updateCartNotification();
            this.updateTotal();
            this.renderTotal();
        }
    }

    updateTotal() {
        this.total = this.orderedList.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    }

    renderTotal() {
        const totalElement = document.querySelector('.total-amount');
        totalElement.textContent = `Total: $${this.total.toFixed(2)}`;
        console.log(totalElement);
    }
}

const productManager = new ProductManager();
const orderedListManager = new OrderedListManager();

productsData.forEach((product) => {
    const newProduct = new Product(product.name, product.price, product.inStock, product.photoUrl);
    productManager.addProduct(newProduct);
});

productManager.renderAllProducts();

function updateCartNotification() {
    const totalItems = orderedListManager.orderedList.reduce((total, item) => total + item.quantity, 0);
    numberOrder.textContent = totalItems;
}

const cartImage = document.querySelector('.picshop');
cartImage.addEventListener('click', function () {
    contentContainer.style.display = 'none';
    cartContainer.style.display = 'block';
});

back.addEventListener('click', function () {
    contentContainer.style.display = 'block';
    cartContainer.style.display = 'none';
});
