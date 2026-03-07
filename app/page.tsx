'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import EulerMascot from '@/components/mascot/EulerMascot';
import Button from '@/components/ui/Button';

const features = [
  { icon: '🎮', title: 'Gamified Learning', description: 'Earn XP, maintain streaks, unlock achievements, and compete on leaderboards.' },
  { icon: '📚', title: '20 Learning Paths', description: 'From counting to topology — a complete mathematics curriculum.' },
  { icon: '🤖', title: 'AI Math Agent', description: "Complete all paths to unlock Euler's Mind — your personal AI math companion." },
  { icon: '👥', title: 'Learn Together', description: 'Add friends, join leagues, and challenge each other to math duels.' },
  { icon: '📱', title: 'Learn Anywhere', description: 'Works on phone, tablet, or desktop. Install as an app for offline learning.' },
  { icon: '❤️', title: 'Encouraging & Fun', description: 'Euler the robot mascot guides and celebrates your journey every step.' },
];

const paths = [
  'Foundations', 'Pre-Algebra', 'Algebra I', 'Geometry', 'Algebra II',
  'Trigonometry', 'Pre-Calculus', 'Calculus I', 'Calculus II', 'Multivariable Calculus',
  'Linear Algebra', 'Differential Equations', 'Discrete Math', 'Number Theory',
  'Set Theory', 'Abstract Algebra', 'Real Analysis', 'Complex Analysis',
  'Topology', 'Unsolved Problems',
];

const floatingSymbols = ['∑', '∫', 'π', '∞', '√', 'Δ', 'θ', '∂', 'λ', '∇', 'ℝ', '∈'];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark overflow-hidden">
      {/* Floating math symbols */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {floatingSymbols.map((symbol, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.05, 0.12, 0.05],
              y: [0, -30, 0],
              x: [0, Math.sin(i) * 20, 0],
            }}
            transition={{ duration: 5 + i * 0.5, repeat: Infinity, delay: i * 0.8 }}
            className="absolute text-4xl md:text-6xl text-primary/10 select-none"
            style={{ left: `${(i * 8.3) % 100}%`, top: `${(i * 15 + 10) % 90}%` }}
          >
            {symbol}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-4xl font-bold text-gradient">∞</span>
          <span className="text-2xl font-bold text-gradient">Mathly</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-gray-600 dark:text-gray-300 font-bold hover:text-primary transition-colors">
            Log in
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center md:text-left"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              <span className="text-gradient">From zero</span>
              <br />
              <span className="text-gray-900 dark:text-white">to infinity.</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
              Master mathematics at your own pace. From basic counting to unsolved problems —
              Mathly makes every step fun, rewarding, and unforgettable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/signup">
                <Button variant="primary" size="lg">Start Learning Free</Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg">See How It Works</Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500">Free forever. No credit card required.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 flex justify-center"
          >
            <EulerMascot state="excited" size="xl" message="Let's learn math together!" />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 bg-white dark:bg-gray-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-extrabold mb-4">
              Why <span className="text-gradient">Mathly</span>?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We took the best parts of language-learning apps and built them for mathematics.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-hover text-center"
              >
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Preview */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-extrabold mb-4">
              20 Paths to <span className="text-gradient">Mastery</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A complete mathematics curriculum from counting to the frontiers of human knowledge.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {paths.map((path, i) => (
              <motion.div
                key={path}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-gray-800 shadow-md rounded-full px-4 py-2 text-sm font-bold
                          hover:shadow-lg hover:scale-105 transition-all cursor-default"
                style={{ borderLeft: `3px solid hsl(${(i / paths.length) * 360}, 70%, 50%)` }}
              >
                {path}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Agent Teaser */}
      <section className="relative z-10 bg-gradient-to-br from-gray-900 to-gray-800 py-24 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-6xl mb-6 block">🧠</span>
            <h2 className="text-4xl font-extrabold mb-4">Euler&apos;s Mind</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-6">
              Complete all 20 paths and unlock your personal AI mathematician.
              Explore unsolved problems, work through proofs, and push the boundaries of mathematics.
            </p>
            <p className="text-sm text-gray-500 italic">Powered by advanced AI. The ultimate reward.</p>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section className="relative z-10 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4">Start Free, <span className="text-gradient">Upgrade Anytime</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card text-center">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <p className="text-4xl font-extrabold mb-4">$0</p>
              <ul className="text-left text-gray-600 dark:text-gray-400 space-y-2 mb-6">
                <li>&#10003; First 5 paths</li><li>&#10003; 5 hearts</li><li>&#10003; Basic leaderboard</li><li>&#10003; Up to 10 friends</li>
              </ul>
              <Link href="/signup"><Button variant="outline" className="w-full">Get Started</Button></Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="card text-center border-2 border-primary relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>
              <h3 className="text-xl font-bold mb-2">Mathly Plus</h3>
              <p className="text-4xl font-extrabold mb-1">$9.99</p>
              <p className="text-sm text-gray-500 mb-4">/month</p>
              <ul className="text-left text-gray-600 dark:text-gray-400 space-y-2 mb-6">
                <li>&#10003; All 20 paths</li><li>&#10003; Unlimited hearts</li><li>&#10003; No ads</li><li>&#10003; Offline mode</li><li>&#10003; 2x XP weekends</li><li>&#10003; Streak repair</li>
              </ul>
              <Link href="/signup"><Button variant="primary" className="w-full">Start Free Trial</Button></Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="card text-center">
              <h3 className="text-xl font-bold mb-2">Family</h3>
              <p className="text-4xl font-extrabold mb-1">$14.99</p>
              <p className="text-sm text-gray-500 mb-4">/month</p>
              <ul className="text-left text-gray-600 dark:text-gray-400 space-y-2 mb-6">
                <li>&#10003; Up to 6 members</li><li>&#10003; All Plus features</li><li>&#10003; Family leaderboard</li><li>&#10003; Parental controls</li>
              </ul>
              <Link href="/signup"><Button variant="secondary" className="w-full">Start Family Plan</Button></Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <EulerMascot state="celebrating" size="lg" />
          <h2 className="text-4xl font-extrabold mt-6 mb-4">Ready to start your math journey?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">Join thousands of learners already on their path from zero to infinity.</p>
          <Link href="/signup"><Button variant="primary" size="lg">Start Learning Free</Button></Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gradient">∞</span>
              <span className="text-lg font-bold text-white">Mathly</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
              <a href="#features" className="hover:text-white transition-colors">Features</a>
            </div>
            <p className="text-sm">&copy; 2024 Mathly. From zero to infinity.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
