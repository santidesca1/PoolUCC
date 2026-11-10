import { useEffect, useState } from "react";
import { DatosContext } from "../context/DatosContext";
import { useAuth } from "../hooks/useAuth";
import { viajesIniciales, reservasIniciales } from "../data/datos";
import { textoPlazas } from "../utils/formato";
import { etiquetaDia } from "../utils/fechas";
import { leerGuardado, guardar } from "../utils/almacenamiento";

const CLAVE = "poolucc-datos";
// Si cambian los datos de ejemplo, se sube la versión y los navegadores los vuelven a cargar
const VERSION = "react-1";

function datosIniciales() {
  return { version: VERSION, viajes: viajesIniciales, reservas: reservasIniciales, avisos: [], chats: {} };
}

// Si lo guardado falta, está roto o tiene otra forma, se vuelve a los datos de ejemplo
function leerDatos() {
  const datos = leerGuardado(CLAVE, null);
  const valido =
    datos !== null && typeof datos === "object" && datos.version === VERSION &&
    Array.isArray(datos.viajes) && Array.isArray(datos.reservas) && Array.isArray(datos.avisos) &&
    datos.chats !== null && typeof datos.chats === "object";
  return valido ? datos : datosIniciales();
}

let contador = 0;
function nuevoId(prefijo) {
  contador++;
  return prefijo + Date.now() + "-" + contador;
}

function crearAviso(para, texto, link) {
  return { id: nuevoId("a"), para, texto, link, leido: false, fecha: new Date().toISOString() };
}

// Clave del chat entre un pasajero y el conductor de un viaje
function claveChat(idViaje, emailPasajero) {
  return idViaje + "|" + emailPasajero;
}

// Todo el acceso a los datos pasa por acá: si algún día hay un backend real
// (por ejemplo Supabase), este es el único archivo que hay que cambiar.
export function DatosProvider({ children }) {
  const { user } = useAuth();
  const [datos, setDatos] = useState(leerDatos);

  useEffect(() => {
    guardar(CLAVE, datos);
  }, [datos]);

  // Si el usuario tiene la app abierta en dos pestañas (por ejemplo, el pasajero en una y el
  // conductor en otra), el evento "storage" avisa cuando la OTRA pestaña guardó algo.
  // Sin esto, la pestaña con datos viejos los volvería a guardar y borraría el cambio de la otra.
  useEffect(() => {
    const alCambiarOtraPestana = e => {
      if (e.key === CLAVE) setDatos(leerDatos());
    };
    window.addEventListener("storage", alCambiarOtraPestana);
    return () => window.removeEventListener("storage", alCambiarOtraPestana);
  }, []);

  const { reservas, avisos, chats } = datos;
  // "Hoy", "Mañana" o "30/10" se calcula cada vez a partir de la fecha real del viaje,
  // así un viaje publicado ayer para hoy no queda diciendo "Hoy" para siempre
  const viajes = datos.viajes.map(v => (v.fecha ? { ...v, dia: etiquetaDia(v.fecha) } : v));

  // ---------- Consultas ----------
  const buscarViaje = id => viajes.find(v => v.id === Number(id));
  const buscarReserva = id => reservas.find(r => r.id === id);
  const reservasDeViaje = idViaje => reservas.filter(r => r.idViaje === Number(idViaje));
  const misReservas = user ? reservas.filter(r => r.emailPasajero === user.email) : [];
  const misViajes = user ? viajes.filter(v => v.conductorEmail === user.email && !v.cancelado) : [];
  const misAvisos = user ? avisos.filter(a => a.para === user.email) : [];
  const avisosSinLeer = misAvisos.filter(a => !a.leido).length;

  // La reserva que el usuario tiene "viva" (pendiente o confirmada) en un viaje
  const reservaActiva = idViaje =>
    misReservas.find(r => r.idViaje === Number(idViaje) && (r.estado === "pendiente" || r.estado === "confirmada"));

  const mensajes = (idViaje, emailPasajero) => chats[claveChat(idViaje, emailPasajero)] || [];

  // ---------- Acciones de pasajero ----------

  /** Pide lugar en un viaje. Si el conductor activó "Aceptar automáticamente", queda confirmada. */
  const solicitarReserva = (idViaje, plazas) => {
    const viaje = buscarViaje(idViaje);
    if (!viaje || viaje.cancelado || viaje.realizado) throw new Error("Este viaje ya no está disponible.");
    if (viaje.conductorEmail === user.email) throw new Error("Este viaje lo publicaste vos.");
    if (reservaActiva(viaje.id)) throw new Error("Ya tenés una reserva en este viaje.");
    if (plazas > viaje.plazas) throw new Error("No quedan tantos lugares libres.");

    const confirmada = viaje.autoAceptar;
    const reserva = {
      id: nuevoId("r"),
      idViaje: viaje.id,
      emailPasajero: user.email,
      nombrePasajero: user.nombre,
      iniciales: user.iniciales,
      puntajePasajero: 0,
      carrera: user.carrera,
      curso: "",
      plazas,
      total: viaje.precio * plazas,
      estado: confirmada ? "confirmada" : "pendiente"
    };

    const nuevosViajes = confirmada
      ? viajes.map(v => (v.id === viaje.id ? { ...v, plazas: v.plazas - plazas } : v))
      : viajes;

    const nuevosAvisos = [
      crearAviso(
        viaje.conductorEmail,
        confirmada
          ? `${user.nombre} reservó ${textoPlazas(plazas)} en tu viaje del ${viaje.dia} a ${viaje.hasta}.`
          : `${user.nombre} pide ${textoPlazas(plazas)} en tu viaje del ${viaje.dia} a ${viaje.hasta}.`,
        confirmada ? "/mis-viajes" : `/solicitudes/${viaje.id}`
      )
    ];
    if (confirmada) {
      nuevosAvisos.push(crearAviso(user.email, `Tu lugar con ${viaje.conductor} quedó confirmado al instante.`, `/reserva/${reserva.id}`));
    }

    setDatos({ ...datos, viajes: nuevosViajes, reservas: [...reservas, reserva], avisos: [...avisos, ...nuevosAvisos] });
    return reserva.id;
  };

  /** Cancela una reserva pendiente o confirmada. Si estaba confirmada, devuelve las plazas. */
  const cancelarReserva = idReserva => {
    const reserva = buscarReserva(idReserva);
    const viaje = buscarViaje(reserva.idViaje);
    const estabaConfirmada = reserva.estado === "confirmada";

    setDatos({
      ...datos,
      viajes: estabaConfirmada
        ? viajes.map(v => (v.id === viaje.id ? { ...v, plazas: v.plazas + reserva.plazas } : v))
        : viajes,
      reservas: reservas.map(r => (r.id === idReserva ? { ...r, estado: "cancelada", motivo: "pasajero" } : r)),
      avisos: [...avisos, crearAviso(viaje.conductorEmail, `${reserva.nombrePasajero} canceló su reserva del ${viaje.dia} a ${viaje.hasta}.`, "/mis-viajes")]
    });
  };

  /** Guarda la calificación y actualiza el puntaje del conductor. */
  const calificar = (idReserva, puntaje, comentario) => {
    const reserva = buscarReserva(idReserva);
    const viaje = buscarViaje(reserva.idViaje);
    // Simplificado: como no guardamos todas las calificaciones, hacemos de cuenta que ya tenía 10
    const nuevoPuntaje = viaje.puntaje === 0 ? puntaje : Math.round((viaje.puntaje * 10 + puntaje) / 11 * 10) / 10;

    setDatos({
      ...datos,
      viajes: viajes.map(v => (v.conductorEmail === viaje.conductorEmail ? { ...v, puntaje: nuevoPuntaje } : v)),
      reservas: reservas.map(r => (r.id === idReserva ? { ...r, calificacion: puntaje, comentario } : r)),
      avisos: [...avisos, crearAviso(viaje.conductorEmail, `${reserva.nombrePasajero} calificó tu viaje con ${puntaje} estrellas.`, "/mis-viajes/realizados")]
    });
  };

  // ---------- Acciones de conductor ----------

  /** Publica un viaje nuevo del usuario y devuelve su id. */
  const publicarViaje = campos => {
    let idMaximo = 0;
    viajes.forEach(v => {
      if (v.id > idMaximo) idMaximo = v.id;
    });
    const viaje = {
      id: idMaximo + 1,
      conductor: user.nombre,
      conductorEmail: user.email,
      iniciales: user.iniciales,
      carrera: user.carrera,
      auto: "Auto a confirmar",
      puntaje: 0,
      etiqueta: "",
      llegada: "",
      ...campos
    };
    setDatos({ ...datos, viajes: [...viajes, viaje] });
    return viaje.id;
  };

  /** Acepta o rechaza una solicitud pendiente y le avisa al pasajero. */
  const responderSolicitud = (idReserva, acepta) => {
    const reserva = buscarReserva(idReserva);
    const viaje = buscarViaje(reserva.idViaje);
    if (reserva.estado !== "pendiente") return;
    if (acepta && reserva.plazas > viaje.plazas) {
      throw new Error("No te quedan lugares suficientes para aceptar esta solicitud.");
    }

    setDatos({
      ...datos,
      viajes: acepta ? viajes.map(v => (v.id === viaje.id ? { ...v, plazas: v.plazas - reserva.plazas } : v)) : viajes,
      reservas: reservas.map(r => (r.id === idReserva ? { ...r, estado: acepta ? "confirmada" : "rechazada" } : r)),
      avisos: [
        ...avisos,
        crearAviso(
          reserva.emailPasajero,
          acepta
            ? `${viaje.conductor} aceptó tu solicitud para el ${viaje.dia} a ${viaje.hasta}.`
            : `${viaje.conductor} no puede llevarte el ${viaje.dia}. Buscá otro viaje.`,
          `/reserva/${reserva.id}`
        )
      ]
    });
  };

  /** El conductor cancela su viaje: se cancelan las reservas y se avisa a cada pasajero. */
  const eliminarViaje = idViaje => {
    const viaje = buscarViaje(idViaje);
    const afectadas = reservasDeViaje(idViaje).filter(r => r.estado === "pendiente" || r.estado === "confirmada");

    setDatos({
      ...datos,
      viajes: viajes.map(v => (v.id === viaje.id ? { ...v, cancelado: true } : v)),
      reservas: reservas.map(r => (afectadas.includes(r) ? { ...r, estado: "cancelada", motivo: "conductor" } : r)),
      avisos: [
        ...avisos,
        ...afectadas.map(r =>
          crearAviso(r.emailPasajero, `${viaje.conductor} canceló el viaje del ${viaje.dia} a ${viaje.hasta}.`, `/reserva/${r.id}`)
        )
      ]
    });
  };

  /** El conductor termina el viaje: los pasajeros confirmados pueden calificarlo. */
  const finalizarViaje = idViaje => {
    const viaje = buscarViaje(idViaje);
    const deEsteViaje = reservasDeViaje(idViaje);

    const nuevosAvisos = [];
    deEsteViaje.forEach(r => {
      if (r.estado === "confirmada") {
        nuevosAvisos.push(crearAviso(r.emailPasajero, `Terminó tu viaje con ${viaje.conductor}. ¡Calificalo!`, `/calificar/${r.id}`));
      } else if (r.estado === "pendiente") {
        nuevosAvisos.push(crearAviso(r.emailPasajero, `El viaje del ${viaje.dia} a ${viaje.hasta} ya se hizo y tu solicitud no se aceptó.`, `/reserva/${r.id}`));
      }
    });

    setDatos({
      ...datos,
      viajes: viajes.map(v => (v.id === viaje.id ? { ...v, realizado: true } : v)),
      reservas: reservas.map(r => {
        if (r.idViaje !== viaje.id) return r;
        if (r.estado === "confirmada") return { ...r, estado: "realizada" };
        if (r.estado === "pendiente") return { ...r, estado: "rechazada" };
        return r;
      }),
      avisos: [...avisos, ...nuevosAvisos]
    });
  };

  // ---------- Chat y avisos ----------

  /** Agrega un mensaje al chat entre el pasajero y el conductor, y le avisa al otro. */
  const enviarMensaje = (idViaje, emailPasajero, texto) => {
    const viaje = buscarViaje(idViaje);
    const clave = claveChat(viaje.id, emailPasajero);
    const mensaje = { autor: user.email, texto, fecha: new Date().toISOString() };
    const soyPasajero = user.email === emailPasajero;
    const aviso = soyPasajero
      ? crearAviso(viaje.conductorEmail, `Mensaje de ${user.nombre}: "${texto}"`, `/chat/${viaje.id}?pasajero=${encodeURIComponent(emailPasajero)}`)
      : crearAviso(emailPasajero, `Mensaje de ${user.nombre}: "${texto}"`, `/chat/${viaje.id}`);

    setDatos({
      ...datos,
      chats: { ...chats, [clave]: [...(chats[clave] || []), mensaje] },
      avisos: [...avisos, aviso]
    });
  };

  const marcarAvisosLeidos = () => {
    setDatos({ ...datos, avisos: avisos.map(a => (a.para === user.email ? { ...a, leido: true } : a)) });
  };

  const reiniciarDatos = () => setDatos(datosIniciales());

  return (
    <DatosContext.Provider
      value={{
        viajes, buscarViaje, buscarReserva, reservasDeViaje, misReservas, misViajes,
        misAvisos, avisosSinLeer, reservaActiva, mensajes,
        solicitarReserva, cancelarReserva, calificar,
        publicarViaje, responderSolicitud, eliminarViaje, finalizarViaje,
        enviarMensaje, marcarAvisosLeidos, reiniciarDatos
      }}
    >
      {children}
    </DatosContext.Provider>
  );
}
