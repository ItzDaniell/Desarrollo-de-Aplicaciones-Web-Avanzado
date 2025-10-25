import Image from "next/image";
import Link from "next/link";
import { ApiListResponse, Character } from "@/types/rickandmorty";

async function getCharacters(): Promise<Character[]> {
  const urls = [1, 2, 3].map((p) => `https://rickandmortyapi.com/api/character?page=${p}`);
  const res = await Promise.all(
    urls.map((u) => fetch(u, { cache: "force-cache" }).then((r) => r.json()))
  );
  const merged: Character[] = res.flatMap((r: ApiListResponse<Character>) => r.results);
  return merged;
}

export default async function RMListPage() {
  const characters = await getCharacters();
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-baseline justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Rick and Morty</h1>
        <Link href="/rm/search" className="text-sm text-white underline">Búsqueda</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {characters.map((c) => (
          <Link key={c.id} href={`/rm/${c.id}`} className="block bg-white rounded-xl shadow p-4 hover:shadow-lg">
            <div className="w-full aspect-square relative">
              <Image src={c.image} alt={c.name} fill sizes="(max-width:768px) 50vw, 25vw" priority={false} className="object-cover rounded-lg" />
            </div>
            <h2 className="mt-3 text-lg font-semibold text-gray-800">{c.name}</h2>
            <p className="text-sm text-gray-500">{c.status} • {c.species}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
