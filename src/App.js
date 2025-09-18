import React from "react";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex items-center space-x-3 mb-10"
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
          <span className="text-white text-2xl font-bold">F</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-800">FrancosCorp</h1>
      </motion.div>

      {/* Conteúdo inicial */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-center max-w-lg"
      >
        <p className="text-gray-600 text-lg">
          Bem-vindo à <span className="font-semibold text-indigo-600">FrancosCorp</span>,
          sua parceira em inovação, tecnologia e soluções inteligentes para o futuro.
        </p>
      </motion.div>
    </div>
  );
}
