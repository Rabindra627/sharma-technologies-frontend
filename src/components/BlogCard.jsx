"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function BlogCard({ title, description, image, date, author }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-transform duration-300"
    >
      <div className="relative w-full h-56">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-5">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-3">{description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>{author}</span>
          <span>{date}</span>
        </div>
      </div>      
    </motion.div>
  );
}