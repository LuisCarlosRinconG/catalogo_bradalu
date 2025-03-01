document.addEventListener("DOMContentLoaded", () => {
    actualizarCarritoIcono();
    mostrarCarrito();

    // Agregar productos al carrito desde cualquier página
    document.querySelectorAll(".agregar-carrito").forEach(boton => {
        boton.addEventListener("click", () => {
            const producto = {
                nombre: boton.dataset.nombre,
                precio: parseFloat(boton.dataset.precio),
                imagen: boton.dataset.imagen,
                cantidad: 1
            };
            agregarAlCarrito(producto);
        });
    });

    // Vaciar carrito
    const vaciarCarritoBtn = document.getElementById("vaciar-carrito");
    if (vaciarCarritoBtn) {
        vaciarCarritoBtn.addEventListener("click", vaciarCarrito);
    }

    // Finalizar compra
    const finalizarCompraBtn = document.getElementById("finalizar-compra");
    if (finalizarCompraBtn) {
        finalizarCompraBtn.addEventListener("click", enviarPedidoWhatsApp);
    }
});

// 🛒 Agregar productos al carrito en localStorage
function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let existe = carrito.find(item => item.nombre === producto.nombre);

    if (existe) {
        existe.cantidad += 1;
    } else {
        carrito.push(producto);
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarritoIcono();
}

// 🔄 Actualizar el contador del carrito
function actualizarCarritoIcono() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let totalCantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    let contador = document.getElementById("contador-carrito");

    if (contador) {
        contador.textContent = totalCantidad;
    }
}

// 🛍️ Mostrar productos en `carrito.html`
function mostrarCarrito() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let contenedor = document.getElementById("lista-carrito");
    let totalCarrito = document.getElementById("total-carrito");
    let total = 0;

    if (!contenedor || !totalCarrito) return;

    contenedor.innerHTML = ""; // Limpiar antes de actualizar

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>El carrito está vacío</p>";
    } else {
        carrito.forEach((producto, index) => {
            total += producto.precio * producto.cantidad;
            let item = document.createElement("div");
            item.classList.add("carrito-item");
            item.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}" class="carrito-img">
                <div>
                    <h3>${producto.nombre}</h3>
                    <p>Precio: $${producto.precio}</p>
                    <p>Cantidad: ${producto.cantidad}</p>
                    <button class="btn eliminar-item" data-index="${index}">Eliminar</button>
                </div>
            `;
            contenedor.appendChild(item);
        });

        document.querySelectorAll(".eliminar-item").forEach(boton => {
            boton.addEventListener("click", (event) => {
                eliminarDelCarrito(event.target.dataset.index);
            });
        });
    }

    totalCarrito.textContent = `Total: $${total}`;
}

// 🗑️ Vaciar el carrito
function vaciarCarrito() {
    localStorage.removeItem("carrito");
    mostrarCarrito();
    actualizarCarritoIcono();
}

// ❌ Eliminar un producto del carrito
function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
    actualizarCarritoIcono();
}

// 📩 Enviar pedido a WhatsApp
function enviarPedidoWhatsApp() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    let mensaje = "Hola, quiero realizar un pedido con los siguientes productos:\n\n";
    let total = 0;

    carrito.forEach(item => {
        mensaje += `🛒 ${item.nombre} - Cantidad: ${item.cantidad} - Precio: $${item.precio * item.cantidad}\n`;
        total += item.precio * item.cantidad;
    });

    mensaje += `\n💰 Total a pagar: $${total}`;
    mensaje = encodeURIComponent(mensaje);

    let urlWhatsApp = `https://api.whatsapp.com/send?phone=573227082256&text=${mensaje}`;
    window.location.href = urlWhatsApp;
}
