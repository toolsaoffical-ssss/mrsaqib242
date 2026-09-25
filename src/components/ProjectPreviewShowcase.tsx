import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, LayoutGrid, Lock } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

interface ProjectPreviewShowcaseProps {
  onViewAll?: () => void;
}

function PreviewCard({ project, idx }: { project: any, idx: number, key?: any }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      className="rambo-card group relative cursor-pointer"
    >
      <a 
        href={project.url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="absolute inset-0 z-30"
        aria-label={`View ${project.name}`}
      />

      <div ref={ref} className="preview-container relative">
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex flex-col items-center justify-center gap-2">
          <div className="bg-white text-black font-black px-6 py-2.5 rounded-full text-sm flex items-center gap-2 shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            View Project <ExternalLink size={16} />
          </div>
        </div>

        {project.restricted ? (
          <div className="restricted-preview">
            <div className="mb-4 p-4 rounded-full bg-white/10">
              <Lock className="w-12 h-12 text-white" />
            </div>
            <h4 className="text-xl font-bold mb-2">Security Restricted</h4>
            <p className="text-xs text-gray-400 mb-6 px-4">Hosting provider forbids direct embedding for security. Click anywhere on card to open.</p>
          </div>
        ) : inView ? (
          <>
            <div className="absolute inset-0 z-10 md:hidden"></div>
            <iframe 
              src={project.url} 
              className="preview-iframe"
              title={project.name}
              loading="lazy"
            ></iframe>
          </>
        ) : null}
      </div>
      
      <div className="project-info relative z-20">
        <div>
          <span className="text-[9px] uppercase font-black text-blue-600 tracking-tighter">{project.tags[0]}</span>
          <h3 className="text-lg md:text-xl font-black leading-none text-zinc-900">{project.name}</h3>
        </div>
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100 border-2 border-zinc-200 group-hover:bg-black group-hover:border-black group-hover:text-white transition-colors duration-300">
          <ExternalLink size={18} className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectPreviewShowcase({ onViewAll }: ProjectPreviewShowcaseProps) {
  const [showAll, setShowAll] = useState(false);

  const handleViewAllClick = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      setShowAll(true);
    }
  };

  const projects = [
    { name: "MS Pro Portfolio", url: "https://mspro.zone.id", tags: ["Portfolio"], restricted: false },
    { name: "Pro Tool Kit", url: "https://protool.zone.id", tags: ["Dev Tools"], restricted: false },
    { name: "Tech AI", url: "https://techai.zone.id", tags: ["AI & Tech"], restricted: false },
    { name: "Saqib AI Chatbot", url: "https://saqibaichabot.vercel.app/", tags: ["AI & Tech"], restricted: false },
    { name: "Open Bazaar", url: "https://openbazaar.vercel.app", tags: ["E-Commerce"], restricted: false },
    { name: "Shoes Store", url: "https://shoes.zone.id", tags: ["E-Commerce"], restricted: false },
    { name: "Saqib TV", url: "https://saqibtv.vercel.app", tags: ["Entertainment"], restricted: false },
    { name: "Birthday Creator", url: "https://ms-birthday-seven.vercel.app", tags: ["Personal"], restricted: false },
    { name: "Animation Hub", url: "https://animationhub-gamma.vercel.app", tags: ["UI Resources"], restricted: false },
    { name: "Image Toolkit", url: "https://ms-imgtourl.vercel.app", tags: ["Media Tools"], restricted: false },
    { name: "PBX Official", url: "https://pbxofficial.zone.id", tags: ["Gaming"], restricted: false },
    { name: "Shot Link Tracker", url: "https://shot.zone.id", tags: ["Utilities"], restricted: false }
  ];

  return (
    <section id="projects-showcase" className="py-20 md:py-32 px-6 bg-zinc-50 relative min-h-[80vh]">
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --rgb-gradient: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
        }
        .rambo-text {
            background: var(--rgb-gradient);
            background-size: 300% 300%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradient-move 4s linear infinite;
        }
        .rambo-card {
            position: relative;
            background: #fff;
            border-radius: 1.25rem;
            transition: all 0.3s ease;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            display: flex;
            flex-direction: column;
        }
        .rambo-card::before {
            content: '';
            position: absolute;
            inset: 0;
            padding: 3px; 
            border-radius: 1.25rem;
            background: var(--rgb-gradient);
            background-size: 300% 300%;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            animation: gradient-move 4s linear infinite;
            opacity: 0.6;
            pointer-events: none;
        }
        @keyframes gradient-move {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .preview-container {
            position: relative;
            width: 100%;
            height: 300px;
            background: #fdfdfd;
            overflow: hidden;
            border-radius: 1.25rem 1.25rem 0 0;
        }
        @media (min-width: 768px) {
            .preview-container { height: 400px; }
        }
        .preview-iframe {
            width: 133.33%; 
            height: 133.33%;
            border: none;
            transform: scale(0.75);
            transform-origin: 0 0;
            pointer-events: none;
        }
        .restricted-preview {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #111;
            color: white;
            text-align: center;
            padding: 20px;
        }
        .project-info {
            padding: 1.25rem;
            background: white;
            border-top: 1px solid #f0f0f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 10;
        }
        .back-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            border-radius: 99px;
            font-weight: 800;
            font-size: 14px;
            position: relative;
            background: white;
            transition: all 0.3s ease;
            border: 2px solid transparent;
            background-image: linear-gradient(white, white), var(--rgb-gradient);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            background-size: 400% 400%;
            animation: gradient-move 4s linear infinite;
            color: #1a1a1a;
            text-decoration: none;
            cursor: pointer;
        }
        .back-btn:hover {
            transform: scale(1.05);
        }
      `}} />

      <div className="w-full max-w-[1400px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-8xl font-black mb-6 tracking-tight leading-[1.1] text-zinc-900">
            Modern <br/><span className="rambo-text">Showcase</span>
          </h2>
          <p className="text-zinc-500 text-sm md:text-lg max-w-xl mx-auto mb-8">
            Interactive tools and technical projects by Saqib.
          </p>
          
          {!showAll && (
            <button 
              onClick={handleViewAllClick}
              className="back-btn mx-auto"
            >
              <LayoutGrid size={18} /> View All Projects
            </button>
          )}
        </div>

        <div className={`grid gap-6 md:gap-10 ${showAll ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-3xl mx-auto'}`}>
          {(showAll ? projects : [projects[0]]).map((project, idx) => (
            <PreviewCard project={project} idx={idx} key={idx} />
          ))}
        </div>
        
        {showAll && (
          <div className="mt-12 text-center">
            <button 
              onClick={() => setShowAll(false)}
              className="back-btn mx-auto"
            >
              Show Less
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
