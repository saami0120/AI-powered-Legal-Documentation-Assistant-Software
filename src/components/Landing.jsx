// src/components/Landing.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col bg-gradient-to-br from-dark-400 to-dark-100 text-white">
      {/* Header */}
      <header className="py-6 px-8">
        <motion.span
          className="text-3xl md:text-4xl font-bold text-primary-400"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          LegalDoc
        </motion.span>
      </header>

      {/* Hero */}
      <motion.main
        className="flex flex-col items-center justify-center text-center px-8 py-24 space-y-8 min-h-[60vh]"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-7xl md:text-8xl font-extrabold gradient-text leading-tight"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        >
        AI Leveraged Legal Assitance 
        </motion.h1>

        <motion.p
          className="max-w-2xl text-xl md:text-2xl text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Create perfect, court‑ready legal documents in seconds—no legal jargon required.<br /><br />
          Validate your documents with AI or chat with your personal AI assistant.
        </motion.p>

        <div className="flex gap-4 justify-center">
          <motion.button
            onClick={() => navigate('/login')}
            className="mt-4 py-4 px-10 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full text-lg md:text-xl font-medium hover:opacity-90 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
          
          <motion.button
            onClick={() => navigate('/signup')}
            className="mt-4 py-4 px-10 bg-white/10 rounded-full text-lg md:text-xl font-medium hover:bg-white/20 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </motion.button>
        </div>

        <motion.a
          href="#about"
          className="mt-10 text-gray-400 hover:text-gray-200"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          ↓ Learn More
        </motion.a>
      </motion.main>

      {/* About / Details Section */}
      <section id="about" className="bg-dark-300 py-16 px-8">
        <div className="max-w-3xl mx-auto space-y-8 text-gray-200">
          <motion.h2
            className="text-4xl md:text-5xl font-semibold text-white"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            What are Legal Services?
          </motion.h2>
          <p>
            Legal Services includes providing Free Legal Aid to those weaker sections of the society who fall within the purview of Section 12 of the Legal Services Authority Act, 1987. It also entails creating legal awareness by spreading legal literacy through legal awareness camps, print media, digital media and organizing Lok Adalats for the amicable settlement of disputes which are either pending or which are yet to be filed, by way of compromise. NALSA also undertakes necessary steps by way of social action litigation with regards to any matter of special concern to the weaker sections of the society. Legal services also encompasses facilitating the beneficiaries to get their entitlements under various government schemes, policies and legislations.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h3 className="text-3xl md:text-4xl font-semibold text-white">
              What is included in free legal services/aid?
            </h3>
            <p>
              Free legal aid is the provision of free legal services in civil and criminal matters for those poor and marginalized people who cannot afford the services of a lawyer for the conduct of a case or a legal proceeding in any Court, Tribunal or Authority. These services are governed by the Legal Services Authorities Act, 1987 and headed by the National Legal Services Authority (NALSA).
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
              <li>Representation by an Advocate in legal proceedings.</li>
              <li>Payment of process fees, expenses of witnesses and all other charges payable or incurred in connection with any legal proceedings.</li>
              <li>Preparation of pleadings, memo of appeal, paper book including printing and translation of documents.</li>
              <li>Drafting of legal documents, special leave petitions, etc.</li>
              <li>Supply of certified copies of judgments, orders, notes of evidence and other documents.</li>
              <li>Provision of aid and advice to access benefits under government welfare schemes.</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h3 className="text-3xl md:text-4xl font-semibold text-white">Scope & Eligibility</h3>
            <p>
              Free legal aid is available from the lowest Court up to the Supreme Court of India for any individual who satisfies the criteria under Section 12 of the Act and has a genuine case to prosecute or defend. Eligible persons may even choose their own panel lawyer under Regulation 7(6) of the NALSA Regulations 2010. Legal aid can be sought at any stage of proceedings, including appeals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-8 text-center text-gray-500 text-sm">
        © 2025 LegalDoc. Empowering everyone with legal clarity.
      </footer>
    </div>
  );
}
