const adjustQuantity = async (change) => {
    try {
        const cartId = localStorage.getItem('cartId');
        const productId = document.getElementById('productId').value;
        
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
    adjustQuantity(-1);
});

increaseBtn.addEventListener('click', (e) => {
    adjustQuantity(1);
});