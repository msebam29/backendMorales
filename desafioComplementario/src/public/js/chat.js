const fecha = () =>{
    new Date().toLocaleDateString()
} 
Swal.fire({
        title: "Bienvenido al chat",
        input: "email",
        inputLabel: "Su email para identificarse",
        inputPlaceholder: "Ingrese su email",
        allowOutsideClick: false
    })
.then(datos=>{
    let user= datos.value

    document.title = user

let inputMensaje = document.getElementById("mensaje")
let divMensajes = document.getElementById("mensajes")
inputMensaje.focus()

const socket = io()

socket.emit("presentacion", user, "Usuario creado")


socket.on("historial", async (user) => {
    await user.forEach(u => {
        divMensajes.innerHTML += `<div class="mensaje"><strong>${u.user}</strong> dice: <i>${u.message}</i></div><br>`
    })
})

socket.on("nuevoUsuario", user => {
    Swal.fire({
        text: `${user} se ha conectado...!!!`,
        toast: true,
        position: "top-right"
    })
})

socket.on("nuevoMensaje", (user, message) => {
    divMensajes.innerHTML += `<div class="mensaje"><strong>${user}</strong> dice: <i>${message}</i></div><br>`
})

socket.on("saleUsuario", user => {
    divMensajes.innerHTML += `<iv class="mensaje"><strong>${user.user}</strong> ha salido del chat... :(</iv><br>`
})

inputMensaje.addEventListener("keyup", e => {
    e.preventDefault()
    if (e.code === "Enter" && e.target.value.trim().length > 0) {
        socket.emit("mensaje", user, e.target.value.trim())
        e.target.value = ""
        e.target.focus()
    }
})
})



