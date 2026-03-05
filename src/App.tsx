/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { ExternalLink, CheckCircle2, Settings, Terminal, Shield, Cpu, Activity } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-white font-sans p-8 selection:bg-accent/30 relative overflow-hidden cyber-grid">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="scanline" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-16 flicker"
        >
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-accent rounded-sm flex items-center justify-center text-black shadow-[0_0_20px_rgba(0,255,127,0.4)] glitch-logo">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path d="M19 10h-1.5L16 3H8L6.5 10H5c-1.1 0-2 .9-2 2v1h18v-1c0-1.1-.9-2-2-2zM7 15c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm10 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-7 3h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase font-mono">JobFilter AI</h1>
              <p className="text-[10px] text-accent font-bold uppercase tracking-[0.3em] font-mono">Neural Analysis Extension</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-2 bg-accent/5 text-accent rounded-sm text-[10px] font-bold uppercase tracking-widest border border-accent/20 backdrop-blur-md font-mono">
            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse shadow-[0_0_10px_rgba(0,255,127,0.8)]" />
            SCANNER_ACTIVE
          </div>
        </motion.header>

        <motion.section 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-black/40 border border-white/5 backdrop-blur-md rounded-sm p-12 relative mb-12"
        >
          {/* Corner Brackets */}
          <div className="corner-bracket corner-tl" />
          <div className="corner-bracket corner-tr" />
          <div className="corner-bracket corner-bl" />
          <div className="corner-bracket corner-br" />

          <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-6">
            <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3 font-mono">
              <Terminal className="w-5 h-5 text-accent" />
              Deployment Protocol
            </h2>
            <div className="text-[10px] text-white/30 font-mono uppercase tracking-widest">
              ID: 0x7F-SCANNER
            </div>
          </div>
          
          <div className="grid gap-10">
            {[
              { title: "EXTRACT_CORE", desc: "Download project source and extract to local environment." },
              { title: "LINK_BROWSER", desc: "Access chrome://extensions in your terminal interface." },
              { title: "BYPASS_RESTRICTIONS", desc: "Toggle 'Developer mode' in the upper-right quadrant." },
              { title: "INJECT_MODULE", desc: "Execute 'Load unpacked' and select the source directory." },
              { title: "AUTH_NEURAL_LINK", desc: "Configure Gemini API key via the extension interface." }
            ].map((step, i) => (
              <div key={i} className="flex gap-8 group">
                <div className="flex-shrink-0 w-12 h-12 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center font-black text-lg text-white/20 group-hover:border-accent/50 group-hover:text-accent group-hover:shadow-[0_0_15px_rgba(0,255,127,0.2)] transition-all duration-300 font-mono">
                  0{i + 1}
                </div>
                <div className="pt-1">
                  <p className="font-black text-white/90 mb-1 group-hover:text-accent transition-colors uppercase tracking-tight font-mono">{step.title}</p>
                  <p className="text-white/40 text-xs leading-relaxed font-mono">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="bg-accent/5 border border-accent/10 backdrop-blur-md rounded-sm p-10 hover:border-accent/30 transition-all duration-500 relative group">
            <div className="corner-bracket corner-tl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="corner-bracket corner-br opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center gap-3 text-accent font-black mb-6 uppercase tracking-tighter font-mono">
              <Shield className="w-6 h-6" />
              Core Modules
            </div>
            <ul className="text-[11px] text-white/50 space-y-4 font-mono uppercase tracking-wider">
              <li className="flex items-center gap-3">
                <div className="w-1 h-1 bg-accent shadow-[0_0_5px_rgba(0,255,127,1)]" />
                Real-time LinkedIn Analysis
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1 h-1 bg-accent shadow-[0_0_5px_rgba(0,255,127,1)]" />
                Glassmorphism Overlay UI
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1 h-1 bg-accent shadow-[0_0_5px_rgba(0,255,127,1)]" />
                Visa & OPT Detection
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1 h-1 bg-accent shadow-[0_0_5px_rgba(0,255,127,1)]" />
                Evidence Highlighting
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1 h-1 bg-accent shadow-[0_0_5px_rgba(0,255,127,1)]" />
                Skill Extraction
              </li>
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-sm p-10 hover:border-white/20 transition-all duration-500 relative group">
            <div className="corner-bracket corner-tl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="corner-bracket corner-br opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-center gap-3 text-white/80 font-black mb-6 uppercase tracking-tighter font-mono">
              <Cpu className="w-6 h-6" />
              System Specs
            </div>
            <ul className="text-[11px] text-white/40 space-y-4 font-mono uppercase tracking-wider">
              <li className="flex items-center gap-3">
                <div className="w-1 h-1 bg-white/20" />
                Manifest V3 Architecture
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1 h-1 bg-white/20" />
                Gemini 3 Flash AI Core
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1 h-1 bg-white/20" />
                Tailwind CSS & Motion
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1 h-1 bg-white/20" />
                Chrome Storage Sync
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1 h-1 bg-white/20" />
                Neural Network Logic
              </li>
            </ul>
          </div>
        </motion.div>

        <footer className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-white/30 text-[10px] font-mono uppercase tracking-[0.2em]">
          <div className="flex items-center gap-4">
            <Activity className="w-4 h-4 text-accent animate-pulse" />
            <p>© 2026 JobFilter AI • SYSTEM_STABLE_V1.0.0</p>
          </div>
          <div className="flex items-center gap-10">
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="hover:text-accent flex items-center gap-2 transition-all">
              GET_API_KEY <ExternalLink className="w-3 h-3" />
            </a>
            <a href="https://www.linkedin.com/jobs/" target="_blank" rel="noreferrer" className="hover:text-accent flex items-center gap-2 transition-all">
              LINKEDIN_PORTAL <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
