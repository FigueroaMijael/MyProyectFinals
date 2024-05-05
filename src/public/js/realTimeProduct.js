document.addEventListener('DOMContentLoaded', () => {
const realTimeForm = document.getElementById('realTimeForm');

realTimeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(realTimeForm);
    const productData = {};
    formData.forEach((value, key) => {
        productData[key] = value;
    });

    try {
        fetch('/api/product/create', {
            method: 'POST',
            body: formData
        }).then(result => {
            if (result.status === 200) {
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
    }
});
});

document.addEventListener('DOMContentLoaded', () => {

    const deleteButtons = document.querySelectorAll('.deleteProduct');

    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const deleteProduct = async (_id) => {
                try {
                    const response = await fetch(`/api/product/delete/${_id}`, {
                        method: 'DELETE'
                    });
        
                    if (response.ok) {
                        alert('Producto eliminado exitosamente');
                        window.location.reload(); 
                    } else {
                        throw new Error('Error al eliminar el producto');
                    }
                } catch (error) {
                    console.error(error);
                    alert('Ocurrió un error al eliminar el producto');
                }
            };

            const productId = button.dataset.productid;
            deleteProduct(productId);
        });
    });
});

async function loadProductDetails(productId) {
    try {
        const response = await fetch(`/api/product/${productId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const product = await response.json();
            fillUpdateForm(product);
        } else {
            throw new Error('Error al obtener los detalles del producto');
        }
    } catch (error) {
        console.error('Error al cargar los detalles del producto:', error);
        alert('Ocurrió un error al cargar los detalles del producto');
    }
}

function fillUpdateForm(product) {
    document.getElementById('updateTitle').value = product.title;
    document.getElementById('updateDescription').value = product.description;
    document.getElementById('updatePrice').value = product.price;
    document.getElementById('updateCategory').value = product.category;
    document.getElementById('updateThumbnail').value = product.thumbnail;
    document.getElementById('updateStock').value = product.stock;
}

document.addEventListener('DOMContentLoaded', () => {
    const updateButtons = document.querySelectorAll('.updateProduct');

    updateButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productid;
            showUpdateForm(productId);
            loadProductDetails(productId);
        });
    });
});

function showUpdateForm(productId) {
    document.getElementById('updateFormContainer').style.display = 'block';
    document.getElementById('updateForm').dataset.productid = productId;
}

const updateForm = document.getElementById('updateForm');
updateForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const productId = updateForm.dataset.productid;
    const formData = new FormData(updateForm);
    const productData = {};
    formData.forEach((value, key) => productData[key] = value);

    try {
        const response = await fetch(`/api/product/update/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (response.ok) {
            alert('Producto actualizado exitosamente');
            window.location.reload();
        } else {
            throw new Error('Error al actualizar el producto');
        }
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        alert('Ocurrió un error al actualizar el producto');
    }
});