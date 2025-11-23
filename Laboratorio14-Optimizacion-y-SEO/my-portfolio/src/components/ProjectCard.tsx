import Image from "next/image";
import Link from "next/link";
import { Project } from "@/types";

export interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block overflow-hidden hover:opacity-90 transition-opacity duration-200"
    >
      <div className="relative h-48 overflow-hidden">
        {/* Skeleton loading */}
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="lazy object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 group-hover-accent transition-colors">
          {project.title}
        </h3>
        
        <p className="text-neutral-500 mb-4 line-clamp-2">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded"
            >
              {tech}
            </span>
          ))}
          
          {project.technologies.length > 3 && (
            <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}