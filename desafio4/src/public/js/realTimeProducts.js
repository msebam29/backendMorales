const socket = io();

let listProducts = document.getElementById("products")

socket.on("newProduct", newProduct => {
  listProducts.innerHTML += `
        <li class="itemProduct" data-id='${newProduct.id}'> 
        <img src=${newProduct.thumbnails[0]} alt='Image of ${newProduct.title}' />
        <div>
          <p>${newProduct.title}</p>
          <p>${newProduct.category}</p>
          <p>${newProduct.description}</p>
          <p>Price: ${newProduct.price}</p>
        </div>
        <div>
          <button class="suprimir">Delete</button>
        </div>
      </li>
      `
})

document.querySelectorAll(".suprimir").forEach((button) => {
  button.addEventListener('click', (e) => {
    const itemProduct = e.target.closest(".itemProduct")
    const productId = itemProduct.dataset.id
    console.log("suprimir clickeado");
    console.log(productId);
    socket.emit("suprimirProduct", productId)
  })
})

/* socket.on("products",async products => {
  await products.forEach((p) => {
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
      <button class="suprimir">Delete</button>
    </div>
  </li>
  `
  })
}) */



