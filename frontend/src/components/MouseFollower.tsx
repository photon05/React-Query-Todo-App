import { useState, useEffect } from 'react';
import { motion } from "framer-motion";

export const MouseFollower = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      className='fixed top-0 left-0 w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full -z-10 pointer-events-none'
      animate={{ x: mouse.x - 40, y: mouse.y - 40 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    />
  );
};