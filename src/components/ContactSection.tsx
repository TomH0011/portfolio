"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Github, Linkedin, Mail, MessageSquare, Send, Instagram } from "lucide-react";
import { useScrollAnimation } from "@/lib/animation";

export function ContactSection() {
  const [formStatus, setFormStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use shared animation hook for performance
  useScrollAnimation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Get form data
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    
    try {
      // Create mailto link with all the information
      const mailtoLink = `mailto:tom.j.howard01@gmail.com?subject=${encodeURIComponent(`${name} from portfolio website: ${subject}`)}&body=${encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${message}`)}`;
      
      // Open the mailto link
      window.open(mailtoLink, '_blank');
      
      // Success message
      setFormStatus("Message prepared! If your email client opened, please send the email to complete the process.");
      form.reset();
    } catch (error) {
      console.error('Error sending email:', error);
      setFormStatus("There was an error. Please try again or email me directly.");
    } finally {
      setIsSubmitting(false);
      // Clear success message after 8 seconds
      setTimeout(() => setFormStatus(""), 8000);
    }
  };

  return (
    <section id="contact" className="py-20 gradient-blue">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12 fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind or want to discuss potential opportunities? Feel free to reach out!
          </p>
          <Separator className="max-w-md mx-auto mt-8 bg-primary/20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="fade-in-up stagger-delay-1">
            <Card className="gradient-card overflow-hidden shadow-xl h-full">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-primary mb-6 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Send a Message
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full p-2 border border-border rounded-md bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full p-2 border border-border rounded-md bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      className="w-full p-2 border border-border rounded-md bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      className="w-full p-2 border border-border rounded-md bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    ></textarea>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full flex items-center justify-center gap-2"
                    disabled={isSubmitting}
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
                
                {formStatus && (
                  <div className="mt-4 p-3 bg-primary/10 text-primary rounded-md text-center">
                    {formStatus}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="fade-in-up stagger-delay-2">
            <Card className="gradient-card overflow-hidden shadow-xl h-full">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-primary mb-6 flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </h3>
                
                <div className="space-y-6">
                  <p className="text-muted-foreground">
                    I'm always interested in new opportunities, collaborations, or just a friendly chat 
                    about software engineering and technology, mathematics or whatever you may want to discuss.
                  </p>
                  
                  <div>
                    <p className="font-medium">Email:</p>
                    <a 
                      href="mailto:tom.j.howard01@gmail.com" 
                      className="text-primary hover:underline"
                    >
                      tom.j.howard01@gmail.com
                    </a>
                  </div>
                  
                  <div>
                    <p className="font-medium">Location:</p>
                    <p>Chester, United Kingdom</p>
                  </div>
                  
                  <div>
                    <p className="font-medium mb-3">Connect with me:</p>
                    <div className="flex gap-4">
                      <a 
                        href="https://github.com/TomH0011" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                        aria-label="GitHub"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                      <a 
                        href="https://www.linkedin.com/in/thomas-james-howard/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                      <a 
                        href="https://www.instagram.com/tom.howard00/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                        aria-label="Instagram"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
} 