import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CreateAuthorForm({
  name,
  email,
  bio,
  nationality,
  birthDate,
  loading,
  error,
  onChange,
  onSubmit,
}: {
  name: string;
  email: string;
  bio: string;
  nationality: string;
  birthDate: string;
  loading: boolean;
  error: string | null;
  onChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-medium mb-3">Crear autor</h2>
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" value={name} onChange={(e) => onChange("name", e.target.value)} required />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => onChange("email", e.target.value)} required />
        </div>
        <div className="flex flex-col gap-1 md:col-span-2">
          <Label htmlFor="bio">Bio</Label>
          <Input id="bio" value={bio} onChange={(e) => onChange("bio", e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="nationality">Nacionalidad</Label>
          <Input id="nationality" value={nationality} onChange={(e) => onChange("nationality", e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="birthYear">Año de nacimiento (yyyy)</Label>
          <Input id="birthYear" value={birthDate} onChange={(e) => onChange("birthDate", e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <Button color="indigo" disabled={loading}>
            {loading ? "Guardando..." : "Crear autor"}
          </Button>
        </div>
      </form>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </section>
  );
}
