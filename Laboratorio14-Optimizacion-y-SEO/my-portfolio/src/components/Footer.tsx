import { personalInfo } from '@/lib/data';

export default function Footer() {
    return (
        <footer className="py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-neutral-500 text-sm">© {new Date().getFullYear()} {personalInfo.name}</p>

                    <div className="flex gap-4 text-sm">
                        <a
                            href={personalInfo.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-500 hover:text-black transition"
                            aria-label="GitHub"
                        >
                            GitHub
                        </a>

                        <a
                            href={personalInfo.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-500 hover:text-black transition"
                            aria-label="LinkedIn"
                        >
                            LinkedIn
                        </a>

                        <a
                            href={`mailto:${personalInfo.email}`}
                            className="text-neutral-500 hover:text-black transition"
                            aria-label="Email"
                        >
                            Email
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
