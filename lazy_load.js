const fs = require('fs');

let projects = fs.readFileSync('src/components/AllProjectsPage.tsx', 'utf8');
projects = projects.replace(
  '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">',
  '<h2 className="text-xl md:text-3xl font-display font-bold text-white mb-6 tracking-tighter">Elite Next.js Architectures & AI Chatbot Integrations</h2>\n          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">'
);
projects = projects.replace(
  '<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">',
  '<h2 className="text-xl md:text-3xl font-display font-bold text-white mb-6 tracking-tighter">Elite Next.js Architectures & AI Chatbot Integrations</h2>\n          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">'
);
fs.writeFileSync('src/components/AllProjectsPage.tsx', projects);

let skills = fs.readFileSync('src/components/MySkillsPage.tsx', 'utf8');
skills = skills.replace(
  '<div className="max-w-7xl mx-auto space-y-24">',
  '<div className="max-w-7xl mx-auto space-y-24">\n          <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tighter text-center pt-8">Advanced Engineering: React, Next.js, and Generative AI</h2>'
);
fs.writeFileSync('src/components/MySkillsPage.tsx', skills);

let plans = fs.readFileSync('src/components/WebsitePlansPage.tsx', 'utf8');
plans = plans.replace(
  '<div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-stretch justify-center pt-12">',
  '<h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tighter text-center pt-8 mb-4">Scalable Web Development Packages for International Brands</h2>\n        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-stretch justify-center pt-12">'
);
fs.writeFileSync('src/components/WebsitePlansPage.tsx', plans);

let contact = fs.readFileSync('src/components/ContactTeamPage.tsx', 'utf8');
contact = contact.replace(
  '<h1 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tighter mb-4">',
  '<h2 className="text-3xl md:text-5xl font-display font-bold text-accent tracking-tighter mb-4">Hire Muhammad Saqib: Faisalabad\'s Top-Tier Technical Partner</h2>\n              <h1 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tighter mb-4">'
);
fs.writeFileSync('src/components/ContactTeamPage.tsx', contact);
