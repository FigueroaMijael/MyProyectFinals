document.addEventListener("DOMContentLoaded", async function() {
    const cartId = localStorage.getItem('cartId');

    const getProductCount = async () => {
        try {
            const response = await fetch(`/api/cart/${cartId}`);
            if (!response.ok) {
                throw new Error('Error al obtener la información del carrito');
            }
            const cartData = await response.json();
            return cartData.products.length;
        } catch (error) {
            return 0;
        }
    };

    const productCount = await getProductCount();

    if (cartId && productCount > 0) {
        // Hay productos en el carrito, mostrar botón de finalizar compra
        const finishPurchaseBtn = document.getElementById('checkout-btn');
        finishPurchaseBtn.style.display = 'block';
    } else {
        // No hay productos en el carrito, mostrar mensaje y botón para volver a la vista principal
        const cartContainer = document.querySelector('.cart-container');
        cartContainer.innerHTML = '<h1>No hay productos en el carrito de compras</h1>';
        const returnBtn = document.createElement('button');
        returnBtn.textContent = 'Volver a la vista principal';
        returnBtn.addEventListener('click', () => {
            window.location.href = '/'; // Reemplaza esto con la URL de tu vista principal
        });
        cartContainer.appendChild(returnBtn);
    }
});


const adjustQuantity = async (productId, change) => {
    try {
        const cartId = localStorage.getItem('cartId');
        
        const url = `/api/cart/${change > 0 ? 'increase' : 'decrease'}/${cartId}/product/${productId}/1`;

        const response = await fetch(url, { method: 'PUT' });

        if (response.ok) {
            window.location.reload() 
        } else {
            console.log('Error al ajustar la cantidad en el carrito:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const decreaseBtn = document.getElementById('decreaseBtn');
const increaseBtn = document.getElementById('increaseBtn');

decreaseBtn.addEventListener('click', (e) => {
    const productId = e.target.dataset.productId;
    adjustQuantity(productId, -1);
});

increaseBtn.addEventListener('click', (e) => {
    const productId = e.target.dataset.productId;
    adjustQuantity(productId ,1);
});

const deleteProductInTheCart = async (productId) => {
    try {
        const cartId = localStorage.getItem('cartId');

        const url = `/api/cart/delete/${cartId}/product/${productId}`;

        const response = await fetch(url, { method: 'DELETE' });

        if (response.ok) {
            window.location.reload() 
        } else {
            console.log('Error al eliminar el producto del carrito:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


const btnDelete = document.getElementById('btnDelete')

btnDelete.addEventListener('click', (e) => {
    const productId = e.target.dataset.productId;
    deleteProductInTheCart(productId);
});
