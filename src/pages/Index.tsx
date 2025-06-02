import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowDown, Github, Linkedin, Twitter, Menu, X, Folder, Code, Terminal, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FormData {
  name: string;
  email: string;
  message: string
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

interface Repository {
  name: string;
  description?: string;
  html_url: string;
  language?: string;
  topics?: string[];
  updated_at: string;
}

const Portfolio = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [projects, setProjects] = useState<Repository[]>([]);
  const [form, setForm] = useState<FormData>({ name: '', email: '', message: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [visibleElements, setVisibleElements] = useState(new Set());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Hero slides data
  const heroSlides = [
    {
      headline: "Hi, I'm Yaka Hemanth",
      subheadline: "Frontend Developer at Photonx Technologies Pvt Ltd"
    },
    {
      headline: "Building futuristic, pixel-perfect interfaces",
      subheadline: "Crafting experiences that matter"
    },
    {
      headline: "React • Tailwind • MUI • Redux",
      subheadline: "HTML, CSS, JavaScript, Bootstrap, Webflow"
    }
  ];

  // Experience data (from LinkedIn)
  const experienceData = [
    {
      role: "Frontend Developer",
      company: "Photonx Technologies Pvt Ltd",
      period: "2023 – Present",
      description: "Developed and maintained responsive React applications using MUI, Redux Toolkit, and Webflow integrations. Collaborated with design teams to implement pixel-perfect UI components."
    },

  ];

  // Tech stack data
  const techStack = [
    { name: "HTML", percentage: 100 },
    { name: "CSS", percentage: 100 },
    { name: "Tailwind CSS", percentage: 100 },
    { name: "Bootstrap", percentage: 100 },
    { name: "JavaScript", percentage: 95 },
    { name: "React", percentage: 95 },
    { name: "MUI", percentage: 100 },
    { name: "Redux", percentage: 80 },
    { name: "Webflow", percentage: 100 }
  ];

  const bioText = "Frontend developer specializing in React, Tailwind, MUI, and modern JavaScript. Passionate about clean code and intuitive UI/UX design. I bring ideas to life through pixel-perfect implementations and seamless user experiences.";

  const typingWords = [
    "Frontend Developer",
    "React Specialist",
    "UI/UX Enthusiast",
  ];

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Fetch GitHub repositories
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('https://api.github.com/users/hemanthyaka/repos');
        const repos: Repository[] = await response.json();
        const sortedRepos = repos
          .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          .slice(0, 6);
        setProjects(sortedRepos);
      } catch (error) {
        console.error('Error fetching repositories:', error);
        // Fallback data if API fails
        setProjects([
          {
            name: "Portfolio Website",
            description: "Modern responsive portfolio built with React and Tailwind CSS",
            html_url: "https://github.com/hemanthyaka/portfolio",
            language: "JavaScript",
            topics: ["react", "tailwind", "portfolio"],
            updated_at: "2024-01-01"
          },
          {
            name: "E-commerce App",
            description: "Full-stack e-commerce application with Redux state management",
            html_url: "https://github.com/hemanthyaka/ecommerce",
            language: "React",
            topics: ["react", "redux", "ecommerce"],
            updated_at: "2024-01-01"
          }
        ]);
      }
    };

    fetchProjects();
  }, []);

  // Hero slider auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[id]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isTyping) {
      if (typedText.length < typingWords[currentWordIndex].length) {
        timeout = setTimeout(() => {
          setTypedText(typingWords[currentWordIndex].slice(0, typedText.length + 1));
        }, 100);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 1500);
      }
    } else {
      if (typedText.length === 0) {
        setCurrentWordIndex((prev) => (prev + 1) % typingWords.length);
        setIsTyping(true);
      } else {
        timeout = setTimeout(() => {
          setTypedText(typedText.slice(0, -1));
        }, 50);
      }
    }
    return () => clearTimeout(timeout);
  }, [typedText, isTyping, currentWordIndex]);

  // Form validation
  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Valid email is required";
    if (!form.message.trim()) errors.message = "Message is required";
    return errors;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMenuOpen(false);
  };

  // Add this useEffect for counter animation
  useEffect(() => {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the faster

    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target') || '0');
      let count = 0;
      const updateCount = () => {
        const increment = target / speed;
        if (count < target) {
          count += increment;
          counter.textContent = Math.ceil(count).toString();
          setTimeout(updateCount, 1);
        } else {
          counter.textContent = target.toString();
        }
      };
      updateCount();
    });
  }, [visibleElements.has('contact')]);

 

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Interactive background elements */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(206, 17, 17, 0.05), transparent 40%)`
        }}
      />
      
      {/* Enhanced floating particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-500/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <style>{`
        @media (max-width: 991px) {
          .navbar-desktop-menu { display: none !important; }
          .navbar-mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 992px) {
          .navbar-desktop-menu { display: flex !important; }
          .navbar-mobile-menu-btn { display: none !important; }
        }
      `}</style>

      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-gray-900/20 shadow-lg smooth-transition border-b border-red-500/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 sm:px-10 md:px-20 py-4">
          {/* Logo with Animation */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-red-800/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            <div className="relative text-xl font-bold text-white hover-scale cursor-pointer transform transition-all duration-300 hover:text-red-400 flex items-center gap-2">
              <span className="text-2xl">👨‍💻</span>
              <span className="relative">
                Yaka Hemanth
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 to-red-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </span>
            </div>
          </div>
          
          {/* Desktop Menu (only above 980px) */}
          <ul className="navbar-desktop-menu space-x-8">
            {[
              { label: 'Home', id: 'hero', icon: '🏠' },
              { label: 'About', id: 'about', icon: '👨‍💻' },
              { label: 'Tech', id: 'tech-stack', icon: '⚡' },
              { label: 'Projects', id: 'projects', icon: '🚀' },
              { label: 'Philosophy', id: 'philosophy', icon: '💡' },
              { label: 'Contact', id: 'contact', icon: '📧' }
            ].map((item) => (
              <li key={item.id} className="relative group">
                <button
                  onClick={() => scrollToSection(item.id)}
                  className="smooth-transition hover:text-red-500 text-gray-200 hover:scale-110 transform relative flex items-center gap-2 py-2"
                >
                  <span className="text-lg transform group-hover:rotate-12 transition-transform duration-300">{item.icon}</span>
                  <span>{item.label}</span>
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 to-red-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </button>
                {/* Hover Effect Background */}
                <div className="absolute -inset-2 bg-red-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button (only 980px and below) */}
          <div className="navbar-mobile-menu-btn hidden items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-white hover:text-red-500 hover-scale transform transition-all duration-300 relative group"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Open menu"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-red-800/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <div className="relative">
                {isMenuOpen ? (
                  <X className="w-5 h-5 transform rotate-180 transition-transform duration-300" />
                ) : (
                  <Menu className="w-5 h-5 transform transition-transform duration-300" />
                )}
              </div>
            </Button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden backdrop-blur-md bg-gray-900/40 smooth-transition animate-slide-up border-t border-red-500/10">
            <ul className="flex flex-col space-y-2 p-4">
              {[
                { label: 'Home', id: 'hero', icon: '🏠' },
                { label: 'About', id: 'about', icon: '👨‍💻' },
                { label: 'Tech', id: 'tech-stack', icon: '⚡' },
                { label: 'Projects', id: 'projects', icon: '🚀' },
                { label: 'Philosophy', id: 'philosophy', icon: '💡' },
                { label: 'Contact', id: 'contact', icon: '📧' }
              ].map((item, index) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="w-full text-left py-3 px-4 smooth-transition hover:text-red-500 text-gray-200 hover:translate-x-2 animate-fade-in relative group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="absolute -inset-2 bg-red-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                    <div className="flex items-center gap-3">
                      <span className="text-xl transform group-hover:rotate-12 transition-transform duration-300">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 to-red-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      <main className="pt-20 relative z-10">
        {/* Hero Section */}
        <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden px-4 sm:px-6 md:px-8 lg:px-20">
          <div className="w-full max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left side - Text content */}
              <div className="space-y-6 text-left order-2 lg:order-1">
                <div className="space-y-2">
                  <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight smooth-transition text-white transform ${visibleElements.has('hero') ? 'animate-fade-in scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
                    Hi, I'm Yaka Hemanth
                  </h1>
                  <div className="h-16">
                    <h2 className={`text-xl sm:text-2xl font-medium smooth-transition delay-200 text-red-400 transform ${visibleElements.has('hero') ? 'animate-slide-up' : 'opacity-0 translate-y-4'}`}>
                      <span className="inline-block min-h-[1.5em]">
                        {typedText}
                        <span className="animate-blink">|</span>
                      </span>
                    </h2>
                  </div>
                </div>
                
                <p className={`text-lg sm:text-xl font-medium smooth-transition delay-300 text-gray-200 transform ${visibleElements.has('hero') ? 'animate-slide-up' : 'opacity-0 translate-y-4'}`}>
                  Crafting pixel-perfect interfaces and seamless user experiences
                </p>
                
                {/* Enhanced CTA Buttons */}
                <div className={`flex flex-col sm:flex-row gap-4 transform ${visibleElements.has('hero') ? 'animate-fade-in' : 'opacity-0 translate-y-4'}`} style={{ animationDelay: '0.6s' }}>
                  <Button
                    onClick={() => scrollToSection('projects')}
                    className="w-full sm:w-auto px-8 py-3 bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white smooth-transition hover-scale backdrop-blur-sm pulse-glow"
                  >
                    View Projects
                  </Button>
                  <Button
                    onClick={() => scrollToSection('contact')}
                    className="w-full sm:w-auto px-8 py-3 bg-transparent border border-gray-600 text-gray-200 hover:border-red-500 hover:text-red-400 smooth-transition hover-scale"
                  >
                    Contact Me
                  </Button>
                </div>
              </div>

              {/* Right side - 3D Graphic */}
              <div className={`relative h-[300px] sm:h-[400px] lg:h-[500px] order-1 lg:order-2 transform ${visibleElements.has('hero') ? 'animate-fade-in' : 'opacity-0 translate-x-8'}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {/* Floating elements */}
                    <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-24 h-24 bg-red-500/10 rounded-lg rotate-12 animate-float-slow">
                        <Code className="w-12 h-12 text-red-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                    <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2">
                      <div className="w-32 h-32 bg-red-500/10 rounded-lg -rotate-12 animate-float-slow-delayed">
                        <Terminal className="w-16 h-16 text-red-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                    <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                      <div className="w-28 h-28 bg-red-500/10 rounded-lg rotate-45 animate-float-slow-delayed-2">
                        <Cpu className="w-14 h-14 text-red-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                    
                    {/* Central circle */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-64 h-64 rounded-full border-2 border-red-500/20 animate-pulse-slow">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/10 to-transparent animate-spin-slow" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About & Experience Section */}
        <section id="about" className="px-4 sm:px-6 md:px-8 lg:px-20 py-16 sm:py-20 relative overflow-hidden">
          {/* Creative Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 w-[800px] h-[800px] bg-gradient-to-b from-red-500/10 via-transparent to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse-slow" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-t from-red-500/5 to-transparent rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2 animate-pulse-slow" style={{ animationDelay: '1s' }} />
          </div>

          {/* Animated Grid Lines */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }} />
          </div>

          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 smooth-transition transform ${visibleElements.has('about') ? 'animate-fade-in' : 'opacity-0 translate-y-4'}`}>
                About & Experience
              </h2>
              <div className="relative w-32 h-1 mx-auto">
                <div className={`absolute inset-0 bg-gradient-to-r from-red-500 via-red-600 to-red-800 rounded-full smooth-transition transform ${visibleElements.has('about') ? 'animate-slide-up' : 'opacity-0 translate-y-4'}`} />
                <div className={`absolute inset-0 bg-gradient-to-r from-red-500 via-red-600 to-red-800 rounded-full blur-sm smooth-transition transform ${visibleElements.has('about') ? 'animate-slide-up' : 'opacity-0 translate-y-4'}`} style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
              {/* Bio Section */}
              <div className={`space-y-8 sm:space-y-10 smooth-transition delay-200 transform ${visibleElements.has('about') ? 'animate-slide-up' : 'opacity-0 translate-y-4'}`}>
                <div className="relative group perspective-1000">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-red-800 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
                  <div className="relative p-8 bg-gray-800/20 backdrop-blur-sm rounded-lg border border-gray-700/30 hover:border-red-500/30 transition-all duration-500 group-hover:scale-[1.02] group-hover:rotate-[0.5deg]">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-red-400 transition-colors flex items-center">
                      <span className="mr-2 text-2xl">👋</span> About Me
                    </h3>
                    <p className="text-base leading-relaxed text-gray-200 group-hover:text-gray-100 transition-colors">
                      {bioText}
                    </p>
                  </div>
                </div>

                {/* Skills Highlights with 3D Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {[
                    { icon: "💻", label: "Frontend Development", value: "Expert", color: "from-blue-500/20 to-blue-800/20" },
                    { icon: "🎨", label: "UI/UX Design", value: "Advanced", color: "from-purple-500/20 to-purple-800/20" },
                    { icon: "⚡", label: "Performance", value: "Optimized", color: "from-green-500/20 to-green-800/20" },
                    { icon: "🚀", label: "Problem Solving", value: "Creative", color: "from-yellow-500/20 to-yellow-800/20" }
                  ].map((skill, index) => (
                    <div 
                      key={skill.label}
                      className="relative group perspective-1000"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className={`absolute -inset-1 bg-gradient-to-r ${skill.color} rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200`} />
                      <div className="relative p-6 bg-gray-800/20 backdrop-blur-sm rounded-lg border border-gray-700/30 hover:border-red-500/30 transition-all duration-500 group-hover:scale-[1.02] group-hover:rotate-[0.5deg]">
                        <div className="flex items-center space-x-4">
                          <span className="text-3xl transform group-hover:scale-110 transition-transform duration-300">{skill.icon}</span>
                          <div>
                            <p className="text-sm text-gray-400 group-hover:text-red-300 transition-colors">{skill.label}</p>
                            <p className="text-lg font-semibold text-white group-hover:text-red-400 transition-colors">{skill.value}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience Section with Timeline */}
              <div className={`space-y-8 sm:space-y-10 smooth-transition delay-300 transform ${visibleElements.has('about') ? 'animate-slide-up' : 'opacity-0 translate-y-4'}`}>
                <div className="relative group perspective-1000">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-red-800 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
                  <div className="relative p-8 bg-gray-800/20 backdrop-blur-sm rounded-lg border border-gray-700/30 hover:border-red-500/30 transition-all duration-500 group-hover:scale-[1.02] group-hover:rotate-[0.5deg]">
                    <h3 className="text-2xl font-semibold text-white mb-8 group-hover:text-red-400 transition-colors flex items-center">
                      <span className="mr-2 text-2xl">💼</span> Professional Experience
                    </h3>
                    
                    {experienceData.map((exp, index) => (
                      <div 
                        key={exp.role}
                        className="relative pl-8 pb-8 last:pb-0 group/exp"
                        style={{ animationDelay: `${index * 0.2}s` }}
                      >
                        {/* Timeline dot with glow effect */}
                        <div className="absolute left-0 top-2 w-4 h-4 bg-red-500 rounded-full group-hover/exp:scale-150 transition-transform duration-300">
                          <div className="absolute inset-0 bg-red-500 rounded-full blur-sm opacity-0 group-hover/exp:opacity-100 transition-opacity duration-300" />
                        </div>
                        {/* Timeline line with gradient */}
                        {index !== experienceData.length - 1 && (
                          <div className="absolute left-[7px] top-6 w-0.5 h-full bg-gradient-to-b from-red-500 to-transparent group-hover/exp:bg-red-500 transition-colors duration-300" />
                        )}
                        
                        <div className="space-y-2 transform group-hover/exp:translate-x-2 transition-transform duration-300">
                          <h4 className="text-xl font-semibold text-white group-hover/exp:text-red-400 transition-colors">
                            {exp.role}
                          </h4>
                          <p className="text-sm uppercase tracking-wide text-gray-200 group-hover/exp:text-red-300 transition-colors">
                            {exp.company} • {exp.period}
                          </p>
                          <p className="text-gray-200 group-hover/exp:text-gray-100 transition-colors">
                            {exp.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats with 3D Effect */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  {[
                    { value: "1+", label: "Years Experience", icon: "⏳" },
                    { value: "10+", label: "Projects", icon: "📦" },
                    { value: "98%", label: "Satisfaction", icon: "⭐" }
                  ].map((stat, index) => (
                    <div 
                      key={stat.label}
                      className="relative group perspective-1000"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-red-800/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                      <div className="relative p-6 bg-gray-800/20 backdrop-blur-sm rounded-lg border border-gray-700/30 hover:border-red-500/30 transition-all duration-500 group-hover:scale-[1.02] group-hover:rotate-[0.5deg] text-center">
                        <span className="text-3xl mb-2 block transform group-hover:scale-110 transition-transform duration-300">{stat.icon}</span>
                        <p className="text-2xl font-bold text-white group-hover:text-red-400 transition-colors">{stat.value}</p>
                        <p className="text-sm text-gray-400 group-hover:text-red-300 transition-colors">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section id="tech-stack" className="px-4 sm:px-6 md:px-8 lg:px-20 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto">
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8 sm:mb-12 smooth-transition transform ${visibleElements.has('tech-stack') ? 'animate-fade-in' : 'opacity-0 translate-y-4'}`}>
              Tech Stack
            </h2>
            
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center smooth-transition delay-200 transform ${visibleElements.has('tech-stack') ? 'animate-slide-up' : 'opacity-0 translate-y-4'}`}>
              {/* Animated Graphic */}
              <div className="relative h-[400px] hidden md:block">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 400 400">
                    {/* Outer Ring */}
                    <circle
                      cx="200"
                      cy="200"
                      r="180"
                      fill="none"
                      stroke="#1f2937"
                      strokeWidth="2"
                      className="animate-spin-slow"
                    />
                    {/* Inner Ring */}
                    <circle
                      cx="200"
                      cy="200"
                      r="150"
                      fill="none"
                      stroke="#1f2937"
                      strokeWidth="2"
                      className="animate-spin-slow-reverse"
                    />
                    {/* Tech Icons */}
                    {techStack.map((tech, index) => {
                      const angle = (index * 360) / techStack.length;
                      const x = 200 + 150 * Math.cos((angle * Math.PI) / 180);
                      const y = 200 + 150 * Math.sin((angle * Math.PI) / 180);
                      return (
                        <g key={tech.name} transform={`translate(${x}, ${y})`}>
                          <circle
                            cx="0"
                            cy="0"
                            r="20"
                            fill="#1f2937"
                            className="group-hover:fill-red-500/20 transition-colors"
                          />
                          <text
                            x="0"
                            y="0"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="text-xs fill-gray-400"
                          >
                            {tech.name.slice(0, 2)}
                          </text>
                        </g>
                      );
                    })}
                    {/* Center Circle */}
                    <circle
                      cx="200"
                      cy="200"
                      r="50"
                      fill="#1f2937"
                      className="animate-pulse-slow"
                    />
                    <text
                      x="200"
                      y="200"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xl fill-white font-bold"
                    >
                      Tech
                    </text>
                  </svg>
                </div>
              </div>

              {/* Skills Visualization */}
              <div className="space-y-6">
                {techStack.map((tech, index) => (
                  <div
                    key={tech.name}
                    className="group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-200 font-medium">{tech.name}</span>
                      <span className="text-gray-400">{tech.percentage}%</span>
                    </div>
                    <div className="h-3 bg-gray-800/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-600 to-red-800 rounded-full transition-all duration-500 ease-out relative"
                        style={{ 
                          width: `${tech.percentage}%`,
                          transform: 'scaleX(0)',
                          transformOrigin: 'left',
                          animation: `progressFill 1s ease-out ${index * 0.1}s forwards`
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="px-4 sm:px-6 md:px-8 lg:px-20 py-16 sm:py-20 relative overflow-hidden">
          {/* Creative Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 w-[1000px] h-[1000px] bg-gradient-to-b from-red-500/10 via-transparent to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse-slow" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-t from-red-500/5 to-transparent rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2 animate-pulse-slow" style={{ animationDelay: '1s' }} />
          </div>

          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }} />
          </div>

          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 smooth-transition transform ${visibleElements.has('projects') ? 'animate-fade-in' : 'opacity-0 translate-y-4'}`}>
                Featured Projects
              </h2>
              <div className="relative w-32 h-1 mx-auto">
                <div className={`absolute inset-0 bg-gradient-to-r from-red-500 via-red-600 to-red-800 rounded-full smooth-transition transform ${visibleElements.has('projects') ? 'animate-slide-up' : 'opacity-0 translate-y-4'}`} />
                <div className={`absolute inset-0 bg-gradient-to-r from-red-500 via-red-600 to-red-800 rounded-full blur-sm smooth-transition transform ${visibleElements.has('projects') ? 'animate-slide-up' : 'opacity-0 translate-y-4'}`} style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {projects.map((project, index) => (
                <div 
                  key={project.name || index}
                  className={`group perspective-1000 ${visibleElements.has('projects') ? 'animate-slide-up' : 'opacity-0 translate-y-4'}`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {/* Card Container with 3D Effect */}
                  <div className="relative h-full transform-gpu transition-all duration-500 group-hover:scale-[1.02] group-hover:rotate-[0.5deg]">
                    {/* Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 via-red-600/20 to-red-800/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                    
                    {/* Main Card */}
                    <div className="relative h-full bg-gray-800/20 backdrop-blur-sm rounded-lg border border-gray-700/30 hover:border-red-500/30 transition-all duration-500 overflow-hidden">
                      {/* Project Image/Icon Container */}
                      <div className="relative h-48 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-700/50 to-gray-800/50 group-hover:from-red-500/20 group-hover:to-red-800/20 transition-colors duration-500" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Folder className="w-20 h-20 text-gray-300 group-hover:text-red-400 transition-colors duration-500 transform group-hover:scale-110 group-hover:rotate-12" />
                        </div>
                        {/* Animated Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      </div>
                      
                      {/* Project Content */}
                      <div className="p-6 space-y-4">
                        {/* Title and Language */}
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-semibold text-white group-hover:text-red-400 transition-colors duration-300">
                            {project.name}
                          </h3>
                          {project.language && (
                            <span className="px-3 py-1 text-xs uppercase tracking-wide text-gray-200 group-hover:text-red-300 transition-colors duration-300 bg-gray-700/50 group-hover:bg-red-500/20 rounded-full">
                              {project.language}
                            </span>
                          )}
                        </div>
                        
                        {/* Description */}
                        <p className="text-gray-200 group-hover:text-gray-100 transition-colors duration-300 line-clamp-3">
                          {project.description || "No description available"}
                        </p>
                        
                        {/* Topics */}
                        {project.topics && (
                          <div className="flex flex-wrap gap-2">
                            {project.topics.slice(0, 3).map((topic) => (
                              <span
                                key={topic}
                                className="px-3 py-1 text-xs rounded-full bg-gray-700/50 text-gray-200 group-hover:bg-red-500/20 group-hover:text-red-300 transition-all duration-300 transform group-hover:scale-105"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* GitHub Link */}
                        <a
                          href={project.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-base font-medium text-red-500 hover:text-red-400 transition-colors duration-300 group/link"
                          aria-label={`View ${project.name} on GitHub`}
                        >
                          View on GitHub
                          <span className="transform group-hover/link:translate-x-1 transition-transform duration-300">→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View More Button */}
            <div className={`text-center mt-12 ${visibleElements.has('projects') ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
              <a
                href="https://github.com/hemanthyaka"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-500 rounded-lg backdrop-blur-sm hover:scale-105 transform group"
              >
                View More Projects
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* Design Philosophy Section */}
        <section id="philosophy" className="px-4 sm:px-6 md:px-8 lg:px-20 py-16 sm:py-20 relative overflow-hidden">
          {/* Creative Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 w-[800px] h-[800px] bg-gradient-to-b from-red-500/10 via-transparent to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse-slow" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-t from-red-500/5 to-transparent rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2 animate-pulse-slow" style={{ animationDelay: '1s' }} />
          </div>

          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }} />
          </div>

          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 smooth-transition transform ${visibleElements.has('philosophy') ? 'animate-fade-in' : 'opacity-0 translate-y-4'}`}>
                Design Philosophy
              </h2>
              <div className="relative w-32 h-1 mx-auto">
                <div className={`absolute inset-0 bg-gradient-to-r from-red-500 via-red-600 to-red-800 rounded-full smooth-transition transform ${visibleElements.has('philosophy') ? 'animate-slide-up' : 'opacity-0 translate-y-4'}`} />
                <div className={`absolute inset-0 bg-gradient-to-r from-red-500 via-red-600 to-red-800 rounded-full blur-sm smooth-transition transform ${visibleElements.has('philosophy') ? 'animate-slide-up' : 'opacity-0 translate-y-4'}`} style={{ animationDelay: '0.2s' }} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Side - Decorative Graphics */}
              <div className={`relative h-[500px] hidden md:block ${visibleElements.has('philosophy') ? 'animate-fade-in' : 'opacity-0 translate-x-8'}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Rotating Rings */}
                  <div className="relative w-full h-full">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-64 h-64 rounded-full border-2 border-red-500/20 animate-spin-slow">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/10 to-transparent animate-pulse-slow" />
                      </div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-red-500/20 animate-spin-slow-reverse">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent to-red-500/10 animate-pulse-slow" style={{ animationDelay: '0.5s' }} />
                      </div>
                    </div>

                    {/* Floating Elements */}
                    <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-24 h-24 bg-red-500/10 rounded-lg rotate-12 animate-float-slow">
                        <Code className="w-12 h-12 text-red-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                    <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2">
                      <div className="w-32 h-32 bg-red-500/10 rounded-lg -rotate-12 animate-float-slow-delayed">
                        <Terminal className="w-16 h-16 text-red-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                    <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                      <div className="w-28 h-28 bg-red-500/10 rounded-lg rotate-45 animate-float-slow-delayed-2">
                        <Cpu className="w-14 h-14 text-red-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Philosophy Content */}
              <div className={`space-y-8 ${visibleElements.has('philosophy') ? 'animate-slide-up' : 'opacity-0 translate-y-4'}`}>
                <div className="relative group perspective-1000">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-red-800 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
                  <div className="relative p-8 bg-gray-800/20 backdrop-blur-sm rounded-lg border border-gray-700/30 hover:border-red-500/30 transition-all duration-500 group-hover:scale-[1.02] group-hover:rotate-[0.5deg]">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Philosophy Points */}
                    <div className="space-y-6">
                      {[
                        {
                          icon: "🎨",
                          title: "Minimalist Aesthetics",
                          description: "Embracing white space and clean design principles to create intuitive and elegant interfaces."
                        },
                        {
                          icon: "⚡",
                          title: "Performance First",
                          description: "Optimizing every aspect for speed and efficiency, ensuring seamless user experiences."
                        },
                        {
                          icon: "💡",
                          title: "Creative Innovation",
                          description: "Pushing boundaries while maintaining usability, finding the perfect balance between form and function."
                        }
                      ].map((point, index) => (
                        <div 
                          key={point.title}
                          className="relative group/point"
                          style={{ animationDelay: `${index * 0.2}s` }}
                        >
                          <div className="flex items-start space-x-4">
                            <span className="text-3xl transform group-hover/point:scale-110 transition-transform duration-300">{point.icon}</span>
                            <div>
                              <h3 className="text-xl font-semibold text-white group-hover/point:text-red-400 transition-colors duration-300">
                                {point.title}
                              </h3>
                              <p className="mt-2 text-gray-200 group-hover/point:text-gray-100 transition-colors duration-300">
                                {point.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="px-4 sm:px-6 md:px-8 lg:px-20 py-16 sm:py-20 relative overflow-hidden">
          {/* Creative Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 w-[800px] h-[800px] bg-gradient-to-b from-red-500/10 via-transparent to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse-slow" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-t from-red-500/5 to-transparent rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2 animate-pulse-slow" style={{ animationDelay: '1s' }} />
          </div>

          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }} />
          </div>

          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 smooth-transition transform ${visibleElements.has('contact') ? 'animate-fade-in' : 'opacity-0 translate-y-4'}`}>
                Get in Touch
              </h2>
              <div className="relative w-32 h-1 mx-auto">
                <div className={`absolute inset-0 bg-gradient-to-r from-red-500 via-red-600 to-red-800 rounded-full smooth-transition transform ${visibleElements.has('contact') ? 'animate-slide-up' : 'opacity-0 translate-y-4'}`} />
                <div className={`absolute inset-0 bg-gradient-to-r from-red-500 via-red-600 to-red-800 rounded-full blur-sm smooth-transition transform ${visibleElements.has('contact') ? 'animate-slide-up' : 'opacity-0 translate-y-4'}`} style={{ animationDelay: '0.2s' }} />
              </div>
            </div>

            {/* Stats Counter Section */}
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16 ${visibleElements.has('contact') ? 'animate-fade-in' : 'opacity-0'}`}>
              {[
                { value: 10, label: "Projects Completed", icon: "🚀", suffix: "+" },
                { value: 98, label: "Client Satisfaction", icon: "⭐", suffix: "%" },
                { value: 1, label: "Years Experience", icon: "⏳", suffix: "+" },
                { value: 24, label: "Hours Response", icon: "⚡", suffix: "h" }
              ].map((stat, index) => (
                <div 
                  key={stat.label}
                  className="relative group perspective-1000"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-red-800/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                  <div className="relative p-6 bg-gray-800/20 backdrop-blur-sm rounded-lg border border-gray-700/30 hover:border-red-500/30 transition-all duration-500 group-hover:scale-[1.02] group-hover:rotate-[0.5deg] text-center">
                    <span className="text-3xl mb-2 block transform group-hover:scale-110 transition-transform duration-300">{stat.icon}</span>
                    <div className="relative">
                      <span className="text-3xl font-bold text-white group-hover:text-red-400 transition-colors">
                        <span className="counter" data-target={stat.value}>0</span>{stat.suffix}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                    <p className="text-sm text-gray-400 group-hover:text-red-300 transition-colors mt-2">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Side - Contact Form */}
              <div className={`space-y-6 ${visibleElements.has('contact') ? 'animate-slide-up' : 'opacity-0 translate-y-4'}`}>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="group">
                    <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-200 group-focus-within:text-red-400 transition-colors">
                      Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full smooth-transition ${formErrors.name ? 'border-red-500' : ''} bg-gray-800/50 border-gray-600 text-white backdrop-blur-sm hover:bg-gray-800/70 focus:bg-gray-800/70 focus:border-red-500/50 hover:scale-105 transform`}
                      aria-required="true"
                      aria-describedby={formErrors.name ? "name-error" : undefined}
                    />
                    {formErrors.name && (
                      <p id="name-error" className="text-red-500 text-sm mt-1 animate-fade-in">{formErrors.name}</p>
                    )}
                  </div>

                  <div className="group">
                    <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-200 group-focus-within:text-red-400 transition-colors">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full smooth-transition ${formErrors.email ? 'border-red-500' : ''} bg-gray-800/50 border-gray-600 text-white backdrop-blur-sm hover:bg-gray-800/70 focus:bg-gray-800/70 focus:border-red-500/50 hover:scale-105 transform`}
                      aria-required="true"
                      aria-describedby={formErrors.email ? "email-error" : undefined}
                    />
                    {formErrors.email && (
                      <p id="email-error" className="text-red-500 text-sm mt-1 animate-fade-in">{formErrors.email}</p>
                    )}
                  </div>

                  <div className="group">
                    <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-200 group-focus-within:text-red-400 transition-colors">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      value={form.message}
                      onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                      rows={5}
                      className={`w-full smooth-transition ${formErrors.message ? 'border-red-500' : ''} bg-gray-800/50 border-gray-600 text-white backdrop-blur-sm hover:bg-gray-800/70 focus:bg-gray-800/70 focus:border-red-500/50 hover:scale-105 transform`}
                      aria-required="true"
                      aria-describedby={formErrors.message ? "message-error" : undefined}
                    />
                    {formErrors.message && (
                      <p id="message-error" className="text-red-500 text-sm mt-1 animate-fade-in">{formErrors.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-red-500/80 text-white hover:bg-red-600 smooth-transition disabled:opacity-50 hover-scale transform hover:scale-105 backdrop-blur-sm border border-red-500/50 pulse-glow"
                    aria-label="Send Message"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>

                  {submitStatus && (
                    <div className={`text-center animate-fade-in ${submitStatus === 'success' ? 'text-green-400' : 'text-red-400'}`} aria-live="assertive">
                      {submitStatus === 'success' 
                        ? 'Thank you! Your message has been sent.' 
                        : 'Oops! Something went wrong. Please try again.'
                      }
                    </div>
                  )}
                </form>
              </div>

              {/* Right Side - Decorative Elements */}
              <div className={`relative h-[500px] hidden md:block ${visibleElements.has('contact') ? 'animate-fade-in' : 'opacity-0 translate-x-8'}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Animated Envelope */}
                  <div className="relative w-64 h-64">
                    <div className="absolute inset-0 bg-red-500/10 rounded-lg transform rotate-12 animate-float-slow">
                      <div className="absolute inset-4 bg-red-500/5 rounded-lg" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-32 h-32 text-red-400 animate-pulse-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <path d="M22 6l-10 7L2 6" />
                      </svg>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-24 h-24 bg-red-500/10 rounded-lg rotate-12 animate-float-slow-delayed">
                      <Github className="w-12 h-12 text-red-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                  <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2">
                    <div className="w-32 h-32 bg-red-500/10 rounded-lg -rotate-12 animate-float-slow">
                      <Linkedin className="w-16 h-16 text-red-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                  <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                    <div className="w-28 h-28 bg-red-500/10 rounded-lg rotate-45 animate-float-slow-delayed-2">
                      <Twitter className="w-14 h-14 text-red-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Rotating Rings */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-80 h-80 rounded-full border-2 border-red-500/20 animate-spin-slow">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/10 to-transparent animate-pulse-slow" />
                    </div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-2 border-red-500/20 animate-spin-slow-reverse">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent to-red-500/10 animate-pulse-slow" style={{ animationDelay: '0.5s' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Footer */}
        <footer className="relative border-t border-gray-700/50 overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute bottom-0 left-1/2 w-[800px] h-[800px] bg-gradient-to-t from-red-500/5 via-transparent to-transparent rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2 animate-pulse-slow" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-red-500/5 to-transparent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 animate-pulse-slow" style={{ animationDelay: '1s' }} />
          </div>

          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-20">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 py-12 sm:py-16">
              {/* Brand Section */}
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-red-800/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                  <div className="relative flex items-center space-x-2">
                    <span className="text-2xl transform group-hover:rotate-12 transition-transform duration-300">👨‍💻</span>
                    <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">Yaka Hemanth</h3>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Crafting digital experiences with passion and precision. Let's build something amazing together.
                </p>
                {/* Social Links */}
                <div className="flex space-x-4 pt-4">
                  {[
                    { icon: Github, href: 'https://github.com/hemanthyaka', label: 'GitHub' },
                    { icon: Linkedin, href: 'https://www.linkedin.com/in/yaka-hemanth-ba111227a/', label: 'LinkedIn' },
                    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' }
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative group"
                      aria-label={social.label}
                    >
                      <div className="absolute -inset-2 bg-gradient-to-r from-red-500/20 to-red-800/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                      <div className="relative p-2 text-gray-400 hover:text-red-400 transition-colors duration-300 transform group-hover:scale-110 group-hover:rotate-12">
                        <social.icon className="w-5 h-5" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                <ul className="space-y-3">
                  {[
                    { label: 'Home', id: 'hero', icon: '🏠' },
                    { label: 'About', id: 'about', icon: '👨‍💻' },
                    { label: 'Projects', id: 'projects', icon: '🚀' },
                    { label: 'Contact', id: 'contact', icon: '📧' }
                  ].map((link) => (
                    <li key={link.id}>
                      <button
                        onClick={() => scrollToSection(link.id)}
                        className="w-full text-left text-gray-400 hover:text-red-400 transition-colors duration-300 flex items-center group"
                      >
                        <span className="text-lg mr-2 transform group-hover:rotate-12 transition-transform duration-300">{link.icon}</span>
                        <span className="relative">
                          {link.label}
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-400 group-hover:w-full transition-all duration-300" />
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
                <div className="space-y-3">
                  <a
                    href="mailto:yakahemanth3@gmail.com"
                    className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors duration-300 group"
                  >
                    <span className="text-lg transform group-hover:rotate-12 transition-transform duration-300">📧</span>
                    <span>yakahemanth3@gmail.com</span>
                  </a>
                  {/* Newsletter Signup */}
                  <div className="pt-4">
                    <h4 className="text-sm font-medium text-white mb-2">Stay Updated</h4>
                    <div className="relative group">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors duration-300"
                      />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30 transition-colors duration-300">
                        Subscribe
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-700/50 py-6">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <p className="text-sm text-gray-400">
                  © {new Date().getFullYear()} Yaka Hemanth. All rights reserved.
                </p>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-400">Built with</span>
                  <div className="flex space-x-2">
                    <span className="text-lg transform hover:rotate-12 transition-transform duration-300">⚛️</span>
                    <span className="text-lg transform hover:rotate-12 transition-transform duration-300">🎨</span>
                    <span className="text-lg transform hover:rotate-12 transition-transform duration-300">💻</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Portfolio;
