import Link from 'next/link';
import { personalInfo } from '@/lib/data';

export default function Header() {
    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-neutral-100">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" aria-label="Inicio">
                        <h1 className="text-base font-medium">{personalInfo.name}</h1>
                    </Link>

                    <ul className="flex gap-6 text-xs text-neutral-500">
                        <li>
                            <Link href="/" className="text-neutral-500 hover:text-black transition">
                                Inicio
                            </Link>
                        </li>

                        <li>
                            <Link href="/projects" className="text-neutral-500 hover:text-black transition">
                                Proyectos
                            </Link>
                        </li>

                        <li>
                            <Link href="/about" className="text-neutral-500 hover:text-black transition">
                                Sobre mí
                            </Link>
                        </li>

                        <li>
                            <Link href="/contact" className="text-neutral-500 hover:text-black transition">
                                Contacto
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}
