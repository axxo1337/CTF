import React from "react";

import { motion } from "framer-motion";

export default function Overlay({ children, onClose }: any) {
  return (
    <motion.div
      className="fixed top-0 left-0 bg-black bg-opacity-25 backdrop-blur-md w-[100vw] h-[100vh] border-2 border-black"
      transition={{ duration: 0.4 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 100 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute h-full w-full" onClick={onClose}>
        <p className="left-1/2 -translate-x-1/2 bottom-10 absolute text-[var(--third-color)]">
          CLICK IN VOID TO CLOSE
        </p>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex p-5 rounded-xl bg-[var(--third-color)]">
        {children}
      </div>
    </motion.div>
  );
}
