const lista = document.getElementById("lista");
const contador = document.getElementById("contador");



let html = "";

for(let i = 0; i < viajes.length; i++) {
    const v = viajes[i];
    const completo = v.plazas === 0;

    const claseplazas = completo ? "plazas plazas-completo" : "plazas";

    const textoplazas = completo ? "Completo" : v.plazas + " plazas libres";

    const interior = `<div class="viaje-cabecera">
        <span class="avatar">${v.iniciales}</span>
        <div class="viaje-conductor">
            <h2>${v.conductor}</h2>
            <p>★ ${v.puntaje} ${v.etiqueta ? `<span class="etiqueta">${v.etiqueta}</span>` : ""}</p>
        </div>
        <p class="precio">$${v.precio.toLocaleString("es-AR")} </p>
    </div>
    <ul class="recorrido">
        <li><span>${v.desde}</span>
            <time>${v.salida}</time>
        </li>
        <li><span>${v.hasta}</span>
            <time>${v.llegada}</time>
        </li>
    </ul>
    <p class="${claseplazas}">${textoplazas}</p>`;

    if (completo) {
        html += `<article class="tarjeta tarjeta-completa">${interior}</article>`;
    } else {
        html += `<article><a class="tarjeta tarjeta-enlace" href="viaje.html?id=${v.id}">${interior}</a></article>`;
    }

}


lista.innerHTML = html;
// reemplaza el contenido de la variable html por HTML en tu pág
contador.textContent = viajes.length + "viajes";
// pone texto

