// Capturamos los elementos HTML relevantes
const addProductToCart = document.getElementById("addProductToCart");
const incrementBtn = document.getElementById("incrementQuantity");
const decrementBtn = document.getElementById("decrementQuantity");
const quantityDisplay = document.getElementById("quantity");
const viewCartBtn = document.getElementById('viewCartBtn');

// Valor inicial de la cantidad
let quantity = 1;

// Event listener para el botón de incremento
incrementBtn.addEventListener("click", () => {
    quantity++;
    quantityDisplay.textContent = quantity;
});

// Event listener para el botón de decremento
decrementBtn.addEventListener("click", () => {
    if (quantity > 1) { // Aseguramos que la cantidad no baje de 1
        quantity--;
        quantityDisplay.textContent = quantity;
    }
});

const addToCart = async () => {
    try {
        // Obtener el ID del producto de la URL
        const productId = window.location.pathname.split('/').pop(); // Obtener el último segmento de la URL

        // Obtener el ID del carrito desde el almacenamiento local
        let cartId = localStorage.getItem('cartId');

        // Si no hay un ID de carrito en el almacenamiento local, solicitarlo al servidor
        if (!cartId) {
            const cartResponse = await fetch('/api/cart');
            if (!cartResponse.ok) {
                throw new Error('No se pudo obtener el ID del carrito');
            }
            const cartData = await cartResponse.json();
            cartId = cartData[0]._id;

            // Almacenar el ID del carrito en el almacenamiento local
            localStorage.setItem('cartId', cartId);
        }

        // Obtener la cantidad seleccionada por el usuario
        const quantityDisplay = document.getElementById("quantity");
        const quantity = parseInt(quantityDisplay.textContent);

        // Realizar una solicitud POST al servidor para agregar el producto al carrito
        const response = await fetch(`/api/cart/${cartId}/product/${productId}/${quantity}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            // El producto se agregó correctamente al carrito
            alert('Producto agregado al carrito');
        } else {
            // Ocurrió un error al agregar el producto al carrito
            const data = await response.json();
            throw new Error(data.error || 'Error al agregar el producto al carrito');
        }
    } catch (error) {
        console.error(error);
        alert('Ocurrió un error al agregar el producto al carrito');
    }
};

// Función para manejar el evento de clic en el botón "Ver Carrito"
const viewCart = () => {
    // Obtener el ID del carrito del almacenamiento local
    const cartId = localStorage.getItem('cartId');

    // Redirigir al usuario al carrito utilizando el ID obtenido
    window.location.href = `/cart/${cartId}`;
};

// Verificar si hay un ID de carrito en el almacenamiento local y mostrar el botón "Ver Carrito" si es así
if (localStorage.getItem('cartId')) {
    viewCartBtn.style.display = 'block';
}

// Event listener para el botón de agregar al carrito
addProductToCart.addEventListener("click", addToCart);
// Asociar la función viewCart al evento de clic en el botón "Ver Carrito"
viewCartBtn.addEventListener('click', viewCart);
