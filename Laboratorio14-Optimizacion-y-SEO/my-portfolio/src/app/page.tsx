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
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900">{personalInfo.name}</h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-5">{personalInfo.title}</p>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">{personalInfo.description}</p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/projects"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          > Ver Proyectos
          </Link>
          <Link
            href="/about"
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
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