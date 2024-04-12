import { es, faker } from '@faker-js/faker';

faker.location = es
export const generateUser = () => {
    let numOfProducts = faker.number.int({min: 5 , max: 15})
    // Crear una lista de roles posibles
    const roles = ['admin', 'usuario', 'editor', 'invitado'];
    let products = [];
    for (let i = 0; i < numOfProducts; i++) {
        products.push(generateProduct());
    }
    return {
        name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        sex: faker.person.sex(),
        birthDate: faker.date.birthdate(),
        products: products,
        image: faker.image.avatar(),
        id: faker.database.mongodbObjectId(),
        email: faker.internet.email(),
        rol: roles[Math.floor(Math.random() * roles.length)]
    };
};

export const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        stock: faker.number.int({min: 5 , max: 15}),
        id: faker.database.mongodbObjectId(),
        image: faker.image.avatar()
    }
};