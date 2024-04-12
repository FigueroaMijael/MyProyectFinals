import { expect } from 'chai'
import supertest from 'supertest'

const Expect = expect

const requester = supertest('http://localhost:9090')

describe("testing Adopme App",  () => {

     describe("Testing login and session with Cookies:",  () => {

        before(function () {
            this.cookie;
            this.user = {
                name: "Pedro",
                lastName: "Sosa",
                email: "pedrososa123@gmail.com",
                age: 19,
                password: "test1" 
            }
        });

        it("Crear usuario: El API POST /api/jwt debe crear un nuevo usuario correctamente", async function () {
        
            //then
            const { statusCode } = await requester.post('/api/jwt/register').send(this.user);
    
            //Assert that
            Expect(statusCode).is.eqls(200)
        });
    
        it("Test Login Usuario: Debe poder hacer login correctamente con el usuario registrado previamente", async function () {
            // Given
            const login = {
                email: this.user.email,
                password: this.user.password
            }
    
            // Then
            const result = await requester.post("/api/jwt/login").send(login);
            // console.log(result);
            const cookieResult = result.headers['set-cookie'][0]
    
            // Assert
            expect(result.statusCode).is.eql(200)
    
            const cookieData = cookieResult.split("=")
            this.cookie = {
                name: cookieData[0],
                value: cookieData[1]
            }
            expect(this.cookie.name).to.be.ok.and.eql('CookieToken');
            expect(this.cookie.value).to.be.ok
        });
    }); 

    describe("testing Products API", () => {

        before(function(){
            this.product = {
                title: "New Product",
                    description: "Description of the new product",
                    category: "Category of the new product",
                    thumbnail: "URL of the thumbnail",
                    code: "Unique code for the new product",
                    price: 10.99,
                    stock: 100, 
                    owner: "admin"
            }
        })
        describe("POST /api/product/create", () => {
            it("should create a new product", async function() {
    
                const response = await requester.post('/api/product/create').send(this.product);
                expect(response.status).to.equal(200);
                expect(response.body).to.have.property('dato');
            });
        });

        describe("GET /api/product/", async () => {

            it("should return all products", async function () {
                const response = await requester.get('/api/product');
                expect(response.status).to.equal(200);
            });
        });
    
    
        /* describe("PUT /api/product/update/:_id", () => {
            it("should update an existing product", async function() {
                const productIdToUpdate = "5f1a3d2b4a2f1c3b5e6d7f8a"; 
                const updatedProductData = {
                    title: "Updated Product Title",
                    description: "Updated description",
                };
    
                const response = await requester.put(`/api/product/update/${productIdToUpdate}`).send(updatedProductData);
                expect(response.status).to.equal(200);
            }); 
        });*/
    
       /*  describe("DELETE /api/product/delete/:_id", () => {
            it("should delete an existing product", async function() {
                const productIdToDelete = "5f1a3d2b4a2f1c3b5e6d7f8a"; 
    
                const response = await requester.delete(`/api/product/delete/${productIdToDelete}`);
                expect(response.status).to.equal(200);
                expect(response.body).to.have.property('message').that.includes('eliminado con éxito');
            });
        }); */
    });
});