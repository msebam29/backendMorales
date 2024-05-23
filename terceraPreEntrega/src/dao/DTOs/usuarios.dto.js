class UserDTO{
    constructor(user){
        this.firstName=user.nombre.toUpperCase()
        this.lastName=user.apellido.toUpperCase()
        if(user.apellido){
            this.fullName=this.firstName+" "+this.lastName
        }else{
            this.fullName=this.firstName
        }
        this.rol="user"
        this.email=user.email
    }
}

module.exports = UserDTO