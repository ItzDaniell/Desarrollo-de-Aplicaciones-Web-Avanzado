import { Metadata } from "next";
import { projects } from "@/lib/data";
import ProjectCard from "@/components/ProjectCard";

export const metadata: Metadata = {
    title: "Proyectos",
    description: "Explora una selección de mis proyectos destacados que demuestran mis habilidades en desarrollo web y tecnologías modernas.",
    openGraph: {
        title: "Proyectos - Mi Portafolio",
        description: "Explora una selección de mis proyectos destacados que demuestran mis habilidades en desarrollo web y tecnologías modernas.",
        images: ['/og-projects.png'],
    },
}

const ProjectsPage = () => {
    return ( 
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Mis Proyectos</h1>
            <p className="text-lg text-gray-700 mb-8">
                Aquí encontrarás una selección de mis proyectos destacados que demuestran mis habilidades en desarrollo web y tecnologías modernas.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                    <ProjectCard key={project.slug} project={project} />
                ))}
            </div>
        </div>
     );
}
 
export default ProjectsPage;