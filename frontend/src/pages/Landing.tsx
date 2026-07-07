import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  Smartphone,
  Wifi,
  ShieldCheck,
  Cpu,
  Database,
  Coins,
  Code2,
  ExternalLink,
  Layers,
  Radio,
  Lock,
  Zap,
  Server,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Features', href: '#features' },
  { label: 'Stack', href: '#stack' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'How It Works', href: '#how-it-works' },
];

const FEATURES = [
  {
    icon: Wifi,
    title: 'Offline-First Payments',
    description: 'Initiate and route UPI transactions through a Bluetooth mesh network without cellular connectivity. Payments propagate hop-by-hop until they reach a bridge node.',
  },
  {
    icon: Lock,
    title: 'Hybrid Cryptography',
    description: 'Each payment envelope is sealed with AES-256-GCM and the session key is wrapped with RSA-OAEP. Intermediate carrier nodes cannot read or tamper with transaction data.',
  },
  {
    icon: ShieldCheck,
    title: 'Idempotent Settlement',
    description: 'SHA-256 packet hashing combined with atomic compare-and-set guarantees that every transaction is settled exactly once, even when multiple bridge nodes upload duplicates.',
  },
  {
    icon: Radio,
    title: 'Gossip Protocol Simulation',
    description: 'Virtual devices propagate packets using a pull-based rumor-mongering gossip algorithm. Each round randomly exchanges packets between peer nodes in the mesh.',
  },
  {
    icon: Database,
    title: 'Deduplication Cache',
    description: 'An in-memory idempotency store prevents replay attacks and duplicate settlement. Each ciphertext hash is registered before processing, dropping redundant uploads.',
  },
  {
    icon: Zap,
    title: 'Deferred Settlement',
    description: 'Balance validation and UPI PIN verification happen at settlement time when a bridge node uploads the envelope to the central ledger — not at the moment of payment.',
  },
];

const TECH_STACK = [
  { name: 'React 19', role: 'UI Framework', color: 'text-sky-400' },
  { name: 'TypeScript', role: 'Type Safety', color: 'text-blue-400' },
  { name: 'Tailwind CSS v4', role: 'Styling', color: 'text-cyan-400' },
  { name: 'Framer Motion', role: 'Animations', color: 'text-pink-400' },
  { name: 'Spring Boot', role: 'Backend API', color: 'text-emerald-400' },
  { name: 'Java 17', role: 'Runtime', color: 'text-orange-400' },
  { name: 'H2 Database', role: 'In-Memory Ledger', color: 'text-violet-400' },
  { name: 'Axios', role: 'HTTP Client', color: 'text-indigo-400' },
  { name: 'React Router v7', role: 'Navigation', color: 'text-rose-400' },
  { name: 'Vite 8', role: 'Build Tool', color: 'text-yellow-400' },
  { name: 'Lucide Icons', role: 'Iconography', color: 'text-slate-400' },
  { name: 'Bcrypt', role: 'PIN Hashing', color: 'text-teal-400' },
];

const ARCH_STEPS = [
  {
    icon: Smartphone,
    title: 'Client Device',
    description: 'The sender\'s phone encrypts the payment payload and injects it into the mesh network via BLE.',
  },
  {
    icon: Radio,
    title: 'Mesh Gossip',
    description: 'Packets propagate through neighboring devices using a gossip protocol until reaching an internet-connected bridge node.',
  },
  {
    icon: Server,
    title: 'Bridge Ingestion',
    description: 'Bridge nodes upload collected packets to the central settlement API with hop-count metadata.',
  },
  {
    icon: Database,
    title: 'Settlement Engine',
    description: 'The backend verifies the PIN, checks balances, and settles or rejects the transaction in the H2 ledger.',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Compose Payment',
    description: 'Enter the sender VPA, receiver VPA, amount, and UPI PIN on the Send Payment page. The client creates a cryptographically sealed packet.',
  },
  {
    step: '02',
    title: 'Inject & Gossip',
    description: 'The encrypted packet is injected into the mesh at a starting device. Each gossip round randomly exchanges packets between peer devices, decrementing the TTL.',
  },
  {
    step: '03',
    title: 'Bridge Upload',
    description: 'When a packet reaches a device with internet access (a bridge node), it is collected and uploaded to the settlement API along with the hop count.',
  },
  {
    step: '04',
    title: 'Verify & Settle',
    description: 'The backend checks the idempotency cache, decrypts the envelope, validates the PIN, confirms the sender has sufficient balance, and settles the transaction.',
  },
];

function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <div className="text-center mb-16">
      <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-violet-400 font-mono mb-3">
        {label}
      </span>
      <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
        {title}
      </h2>
    </div>
  );
}

function FadeIn({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Navbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-500 text-white shadow-lg shadow-violet-900/30">
              <Radio className="h-4 w-4" />
            </div>
            <span className="text-sm font-black tracking-tight text-white uppercase">UPI Mesh</span>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map(item => (
              <a
                key={item.href}
                href={item.href}
                className="text-xs font-semibold text-slate-400 hover:text-white transition-colors duration-200 tracking-wide"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/overview')}
              className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-violet-900/30 hover:from-violet-500 hover:to-indigo-500 transition-all duration-200 cursor-pointer"
            >
              Launch Dashboard
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              <div className="flex flex-col gap-1">
                <span className={`block h-0.5 w-5 bg-current transition-all duration-200 ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`block h-0.5 w-5 bg-current transition-all duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 w-5 bg-current transition-all duration-200 ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 border-t border-slate-800/50"
          >
            <div className="flex flex-col gap-3">
              {NAV_ITEMS.map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-semibold text-slate-400 hover:text-white transition-colors px-2 py-2"
                >
                  {item.label}
                </a>
              ))}
              <button
                onClick={() => navigate('/overview')}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white mt-2 cursor-pointer"
              >
                Launch Dashboard
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}

function Hero() {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity, scale }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/40 via-slate-950 to-slate-950" />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none" />

      <motion.div style={{ y }} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-900/30 bg-violet-950/30 px-4 py-1.5 text-[11px] font-semibold text-violet-300 font-mono mb-8">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
            </span>
            Offline Payment Protocol Simulation
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6"
        >
          UPI Payments{' '}
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Without Internet
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          A simulated Bluetooth mesh network that routes encrypted UPI transactions 
          hop-by-hop through peer devices until they reach an internet-connected bridge 
          node for settlement.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => navigate('/overview')}
            className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-2xl shadow-violet-900/40 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-900/50 transition-all duration-200 cursor-pointer"
          >
            Launch Interactive Dashboard
            <ArrowRight className="h-4 w-4" />
          </button>

          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 px-8 py-4 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200"
          >
            Explore Features
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {[
            { value: 'End-to-End', label: 'Encryption' },
            { value: 'Gossip', label: 'Protocol' },
            { value: 'Zero', label: 'Infrastructure' },
            { value: 'Once', label: 'Settlement' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-sm"
            >
              <span className="block text-xs font-bold text-violet-400 font-mono">{item.value}</span>
              <span className="block text-[11px] text-slate-500 mt-0.5">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

function Features() {
  return (
    <section id="features" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950 pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeader label="Features" title="Why UPI Offline Mesh?" />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4 }}
                className="group rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-900/40 p-6 lg:p-8 backdrop-blur-md card-hover h-full"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/20 to-indigo-600/10 border border-violet-900/30 mb-5 group-hover:from-violet-600/30 group-hover:to-indigo-600/20 transition-all duration-300">
                  <feature.icon className="h-6 w-6 text-violet-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechStack() {
  return (
    <section id="stack" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950 pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeader label="Technology Stack" title="Built With Modern Tools" />
        </FadeIn>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {TECH_STACK.map((tech, i) => (
            <FadeIn key={tech.name} delay={i * 0.04}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-center backdrop-blur-sm hover:border-violet-900/40 transition-colors duration-200"
              >
                <span className={`block text-sm font-bold ${tech.color}`}>{tech.name}</span>
                <span className="block text-[10px] text-slate-500 font-mono mt-1">{tech.role}</span>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function Architecture() {
  return (
    <section id="architecture" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950 pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeader label="Architecture" title="System Flow Overview" />
        </FadeIn>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-900/40 via-violet-500/40 to-violet-900/40 -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ARCH_STEPS.map((step, i) => (
              <FadeIn key={step.title} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="relative rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-900/40 p-6 backdrop-blur-md"
                >
                  <span className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white shadow-lg shadow-violet-900/40">
                    {i + 1}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/20 to-indigo-600/10 border border-violet-900/30 mb-4">
                    <step.icon className="h-6 w-6 text-violet-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{step.description}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950 pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeader label="How It Works" title="Offline UPI Payment Flow" />
        </FadeIn>

        <div className="space-y-8">
          {HOW_IT_WORKS.map((item, i) => (
            <FadeIn key={item.step} delay={i * 0.1}>
              <motion.div
                whileHover={{ x: 4 }}
                className="group flex items-start gap-6 rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-900/40 p-6 lg:p-8 backdrop-blur-md"
              >
                <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/20 to-indigo-600/10 border border-violet-900/30 group-hover:from-violet-600/30 group-hover:to-indigo-600/20 transition-all duration-300">
                  <span className="text-lg font-black text-violet-400">{item.step}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function Screenshots() {
  return (
    <section id="screenshots" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950 pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn>
          <SectionHeader label="Preview" title="Dashboard Screenshots" />
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-900/40 p-12 lg:p-16 backdrop-blur-md">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/10 border border-violet-900/30 mb-6">
              <Layers className="h-10 w-10 text-violet-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Interactive Dashboard Preview</h3>
            <p className="text-sm text-slate-400 max-w-lg mx-auto mb-8 leading-relaxed">
              Launch the dashboard to explore the mesh network simulator, transaction ledger, account balances, and settlement controls in real time.
            </p>
            <a
              href="#hero"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-violet-900/30 hover:from-violet-500 hover:to-indigo-500 transition-all duration-200"
            >
              <Coins className="h-4 w-4" />
              View Live Demo
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function Cta() {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-violet-950/20 to-slate-950 pointer-events-none" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn>
          <div className="rounded-3xl border border-violet-900/30 bg-gradient-to-b from-violet-950/30 to-slate-900/60 p-10 lg:p-16 backdrop-blur-md">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Ready to Explore the Mesh?
            </h2>
            <p className="text-base text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
              Launch the interactive dashboard to create encrypted payment packets, gossip them through virtual devices, and observe real-time settlement.
            </p>
            <button
              onClick={() => navigate('/overview')}
              className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-2xl shadow-violet-900/40 hover:from-violet-500 hover:to-indigo-500 transition-all duration-200 cursor-pointer"
            >
              <Cpu className="h-4 w-4" />
              Launch Dashboard
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function FooterSection() {
  const navigate = useNavigate();

  return (
    <footer className="relative border-t border-slate-800/60 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 mb-4 cursor-pointer"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-500 text-white shadow-lg">
                <Radio className="h-4 w-4" />
              </div>
              <span className="text-sm font-black tracking-tight text-white uppercase">UPI Mesh</span>
            </button>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              A simulated offline UPI payment system that routes encrypted transactions through a Bluetooth mesh gossip protocol to a central settlement engine.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {NAV_ITEMS.map(item => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-xs text-slate-500 hover:text-violet-400 transition-colors duration-200"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  onClick={() => navigate('/overview')}
                  className="text-xs text-slate-500 hover:text-violet-400 transition-colors duration-200 cursor-pointer"
                >
                  Dashboard
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-5">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-violet-400 transition-colors duration-200"
                >
                  <Code2 className="h-3.5 w-3.5" />
                  Source Code
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="http://localhost:8080/h2-console"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-violet-400 transition-colors duration-200"
                >
                  <Database className="h-3.5 w-3.5" />
                  H2 Database Console
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="http://localhost:8080/swagger-ui.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-violet-400 transition-colors duration-200"
                >
                  <Server className="h-3.5 w-3.5" />
                  API Documentation
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-600 font-mono">
            &copy; {new Date().getFullYear()} UPI Offline Mesh Network Simulator v1.0.0
          </p>
          <p className="text-[11px] text-slate-600 font-mono flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3" />
            Deferred Settlement Simulation Mode
          </p>
        </div>
      </div>
    </footer>
  );
}

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <Hero />
      <Features />
      <TechStack />
      <Architecture />
      <HowItWorks />
      <Screenshots />
      <Cta />
      <FooterSection />
    </div>
  );
};
export default Landing;
