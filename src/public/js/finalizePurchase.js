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

const mp = new MercadoPago('APP_USR-664ab158-83ac-4735-9fd3-30648967e4db', {
    locale: "es-Ar",
});

const generateIdempotencyKey = () => {
    const length = 20;
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    const characterslength = characters.length;
    let idempotencyKey = "";
    for(let i = 0; i < length; i++) {
        idempotencyKey += characters.charAt(Math.floor(Math.random() *characterslength));
    };
    return idempotencyKey
}

const idempotencyKey = generateIdempotencyKey()
 
document.getElementById("checkout-btn").addEventListener("click", async () => {
    try {
        const products = Array.from(document.querySelectorAll(".cart-item")).map(item => {
            return {
                title: item.querySelector(".title").innerText,
                quantity: parseInt(item.querySelector(".quanty").innerText),
                price: parseFloat(item.querySelector(".price").innerText),
            };
        });
        console.log(products);

        const totalAmount = parseFloat(document.querySelector(".totalAmount").innerText);
        console.log(totalAmount);

        const orderData = {
            products: products,
            totalAmount: totalAmount,
        };
        console.log(orderData);

        const response = await fetch("http://localhost:9092/api/payments/create-preference", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Idempotency-Key": idempotencyKey
            },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            throw new Error("Error al crear la preferencia");
        }

        const preference = await response.json();
        createCheckoutButton(preference.id);

        const emailData = {
            products: products,
            totalAmount: totalAmount,
        };

        const emailResponse = await fetch("http://localhost:9092/api/email/finalyPurchase", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(emailData),
        });

        if (!emailResponse.ok) {
            throw new Error("Error al enviar el correo electrónico de confirmación");
        }

        console.log("Correo electrónico enviado con éxito");

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