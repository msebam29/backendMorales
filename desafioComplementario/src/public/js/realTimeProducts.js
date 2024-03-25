const socket = io();

let listProducts = document.getElementById("products")

socket.on("updateProducts", async (products) => {
  listProducts.innerHTML=""
  products.forEach(p => {
    listProducts.innerHTML += `
        <li class="itemProduct" data-id='${p.id}'> 
        <img src=${p.thumbnails[0]} alt='Image of ${p.title}' />
        <div>
          <p>${p.title}</p>
          <p>${p.category}</p>
          <p>${p.description}</p>
          <p>Price: ${p.price}</p>
        </div>
        <div>
          <button onclick="suprimir('${p.id}')">Delete</button>
        </div>
      </li>
      `
  })
});

const suprimir = async (id) => {
  await fetch("http://localhost:8080/api/products/" + id,
  {
    method: "delete"
  })
  alert(`Se eliminó el producto con id ${id}`)
}






