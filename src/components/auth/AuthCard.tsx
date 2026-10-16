"use client";

import React from "react";
import { motion } from "framer-motion";

interface AuthCardProps {
  children: React.ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative z-10 max-w-[400px] w-full mx-auto flex flex-col items-center"
    >
      {children}
    </motion.div>
  );
}
