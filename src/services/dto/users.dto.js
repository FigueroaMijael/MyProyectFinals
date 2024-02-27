export default class UsersDto {
    constructor(user) {
        this.name = user.name;
        this.lastName = user.lastName;
        this.age = user.age;
        this.email = user.email;
        this.password = user.password;
        this.fullName = this.name + " " + this.lastName;
    }
};