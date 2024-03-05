
const socket = io();

let form = document.getElementById("form")
let listProducts= document.getElementById("products")

socket.on("newProducts", products=>{
    products.forEach(p=>{
        listProducts.innerHTML+= `
        <li> 
        <img src='${p.thumbnails[ 0 ]}' alt='Image of ${p.title}' />
        <div>
          <p>${p.title}</p>
          <p>${p.category}</p>
          <p>${p.description}</p>
          <p>Price: ${p.price}</p>
        </div>
        <div>
          <button>Delete</button>
        </div>
      </li>
      `
})
})

form.addEventListener("submit", async (e) => {
    e.preventDefault()
    try {
        const newProduct = {
            title: form.title.value,
            description: form.description.value,
            price: form.price.value,
            category: form.category.value,
            thumbnails: form.thumbnails.value,
            code: form.code.value,
            stock: form.stock.value,
            status: true
        }
        console.log(newProduct);
        socket.emit("newProduct", newProduct)
           
    }catch(error){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Error al intentar cargar el nuevo producto`})
    } finally {
        form.reset()
    }
})

socket.on("newProducts", products=>{
    products.forEach(p=>{
        listProducts.innerHTML+= `
        <li> 
        <img src='${p.thumbnails[ 0 ]}' alt='Image of ${p.title}' />
        <div>
          <p>${p.title}</p>
          <p>${p.category}</p>
          <p>${p.description}</p>
          <p>Price: ${p.price}</p>
        </div>
        <div>
          <button>Delete</button>
        </div>
      </li>
      `
})
})

