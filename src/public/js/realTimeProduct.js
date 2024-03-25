const realTimeForm = document.getElementById('realTimeForm');

realTimeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(realTimeForm);
    console.log(formData);
    const productData = {};
    console.log(productData);
    formData.forEach((value, key) => productData[key] = value);

    try {
        fetch('/api/product/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        }).then(result => {
            if (result.status === 201) {
                alert('Producto agregado exitosamente');
                window.location.reload();                
            } else {
                alert('Error al agregar el producto');
            }
        }).catch(error => {
            console.error('Error al realizar la solicitud fetch:', error);
            alert("Hubo un error al procesar la solicitud.");
        });
    } catch (error) {
        console.error(error);
        alert('Ocurrió un error al agregar el producto');
    }; 
}
)


document.addEventListener('DOMContentLoaded', () => {

    const deleteButtons = document.querySelectorAll('.deleteProduct');

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

    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {

            const productId = button.dataset.productid;
            console.log(productId);
            deleteProduct(productId);
        });
    });
});
