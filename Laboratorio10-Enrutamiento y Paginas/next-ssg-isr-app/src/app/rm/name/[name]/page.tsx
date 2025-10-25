import Image from "next/image";
import { ApiListResponse, Character } from "@/types/rickandmorty";
import { notFound } from "next/navigation";

export const revalidate = 864000;

async function getByName(name: string): Promise<Character | null> {
  const res = await fetch(`https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(name)}`, { next: { revalidate } });
  if (!res.ok) return null;
  const data: ApiListResponse<Character> = await res.json();
  const exact = data.results.find((c) => c.name.toLowerCase() === name.toLowerCase());
  return exact ?? data.results[0] ?? null;
}

export async function generateStaticParams() {
  const first = await fetch("https://rickandmortyapi.com/api/character").then((r) => r.json());
  const pages: number = first.info.pages;
  const urls = Array.from({ length: pages }, (_, i) => `https://rickandmortyapi.com/api/character?page=${i + 1}`);
  const all = await Promise.all(urls.map((u) => fetch(u).then((r) => r.json())));
  const names = all.flatMap((p: any) => p.results.map((c: Character) => ({ name: c.name })));
  return names;
}

export default async function RMDetailByName({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const c = await getByName(name);
  if (!c) notFound();
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
