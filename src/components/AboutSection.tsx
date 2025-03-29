"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useScrollAnimation } from "@/lib/animation";

export function AboutSection() {
  // Use shared animation hook for performance
  useScrollAnimation();

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12 fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Here's a bit more about my background, skills, and what drives me as a developer.
          </p>
          <Separator className="max-w-md mx-auto mt-8 bg-primary/20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="fade-in-up stagger-delay-1">
            <Card className="gradient-card overflow-hidden shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-4">My Background</h3>
                <p className="mb-4">
                  As a recent Durham University Matheamatics graduate,
                  and a background in Full Stack Development, 
                  I have a passion for learning and building new and developing existing skills.
                </p>
                <p>
                  Currently, the languages I develop with are Java, Python, Javascript. 
                  as well as knowledge in various web developmetn frameworks such as React, Node.js, and Spring Boot.
                  Furthermore, i have retroactively developed skills in data science and machine learning,
                  with experience in R, SQL, pandas, numpy, and more.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="fade-in-up stagger-delay-2">
              <Card className="gradient-card overflow-hidden shadow-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Core Values</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      <span>User-Centered Design</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      <span>Performance Optimization</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      <span>Continuous Learning</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      <span>Clean, Maintainable Code</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="fade-in-up stagger-delay-3">
              <Card className="gradient-card overflow-hidden shadow-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">When I'm Not Coding</h3>
                  <p>
                    Outside of development, I enjoy Powerlifting, rockclimbing, and building computers. I believe these activities
                    help maintain a creative mindset and fresh perspective that I bring to my technical work.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 