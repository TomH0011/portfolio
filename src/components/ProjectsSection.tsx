"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import { useScrollAnimation } from "@/lib/animation";

const projects = [
  {
    title: "Crypto Currency Trading app",
    description: "A full-featured Crypto trading built with React, Node.js, and Java's Springboot. Includes user authentication, Wishlisting, Crypto currency tracking, and payment processing.",
    image: "/projects/login-form.jpg",
    tags: ["React.js", "Node.js", "Java", "Stripe", "MySQL", "Spring Boot", "TailwindCSS"],
    liveUrl: "#",
    githubUrl: "https://github.com/TomH0011/Crypto-Trading-App",
  },
  {
    title: "Skin Lesion Classification using CNN's",
    description: "A convolutional neural network trained to classify skin lesions as either into 1 of 6 different categories",
    image: "/projects/neural-network.jpg",
    tags: ["Python", "Keras", "TensorFlow", "Pandas", "Numpy"],
    liveUrl: "#",
    githubUrl: "https://github.com/TomH0011/SkinCancerNeuralNetwork",
  },
  {
    title: "Audio Visulaiser",
    description: "A visualiser which breaks up .wav files into their frequency components, and displays them on a 2d graph to visualise audio in the frequency space.",
    image: "/projects/sound-wave.png",
    tags: ["Python", "Matplotlib", "Numpy", "Pandas"],
    liveUrl: "#",
    githubUrl: "https://github.com/TomH0011/AudioVisualisation",
  },
  {
    title: "Portfolio Website",
    description: "Well, this is it. A portfolio website to showcase my projects and skills.",
    image: "/projects/portfolio-hero.jpg",
    tags: ["Next.js", "TailwindCSS", "React.js", "Shadcn.ui"],
    liveUrl: "#",
    githubUrl: "#",
  },
];

export function ProjectsSection() {
  // Use shared animation hook for performance
  useScrollAnimation();

  return (
    <section id="projects" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12 fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Projects</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Here are some of the projects I've worked on. Each one presented unique challenges and opportunities to learn and grow.
          </p>
          <Separator className="max-w-md mx-auto mt-8 bg-primary/20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div 
              key={index} 
              className={`fade-in-up stagger-delay-${index % 4 + 1}`}
            >
              <Card className="gradient-card overflow-hidden shadow-xl h-full flex flex-col">
                <div className="h-48 relative overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                    className="transition-transform hover:scale-105"
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" asChild>
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Github className="h-4 w-4" />
                      Code
                    </a>
                  </Button>
                  <Button size="sm" asChild>
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Live Demo
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 