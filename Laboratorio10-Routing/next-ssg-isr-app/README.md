This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Rick and Morty Lab: Rutas y Estrategias de Datos

- **SSG Lista (cache forzado)**: `src/app/rm/page.tsx`
  - Usa `fetch(..., { cache: 'force-cache' })` para forzar SSG y cache estático de la lista inicial.
  - Lazy loading de imágenes con `next/image` (por defecto es lazy si `priority={false}`).
  - Muestra tarjetas con nombre, status y species. Enlaces al detalle por `id`.

- **CSR Búsqueda en tiempo real**: `src/app/rm/search/page.tsx`
  - Cliente puro con `"use client"`, `useState` y `useEffect`.
  - Filtros por `name`, `status`, `type`, `gender` y debounce de 300ms.

- **Detalle con ISR (10 días)**:
  - Por Id: `src/app/rm/[id]/page.tsx`
  - Por Nombre: `src/app/rm/name/[name]/page.tsx`
  - `export const revalidate = 864000` (10 días) + `fetch(..., { next: { revalidate } })`.
  - `generateStaticParams()` recorre todas las páginas de la API para pre-generar rutas (id y nombre).
  - Se mapean campos del response: `name`, `status`, `species`, `type`, `gender`, `origin`, `location`, `episode.length`, `url`, `created`.

### Justificación de SSG / ISR / CSR
- **Lista (SSG con cache forzado)**: La lista de personajes no cambia con mucha frecuencia y es ideal para renderizado estático rápido y caché CDN.
- **Detalle (ISR 10 días)**: El detalle puede cambiar muy puntualmente; ISR permite servir estático y revalidar automáticamente sin redeploy.
- **Búsqueda (CSR)**: La experiencia es interactiva en tiempo real con filtros; se debe ejecutar en el cliente para actualizar sin recargar.

### Hosts de imágenes
- Configurado en `next.config.ts` `images.remotePatterns` para `rickandmortyapi.com`.

### Deploy a Vercel
1. **Repositorio**: Sube este proyecto a GitHub/GitLab/Bitbucket.
2. **Crear Proyecto**: En Vercel, "Add New... > Project" y selecciona el repo.
3. **Framework Preset**: Next.js. Build/Output por defecto (`next build`).
4. **Variables**: No requiere claves. (API pública).
5. **Images**: `next.config.ts` ya incluye el host remoto necesario.
6. **Preview/Prod**: Vercel generará previsualizaciones en PRs y producirá el dominio una vez desplegado.
