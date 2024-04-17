export default class UsersDto {
    static getUserTokenFrom = (user) =>{
        return {
            _id: user._id,
            name: user.name ,
            lastName: user.lastName,
            email:user.email,
            age: user.age,
            role: user.role,
            fullName: `${user.name} ${user.lastName}`
        }
    }
}