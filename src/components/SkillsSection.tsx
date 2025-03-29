"use client";

import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useScrollAnimation } from "@/lib/animation";

const skillCategories = [
  {
    name: "Frontend",
    skills: [
      { name: "React.js", level: 90 },
      { name: "Next.js", level: 85 },
      { name: "TypeScript", level: 80 },
      { name: "HTML/CSS", level: 95 },
      { name: "TailwindCSS", level: 90 },
    ],
  },
  {
    name: "Backend",
    skills: [
      { name: "Node.js", level: 85 },
      { name: "Express", level: 80 },
      { name: "MongoDB", level: 75 },
      { name: "SQL", level: 70 },
      { name: "GraphQL", level: 65 },
    ],
  },
  {
    name: "Tools & Methods",
    skills: [
      { name: "Git/GitHub", level: 90 },
      { name: "Docker", level: 70 },
      { name: "CI/CD", level: 75 },
      { name: "Agile/Scrum", level: 85 },
      { name: "Testing", level: 80 },
    ],
  },
  {
    name: "Other",
    skills: [
      { name: "UI/UX Design", level: 75 },
      { name: "SEO", level: 70 },
      { name: "Performance Optimization", level: 85 },
      { name: "Responsive Design", level: 90 },
      { name: "Accessibility", level: 80 },
    ],
  },
];

export function SkillsSection() {
  // Use shared animation hook for performance
  useScrollAnimation();
  
  return (
    <section id="skills" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12 fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills & Expertise</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            I've developed a diverse skill set throughout my career, focusing on both frontend and backend technologies.
          </p>
          <Separator className="max-w-md mx-auto mt-8 bg-primary/20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <div 
              key={category.name}
              className={`fade-in-up stagger-delay-${categoryIndex % 4 + 1}`}
            >
              <Card className="gradient-card overflow-hidden shadow-xl h-full">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-primary mb-6">{category.name}</h3>
                  <div className="space-y-4">
                    {category.skills.map((skill) => (
                      <div key={skill.name}>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-muted-foreground">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full transform-gpu"
                            style={{ 
                              width: `${skill.level}%`,
                              willChange: 'auto' // Let browser decide when to optimize
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 