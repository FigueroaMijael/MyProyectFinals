// Capturamos los elementos HTML relevantes
const addProductToCart = document.getElementById("addProductToCart");
const incrementBtn = document.getElementById("incrementQuantity");
const decrementBtn = document.getElementById("decrementQuantity");
const quantityDisplay = document.getElementById("quantity");
const viewCartBtn = document.getElementById('viewCartBtn');

let quantity = 1;

incrementBtn.addEventListener("click", () => {
    quantity++;
    quantityDisplay.textContent = quantity;
});

decrementBtn.addEventListener("click", () => {
    if (quantity > 1) { 
        quantity--;
        quantityDisplay.textContent = quantity;
    }
});

const addToCart = async () => {
    try {
        const productId = window.location.pathname.split('/').pop();

        let cartId = localStorage.getItem('cartId');

        if (!cartId) {
            const cartResponse = await fetch('/api/cart');
            if (!cartResponse.ok) {
                throw new Error('No se pudo obtener el ID del carrito');
            }
            const cartData = await cartResponse.json();
            cartId = cartData[0]._id;

            localStorage.setItem('cartId', cartId);
        }

        const quantityDisplay = document.getElementById("quantity");
        const quantity = parseInt(quantityDisplay.textContent);

        const response = await fetch(`/api/cart/${cartId}/product/${productId}/${quantity}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert('Producto agregado al carrito');
        } else {
            const data = await response.json();
            throw new Error(data.error || 'Error al agregar el producto al carrito');
        }
    } catch (error) {
        console.error(error);
        alert('Ocurrió un error al agregar el producto al carrito');
    }
};


const viewCart = () => {
    const cartId = localStorage.getItem('cartId');

    window.location.href = `/cart/${cartId}`;
};

if (localStorage.getItem('cartId')) {
    viewCartBtn.style.display = 'block';
}

addProductToCart.addEventListener("click", addToCart);
viewCartBtn.addEventListener('click', viewCart);
