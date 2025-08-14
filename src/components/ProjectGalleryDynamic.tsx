'use client';

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Image from "next/image";

export default function ProjectGalleryDynamic() {
  const projects = useQuery(api.projects.getFeaturedProjects, { limit: 8 });

  if (!projects) {
    return (
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Featured Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-700"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Featured Projects</h2>
          <p className="text-gray-400">Project gallery coming soon...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Featured Projects</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform group">
              <div className="aspect-square relative overflow-hidden">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-semibold text-white text-sm mb-1">{project.title}</h3>
                    {project.description && (
                      <p className="text-gray-300 text-xs line-clamp-2">{project.description}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white mb-1">{project.title}</h3>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  {project.location && <span>{project.location}</span>}
                  {project.acreage && <span>{project.acreage} acres</span>}
                </div>
                <span className="inline-block mt-2 text-xs bg-green-600 text-white px-2 py-1 rounded capitalize">
                  {project.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
