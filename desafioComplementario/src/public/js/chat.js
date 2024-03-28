Swal.fire({
    title: "Bienvenido al chat",
    input: "email",
    inputLabel: "Su email para identificarse",
    inputPlaceholder: "Ingrese su email",
    allowOutsideClick:false    
  })
.then(datos=>{
    let email=datos.value
    document.title=email

    let inputMensaje=document.getElementById("mensaje")
    let divMensajes=document.getElementById("mensajes")
    inputMensaje.focus()

    const socket=io()

    socket.emit("presentacion", email)

    socket.on("historial",async (email, mensajes)=>{
        await mensajes.forEach(m=>{
            divMensajes.innerHTML+=`<div class="mensaje"><strong>${email}</strong> dice: <i>${m}</i></div><br>`
        })
    })

    socket.on("nuevoUsuario", user=>{
        Swal.fire({
            text:`${user} se ha conectado...!!!`,
            toast:true,
            position:"top-right"
        })
    })

    socket.on("nuevoMensaje", (email, mensaje)=>{
        divMensajes.innerHTML+=`<div class="mensaje"><strong>${email}</strong> dice: <i>${mensaje}</i></div><br>`
    })

    socket.on("saleUsuario", email=>{
        divMensajes.innerHTML+=`<div class="mensaje"><strong>${email}</strong> ha salido del chat... :(</div><br>`
    })

    inputMensaje.addEventListener("keyup", e=>{
        e.preventDefault()
        if(e.code==="Enter" && e.target.value.trim().length>0){
            socket.emit("mensaje", email, e.target.value.trim())
            e.target.value=""
            e.target.focus()
        }
    })
})