"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorFallback({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <div className="max-w-lg w-full bg-white dark:bg-neutral-900 shadow-sm border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          Ha ocurrido un error
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Lo sentimos — algo salió mal al cargar esta página.
        </p>

        <div className="text-left bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg text-sm mb-4 overflow-x-auto">
          <p className="font-medium text-neutral-700 dark:text-neutral-200">Mensaje:</p>
          <pre className="whitespace-pre-wrap text-neutral-800 dark:text-neutral-300 mt-1">
            {error?.message}
          </pre>
        </div>

        {error?.stack && (
          <details className="text-left bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg text-xs mb-4">
            <summary className="cursor-pointer text-neutral-600 dark:text-neutral-400">
              Ver stack trace
            </summary>
            <pre className="mt-2 whitespace-pre-wrap text-neutral-700 dark:text-neutral-300">
              {error.stack}
            </pre>
          </details>
        )}

        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <button
            onClick={() => reset()}
            className="px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            Reintentar
          </button>

          <Link href="/pokemon">
            <button className="px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
              Volver al listado
            </button>
          </Link>

          <button
            onClick={() => location.reload()}
            className="px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            Recargar página
          </button>
        </div>
      </div>
    </div>
  );
}
