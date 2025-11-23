import Image from "next/image";
import Link from "next/link";
import { projects, personalInfo } from "@/lib/data";
import ProjectCard from "@/components/ProjectCard";

const Home = () => {
  const featuredProjects = projects.filter((project) => project.featured);

  return ( 
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-20">
        <div className="relative w-32 h-32 mx-auto mb-6">
          <Image
            src={personalInfo.avatar}
            alt={personalInfo.name}
            className="rounded-full object-cover"
            fill
            priority
            sizes="120px"
          />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-neutral-900">{personalInfo.name}</h1>
        <p className="text-xl md:text-2xl text-neutral-600 mb-5">{personalInfo.title}</p>
        <p className="text-lg text-neutral-700 max-w-2xl mx-auto mb-8">{personalInfo.description}</p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/projects"
            className="bg-black text-white px-6 py-3 rounded hover:bg-neutral-800 transition"
          > Ver Proyectos
          </Link>
          <Link
            href="/about"
            className="border border-neutral-200 text-neutral-900 px-6 py-3 rounded hover:bg-neutral-50 transition"
          > Sobre Mí
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Proyectos Destacados
        </h2>
        <div className="grid md:grid-cols-2 lg-grid cols-3 gap-8">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
 
export default Home;