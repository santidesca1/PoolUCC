const TEXTOS = ["Tocá una estrella para calificar", "Malo", "Regular", "Bueno", "Muy bueno", "Excelente"];

// Cinco estrellas: cada una es un radio escondido dentro de su label.
export default function Estrellas({ valor, onCambiar, deshabilitado = false }) {
  return (
    <fieldset disabled={deshabilitado}>
      <legend className="oculto">Puntaje del viaje</legend>
      <div className="estrellas-elegir">
        {[1, 2, 3, 4, 5].map(n => (
          <label key={n} className={"estrella" + (n <= valor ? " elegida" : "")} title={TEXTOS[n]}>
            <input className="oculto" type="radio" name="puntaje" value={n} checked={valor === n} onChange={() => onCambiar(n)} required />
            ★
          </label>
        ))}
      </div>
      <p className="texto-suave texto-centrado">{TEXTOS[valor]}</p>
    </fieldset>
  );
}
