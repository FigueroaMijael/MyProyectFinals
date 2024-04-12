export default class UsersDto {
    static getUserTokenFrom = (user) =>{
        return {
            name: `${user.name} ${user.lastName}`,
            email:user.email,
            age: user.age,
            role: user.role,
        }
    }
}