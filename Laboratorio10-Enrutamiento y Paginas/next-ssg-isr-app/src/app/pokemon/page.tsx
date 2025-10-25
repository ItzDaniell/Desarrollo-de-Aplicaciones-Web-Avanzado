// app/products/page.tsx
export const revalidate = 3600; // 1 hora (en segundos)

export default async function ProductsPage() {
  const res = await fetch("https://api.tienda.com/productos");
  const productos = await res.json();

  return (
    <main>
      <h1>Productos (Actualiza cada hora)</h1>
      <ul>
        {productos.map((p: any) => (
          <li key={p.id}>
            {p.nombre} — ${p.precio}
          </li>
        ))}
      </ul>
    </main>
  );
}
