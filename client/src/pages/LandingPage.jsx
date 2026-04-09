import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <section className="grid min-h-[80vh] items-center gap-8 md:grid-cols-2">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <p className="mb-3 inline-block rounded-full bg-coral/15 px-3 py-1 text-sm font-semibold text-coral">
          Capstone-Ready AI Fitness Platform
        </p>
        <h1 className="text-4xl font-bold leading-tight text-ink md:text-5xl">
          Train smarter with your <span className="text-coral">AI-Powered Virtual Gym Trainer</span>
        </h1>
        <p className="mt-4 text-slate">
          Personalized workouts, nutrition plans, hydration tracking, posture feedback, and an AI coach in one web app.
        </p>
        <Link
          to="/get-started"
          className="mt-8 inline-flex rounded-xl bg-coral px-6 py-3 font-semibold text-white shadow-glow transition hover:scale-[1.02]"
        >
          Get Started
        </Link>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="glass overflow-hidden p-2"
      >
        <img
          className="h-full w-full rounded-xl object-cover"
          src="https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg"
          alt="Fitness training"
        />
      </motion.div>
    </section>
  );
}
