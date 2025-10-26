"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ApiListResponse, Character } from "@/types/rickandmorty";

function useDebounce<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function RMSearchPage() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [gender, setGender] = useState("");
  const [results, setResults] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const qName = useDebounce(name, 300);
  const qStatus = useDebounce(status, 300);
  const qType = useDebounce(type, 300);
  const qGender = useDebounce(gender, 300);

  useEffect(() => {
    let ignore = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (qName) params.set("name", qName);
        if (qStatus) params.set("status", qStatus);
        if (qType) params.set("type", qType);
        if (qGender) params.set("gender", qGender);
        const qs = params.toString();
        const url = qs ? `https://rickandmortyapi.com/api/character/?${qs}` : "https://rickandmortyapi.com/api/character";
        const res = await fetch(url);
        if (!res.ok) throw new Error("Error en la búsqueda");
        const data: ApiListResponse<Character> = await res.json();
        if (!ignore) setResults(data.results || []);
      } catch (e: any) {
        if (!ignore) setError(e.message || "Error");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    run();
    return () => {
      ignore = true;
    };
  }, [qName, qStatus, qType, qGender]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
        <h1 className="text-3xl font-bold text-white">Búsqueda</h1>
        <Link href="/rm" className="text-sm text-white underline">Lista</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="name" className="px-3 py-2 rounded border" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 rounded border">
          <option value="">status</option>
          <option value="alive">alive</option>
          <option value="dead">dead</option>
          <option value="unknown">unknown</option>
        </select>
        <input value={type} onChange={(e) => setType(e.target.value)} placeholder="type" className="px-3 py-2 rounded border" />
        <select value={gender} onChange={(e) => setGender(e.target.value)} className="px-3 py-2 rounded border">
          <option value="">gender</option>
          <option value="female">female</option>
          <option value="male">male</option>
          <option value="genderless">genderless</option>
          <option value="unknown">unknown</option>
        </select>
      </div>
      {loading && <p className="text-white">Cargando…</p>}
      {error && <p className="text-red-400">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {results.map((c) => (
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
