document.addEventListener("DOMContentLoaded", async function() {
    const dropdownBtn = document.querySelector('.dropbtn');
    const dropdownContent = document.querySelector('.dropdown-content');

    dropdownBtn.addEventListener('click', function(event) {
        event.stopPropagation();
        dropdownContent.classList.toggle('show');
    });

    window.addEventListener('click', function(event) {
        if (!dropdownBtn.contains(event.target)) {
            dropdownContent.classList.remove('show');
        }
    });
});

document.addEventListener("DOMContentLoaded", async function() {
    const cartCount = document.getElementById('cartCount');
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
            console.error('Error:', error);
            return 0;
        }
    };

    const updateCartCount = async () => {
        const productCount = await getProductCount();
        cartCount.textContent = productCount;
    };

    await updateCartCount();

    window.addEventListener('storage', async function(event) {
        if (event.key === 'cartId') {
            await updateCartCount();
        }
    });

    document.addEventListener('updateCartCount', async function() {
        await updateCartCount();
    });

    // Redirigir al hacer clic en el icono del carrito
    const cartBtn = document.getElementById("cartBtn");
    cartBtn.addEventListener("click", async () => {
        window.location.href = `/cart/${cartId}`;
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    searchInput.addEventListener("input", function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        filterProducts(searchTerm);
    });

    function filterProducts(searchTerm) {
        const products = document.querySelectorAll(".product"); 
        products.forEach(function(product) {
            const productName = product.textContent.trim().toLowerCase();
            if (productName.includes(searchTerm)) {
                product.style.display = "block";
            } else {
                product.style.display = "none";
            }
        });
    }

    searchBtn.addEventListener("click", function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        filterProducts(searchTerm);
    });
});
