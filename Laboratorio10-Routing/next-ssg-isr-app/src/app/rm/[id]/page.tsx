import Image from "next/image";
import { Character } from "@/types/rickandmorty";
import { notFound } from "next/navigation";

export const revalidate = 864000;
export const dynamicParams = true;
export const dynamic = 'force-dynamic';

async function fetchWithRetry(url: string, init: RequestInit, retries = 2): Promise<Response> {
  let lastErr: any;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url, init);
    // 2xx
    if (res.ok) return res;
    // Not found -> break to notFound outside
    if (res.status === 404) return res;
    // Retry on 429 and 5xx
    if (res.status === 429 || (res.status >= 500 && res.status <= 599)) {
      lastErr = res;
      if (attempt < retries) await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
      continue;
    }
    // Other statuses: return as-is
    return res;
  }
  return lastErr as Response;
}

async function getCharacter(id: string): Promise<Character> {
  const res = await fetchWithRetry(`https://rickandmortyapi.com/api/character/${id}`, {
    next: { revalidate },
    headers: {
      Accept: "application/json",
      "User-Agent": "next-ssg-isr-app/1.0 (+https://vercel.com)",
    },
  });
  if (res.status === 404) notFound();
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Error al obtener personaje (status ${res.status}): ${text || res.statusText}`);
  }
  return res.json();
}


export default async function RMDetailById({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9]+$/.test(id)) notFound();
  const c = await getCharacter(id);
  const statusClass = c.status === 'Alive' ? 'bg-emerald-100 text-emerald-800' : c.status === 'Dead' ? 'bg-rose-100 text-rose-800' : 'bg-zinc-200 text-zinc-700';
  const genderClass = 'bg-sky-100 text-sky-800';
  const typeValue = c.type?.trim() ? c.type : c.species;
  return (
    <div className="p-6 sm:p-10 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative rounded-2xl overflow-hidden ring-1 ring-black/10">
          <div className="w-full aspect-square relative">
            <Image src={c.image} alt={c.name} fill priority={false} className="object-cover" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-3">{c.name}</h1>
          <div className="flex flex-wrap gap-2 mb-6">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}>{c.status}</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-violet-100 text-violet-800">{c.species}</span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${genderClass}`}>{c.gender}</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">{typeValue}</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-800">Episodios: {c.episode.length}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-zinc-500">Origin</p>
              <p className="font-medium text-gray-900">{c.origin?.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-zinc-500">Location</p>
              <p className="font-medium text-gray-900">{c.location?.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-zinc-500">URL</p>
              <a href={c.url} target="_blank" rel="noreferrer" className="font-medium text-indigo-600 hover:underline break-all">{c.url}</a>
            </div>
            <div className="space-y-1">
              <p className="text-zinc-500">Creado</p>
              <p className="font-medium text-gray-900">{new Date(c.created).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
