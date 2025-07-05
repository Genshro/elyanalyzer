import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon, 
  UsersIcon,
  HeartIcon,
  GlobeAltIcon,
  RocketLaunchIcon,
  EyeIcon,
  BeakerIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import Footer from '../components/Footer';

const About: React.FC = () => {
  const values = [
    {
      icon: ShieldCheckIcon,
      title: "Privacy First",
      description: "We believe your code is your intellectual property. That's why we built ElyAnalyzer to work entirely offline, ensuring your code never leaves your machine."
    },
    {
      icon: BeakerIcon,
      title: "Innovation Pioneer",
      description: "We created the world's first AI hallucination detection technology for code analysis, preventing developers from implementing fictional APIs and non-existent libraries."
    },
    {
      icon: UsersIcon,
      title: "Developer-Centric",
      description: "Built by developers, for developers. Every feature is designed with the developer experience in mind, making complex analysis simple and actionable."
    },
    {
      icon: HeartIcon,
      title: "Quality Obsessed",
      description: "We're passionate about code quality and believe that better code leads to better software, which ultimately makes the world a better place."
    }
  ];

  const stats = [
    { number: "15+", label: "Specialized Analyzers" },
    { number: "14+", label: "Programming Languages" },
    { number: "100%", label: "Local Processing" },
    { number: "🇨🇭", label: "Made in Switzerland" }
  ];

  const timeline = [
    {
      year: "2024",
      title: "The Vision",
      description: "ElyAnalyzer was born from a simple observation: developers needed better tools to understand and improve their code, but existing solutions compromised on privacy."
    },
    {
      year: "Q1 2024",
      title: "First Prototype",
      description: "We built our first code analysis engine, focusing on security vulnerabilities and code quality issues with complete offline processing."
    },
    {
      year: "Q2 2024",
      title: "AI Hallucination Detection",
      description: "Breakthrough innovation: created the world's first AI hallucination detector for code analysis, identifying fictional APIs and non-existent libraries suggested by AI tools."
    },
    {
      year: "Q3 2024",
      title: "15 Analyzers & Desktop-First",
      description: "Expanded to 15 specialized analyzers and launched our Tauri-based desktop application, ensuring complete privacy with offline processing."
    },
    {
      year: "2025",
      title: "Global Launch",
      description: "Released ElyAnalyzer to developers worldwide with support for 14+ programming languages and dual output formats (Interactive HTML + JSON)."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0 bg-hero-pattern" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/20 rounded-full px-6 py-3 mb-6">
              <StarIcon className="h-5 w-5 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">
                🌍 World's First AI Hallucination Detection
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              About
              <span className="gradient-text">
                {" "}ElyAnalyzer
              </span>
            </h1>
            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
              We're on a mission to revolutionize code analysis by putting privacy, quality, and developer experience at the heart of everything we do. 
              Featuring the world's first AI hallucination detection technology.
            </p>
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-500/10 to-white/10 backdrop-blur-xl border border-red-500/20 rounded-full px-6 py-3">
              <span className="text-sm font-medium text-red-300">
                Made in Bern, Switzerland
              </span>
              <span className="text-sm font-medium text-white">
                🇨🇭
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Revolutionary Technology Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Revolutionary Innovation</span>
            </h2>
            <p className="text-xl text-slate-200 max-w-3xl mx-auto">
              We didn't just build another code analyzer - we created breakthrough technology that doesn't exist anywhere else in the world.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="glass rounded-2xl p-8">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl mr-4">
                    <BeakerIcon className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">World's First AI Hallucination Detector</h3>
                </div>
                <p className="text-slate-200 leading-relaxed">
                  Our groundbreaking technology can detect when AI-generated code contains fictional APIs, non-existent libraries, 
                  or imaginary methods. This prevents developers from wasting hours debugging code that was never meant to work.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="glass rounded-2xl p-8">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl mr-4">
                    <GlobeAltIcon className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Dual Output Innovation</h3>
                </div>
                <p className="text-slate-200 leading-relaxed">
                  Beautiful interactive HTML reports for human consumption and structured JSON data for seamless IDE integration. 
                  No other analyzer offers this perfect balance of visual appeal and technical utility.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-8"
            >
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl mr-4">
                  <RocketLaunchIcon className="h-8 w-8 text-purple-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">Our Mission</h2>
              </div>
              <p className="text-slate-300 text-lg leading-relaxed">
                To empower developers with comprehensive, privacy-first code analysis tools that make complex codebases understandable, 
                secure, and maintainable. We believe that great software starts with great code, and great code starts with great analysis.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-8"
            >
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl mr-4">
                  <EyeIcon className="h-8 w-8 text-cyan-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">Our Vision</h2>
              </div>
              <p className="text-slate-300 text-lg leading-relaxed">
                A world where every developer has access to enterprise-grade code analysis tools without compromising on privacy or security. 
                We envision a future where code quality is never an afterthought, but an integral part of the development process.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                Our Values
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              The principles that guide everything we do at ElyAnalyzer
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl flex-shrink-0">
                    <value.icon className="h-8 w-8 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">By the Numbers</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              The impact and scope of ElyAnalyzer's capabilities
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-300 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Our Journey</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              From concept to revolutionary code analysis platform
            </p>
          </motion.div>

          <div className="space-y-8">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0 w-24 text-right">
                    <span className="text-lg font-bold gradient-text">{item.year}</span>
                  </div>
                  <div className="flex-shrink-0 w-4 h-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></div>
                  <div className="flex-1 glass rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-slate-300">{item.description}</p>
                  </div>
                </div>
                {index < timeline.length - 1 && (
                  <div className="absolute left-[7.5rem] top-8 w-0.5 h-8 bg-gradient-to-b from-purple-500/50 to-cyan-500/50"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="gradient-text">Join the Revolution</span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Be part of the future of code analysis. Experience the world's first AI hallucination detection 
              and privacy-first analysis platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-lg px-8 py-4">
                Download ElyAnalyzer
              </button>
              <button className="btn-secondary text-lg px-8 py-4">
                View on GitHub
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About; 