/* const realTimeForm = document.getElementById('realTimeForm');

const sendProductData = async (event) => {
    event.preventDefault();

    const formData = new FormData(realTimeForm);
    const productData = {};
    formData.forEach((value, key) => {
        productData[key] = value;
    });

    try {
        const response = await fetch('/api/product/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (response.ok) {
            alert('Producto agregado exitosamente');
            window.location.reload();
        } else {
            throw new Error('Error al agregar el producto');
        }
    } catch (error) {
        console.error(error);
        alert('Ocurrió un error al agregar el producto');
    }
};

// Agregar event listener al formulario para enviar los datos del producto
realTimeForm.addEventListener('submit', sendProductData);
*/

document.addEventListener('DOMContentLoaded', () => {
    // Obtener todos los botones de eliminar por su clase
    const deleteButtons = document.querySelectorAll('.deleteProduct');

    // Función para eliminar un producto
    const deleteProduct = async (_id) => {
        console.log(_id);
        try {
            const response = await fetch(`/api/product/delete/${_id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Producto eliminado exitosamente');
                console.log( response);
                window.location.reload(); 
            } else {
                throw new Error('Error al eliminar el producto');
            }
        } catch (error) {
            console.error(error);
            alert('Ocurrió un error al eliminar el producto');
        }
    };

    // Agregar event listeners a todos los botones de eliminar
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Obtener el id del producto del atributo data-productid
            const productId = button.dataset.productid; // Asegurémonos de usar camelCase para dataset
            console.log(productId);
            deleteProduct(productId);
        });
    });
});
