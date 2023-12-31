document.addEventListener("DOMContentLoaded", function () {
    //funciones


    // Función para vaciar el carrito
    function vaciarCarrito(carrito) {
        carrito.length = 0;
        localStorage.removeItem("carrito");
        const montoCompra = document.querySelector(".parrafoMonto");
        if (montoCompra) {
            montoCompra.innerHTML = "Monto de la compra: $0";
        }
        cart([]);
    }


    function eliminarDelCarrito(carrito, index) {
        carrito.splice(index, 1); // Elimina el producto del carrito en el índice especificado
        localStorage.setItem("carrito", JSON.stringify(carrito)); // Actualiza el carrito en local storage
        cart(carrito); // Vuelve a renderizar el carrito para reflejar los cambios
    }


    function pagar() {

        if (localStorage.length > 0) {
            localStorage.removeItem("carrito"); // Elimina los elementos del carrito en el local storage
            Toastify({
                text: "Su pago fue realizado con éxito. Gracias por su compra.",
                duration: 2000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "center",
                stopOnFocus: true,
                style: {
                    backgroundColor: "#32CD32",
                },
                onClick: function () { }
            }).showToast();
        } else {//mensaje de error para cuando el carrito esta vacio
            Toastify({
                text: "Su carrito esta vacio. No es posible realizar el pago", 
                duration: 2000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "center",
                stopOnFocus: true,
                style: {
                    backgroundColor: "#32CD32",
                },
                onClick: function () { }
            }).showToast();

        }
    }


    function cart(carrito) {
        const divBotones = document.getElementById("botonesCarro");
        // Elimina el contenido del botón "Carrito" si estamos en el carrito
        if (carritoVisible) {
            contBotonCarrito.innerHTML = '';
            h1.innerHTML = "Carrito ";
        }

        // Verifica si los botones ya existen en el DOM antes de crearlos nuevamente
        if (!divBotones.querySelector(".botonVaciar")) {
            montoCompra = document.createElement("p");
            montoCompra.classList.add("parrafoMonto");
            montoCompra.innerHTML = `Monto de la compra: $0`;
            divBotones.appendChild(montoCompra);

            const botonPagar = document.createElement("button");
            botonPagar.textContent = "Pagar";
            botonPagar.classList.add("btn", "boton", "btn-primary", "botonPagar");
            divBotones.appendChild(botonPagar);
            botonPagar.addEventListener("click", () => {
                pagar();
            });

            const botonVaciarCarrito = document.createElement("button");
            botonVaciarCarrito.textContent = "Vaciar Carrito";
            botonVaciarCarrito.classList.add("btn", "botonVaciar", "boton", "botonVaciarCarrito");
            divBotones.appendChild(botonVaciarCarrito);
            botonVaciarCarrito.addEventListener("click", () => vaciarCarrito(carrito));

            const botonRecargarPagina = document.createElement("button");
            botonRecargarPagina.textContent = "Tienda";
            botonRecargarPagina.classList.add("btn", "btn-primary", "boton", "botonPagar", "botonRecargarPagina");
            divBotones.appendChild(botonRecargarPagina);
            botonRecargarPagina.addEventListener("click", () => location.reload());
        }
        if (carrito.length > 0) {
            contenedorProductos.innerHTML = "";
            carrito.forEach(({ item, precio, foto }, index) => {
                const div = document.createElement("div");
                div.classList.add("tarjeta");
                div.innerHTML = `
            <img src="${foto}" alt="${item}" class="card-img-top imagen">
            <div class="card-body">
            <h5 class="card-title">${item}</h5>
            <h6 class="card-text">$${precio}</h6>
            <button class="btn btn-primary boton eliminar" data-index="${index}">Eliminar</button>
            </div>
            `;

                const botonEliminar = div.querySelector(".eliminar");
                botonEliminar.addEventListener("click", () => eliminarDelCarrito(carrito, index));

                contenedorProductos.appendChild(div);
                localStorage.setItem("carrito", JSON.stringify(carrito));
            });

            // Calcula y muestra el monto de la compra después de renderizar los productos
            calcularMontoCompra();
        } else {
            contenedorProductos.innerHTML = `
            <h2 class="encabezado">Lo siento, no hay productos en el carrito</h2>
            `;

            // Actualiza el monto de la compra a $0 si el carrito esta vacio
            const montoCompra = document.querySelector(".parrafoMonto");
            montoCompra.innerHTML = "Monto de la compra: $0";
        }
    }

    function agregarAlCarrito(carrito, producto) {
        carrito.push(producto);
        Toastify({
            text: "Producto agregado al carrito",
            duration: 1500,
            newWindow: true,
            close: true,
            gravity: "top", 
            position: "center", 
            stopOnFocus: true, 
            style: {
                backgroundColor: "#8a2be2",
            },
            onClick: function () { }
        }).showToast();
    }



    // Calcula y muestra el monto de la compra
    function calcularMontoCompra() {
        const total = carrito.reduce((acc, producto) => acc + producto.precio, 0);
        montoCompra.innerHTML = `Monto de la compra: $${total}`;
    }


    function cargarProductos() {
        fetch("./data.json")
            .then((response) => response.json())
            .then((data) => {
                const carritoGuardado = JSON.parse(localStorage.getItem("carrito"));
                contenedorProductos.innerHTML = "";

                if (!carritoVisible) {
                    contBotonCarrito.innerHTML = `
                    <button name="button" class="btn btn-primary boton botonCarrito">Carrito</button>
                `;
                }

                data.forEach(({ item, precio, foto }) => {
                    const div = document.createElement("div");
                    div.classList.add("tarjeta");
                    div.innerHTML = `
                    <img src="${foto}" alt="${item}" class="card-img-top imagen">
                    <div class="card-body">
                        <h5 class="card-title">${item}</h5>
                        <h6 class="card-text">$${precio}</h6>
                        <button name="button" class="btn btn-primary boton">Agregar al carrito</button>
                    </div>
                `;

                    const botonAgregar = div.querySelector(".boton");
                    botonAgregar.addEventListener("click", () => agregarAlCarrito(carrito, { item, precio, foto }));

                    contenedorProductos.append(div);
                });

                contBotonCarrito.addEventListener("click", () => {
                    carritoVisible = true;
                    cart(carrito);
                });
            })
            .catch((error) => {
                console.error("Error al cargar los productos:", error);
            });
    }

    // Algoritmo principal
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let montoCompra;
    const header = document.querySelector("header");
    let carritoVisible = false;
    const tituloDiv = document.getElementById("titulo");
    let h1 = document.createElement("h1");
    h1.innerHTML = "Bienvenido a la tienda";
    tituloDiv.appendChild(h1);
    h1.classList.add("encabezado");
    const contBotonCarrito = document.getElementById("botonHeader");

    document.body.className = "fondo";

    const contenedorProductos = document.querySelector(".vidriera");
    cargarProductos();
});