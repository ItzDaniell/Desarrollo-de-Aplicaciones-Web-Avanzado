// app/products/page.tsx
export const dynamic = "force-dynamic"; // fuerza SSR (sin caché)

export default async function ProductsPage() {
  const res = await fetch("https://api.tienda.com/productos", { cache: "no-store" });
  const productos = await res.json();

  return (
    <main>
      <h1>Productos (Actualiza en cada visita)</h1>
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
