// Origen -> destino con los horarios (el punto lo agrega el CSS con ::before)
export default function Recorrido({ desde, hasta, salida, llegada }) {
  return (
    <ul className="recorrido">
      <li><span>{desde}</span> {salida && <time dateTime={salida}>{salida}</time>}</li>
      <li><span>{hasta}</span> {llegada && <time dateTime={llegada}>{llegada}</time>}</li>
    </ul>
  );
}
