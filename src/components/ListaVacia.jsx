// Mensaje para cuando una lista no tiene nada, con una acción opcional (children)
export default function ListaVacia({ titulo, texto, children }) {
  return (
    <div className="tarjeta texto-centrado">
      <h2>{titulo}</h2>
      {texto && <p className="texto-suave">{texto}</p>}
      {children}
    </div>
  );
}
