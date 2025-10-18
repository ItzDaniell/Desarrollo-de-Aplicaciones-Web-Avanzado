import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-gradient-to-b from-background to-transparent">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(600px_200px_at_50%_-60px,rgba(120,119,198,0.25),transparent)]" />
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <span className="inline-flex items-center rounded-full border border-foreground/15 bg-background/70 px-3 py-1 text-xs font-medium backdrop-blur-sm">
            Bienvenido a mi proyecto Next.js
          </span>
          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Explora datos con componentes modernos
          </h1>
          <p className="mt-4 text-base sm:text-lg text-foreground/70">
            CSR, SSR, clima y más — ahora con un diseño mejorado.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              className="inline-flex h-11 items-center justify-center rounded-md bg-foreground text-background px-5 text-sm font-medium transition hover:opacity-90"
              href="/movies"
            >
              Explorar Películas
            </a>
            <a
              className="inline-flex h-11 items-center justify-center rounded-md border border-foreground/20 px-5 text-sm font-medium hover:bg-foreground/5"
              href="/pokemon-csr"
            >
              Pokémon CSR
            </a>
            <a
              className="inline-flex h-11 items-center justify-center rounded-md border border-foreground/20 px-5 text-sm font-medium hover:bg-foreground/5"
              href="/weather"
            >
              Clima
            </a>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center gap-8 sm:items-start">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
            <li className="mb-2 tracking-[-.01em]">
              Edita <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">app/page.tsx</code> y guarda para ver cambios.
            </li>
            <li className="tracking-[-.01em]">Desarrolla más secciones y componentes.</li>
          </ol>

          <div className="flex gap-3 items-center flex-col sm:flex-row">
            <a
              className="inline-flex h-11 items-center justify-center rounded-md bg-foreground text-background px-5 text-sm font-medium transition hover:opacity-90 gap-2"
              href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image className="dark:invert" src="/vercel.svg" alt="Vercel logomark" width={20} height={20} />
              Deploy now
            </a>
            <a
              className="inline-flex h-11 items-center justify-center rounded-md border border-foreground/20 px-5 text-sm font-medium hover:bg-foreground/5 w-full sm:w-auto"
              href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read our docs
            </a>
          </div>
        </div>
      </main>

      <footer className="border-t border-foreground/10">
        <div className="mx-auto max-w-6xl px-6 py-8 flex gap-6 flex-wrap items-center justify-center text-sm text-foreground/80">
          <a
            className="flex items-center gap-2 hover:underline underline-offset-4"
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
            Learn
          </a>
          <a
            className="flex items-center gap-2 hover:underline underline-offset-4"
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
            Examples
          </a>
          <a
            className="flex items-center gap-2 hover:underline underline-offset-4"
            href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
            Ir a nextjs.org →
          </a>
        </div>
      </footer>
    </div>
  );
}

