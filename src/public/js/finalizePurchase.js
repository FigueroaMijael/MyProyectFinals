/* const finalizePurchase = async () => {
    try {
        const totalAmount = parseFloat(document.querySelector('.total').textContent.split(': ')[1]);

        const ticketData = {
            amount: totalAmount
        };

        const response = await fetch('/api/cart/finalizePurchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ticketData)
        });

        if (response.ok) {
            const { purchaseId } = await response.json();
            window.location.href = `/finalizePurchase/${purchaseId}`;

            const sendEmailFinalyPurchase = await fetch('/api/email/finalyPurchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({purchaseId, totalAmount}) 
            });

            if (sendEmailFinalyPurchase.ok) {
                console.log('Correo electrónico enviado');
            } else {
                throw new Error('Error al enviar el correo electrónico');
            }
        } else {
            throw new Error('Error al finalizar la compra');
        }
    } catch (error) {
        console.error(error);
        alert('Ocurrió un error al finalizar la compra');
    }
};

const finalizePurchaseButton = document.getElementById('btn');
finalizePurchaseButton.addEventListener('click', finalizePurchase);

 */

const mp = new MercadoPago('TEST-986055a7-9f23-4512-865f-c7ae51dd5952', {
    locale: "es-Ar",
});

document.getElementById("checkout-btn").addEventListener("click", async () => {
    try {
        const products = Array.from(document.querySelectorAll(".cart-item")).map(item => {
            return {
                title: item.querySelector(".title").innerText,
                quantity: parseInt(item.querySelector(".quanty").innerText),
                price: parseFloat(item.querySelector(".price").innerText),
            };
        });

        const totalAmount = parseFloat(document.querySelector(".totalAmount").innerText);

        const orderData = {
            products: products,
            totalAmount: totalAmount,
        };


        const response = await fetch("http://localhost:9090/api/payments/create-preference", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            throw new Error("Error al crear la preferencia");
        }

        const preference = await response.json();
        createCheckoutButton(preference.id);
    } catch (error) {
        console.error(error);
        alert("Ocurrió un error al procesar la compra :(");
    }
});

const createCheckoutButton = (preferenceId) => {
    const bricksBuilder = mp.bricks();

    const renderComponent = async () => {
        if (window.checkoutButton) window.checkoutButton.unmount();

        await bricksBuilder.create("wallet", "wallet_container", {
            initialization: {
                preferenceId: preferenceId,
            },
         });
    };

    renderComponent();
};