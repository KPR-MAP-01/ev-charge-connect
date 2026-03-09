import { motion } from "framer-motion";

export function Loader({ text = "Charging up..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Battery body */}
      <div className="relative w-12 h-20 rounded-lg border-2 border-primary overflow-hidden">
        {/* Battery tip */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-2 rounded-t-sm bg-primary" />
        {/* Charging fill */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-primary/80"
          animate={{ height: ["10%", "85%", "10%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Lightning bolt */}
        <svg
          className="absolute inset-0 m-auto w-5 h-5 text-primary-foreground z-10"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M13 2L3 14h9l-1 10 10-12h-9l1-10z" />
        </svg>
      </div>
      <motion.p
        className="text-sm font-medium text-muted-foreground"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {text}
      </motion.p>
    </div>
  );
}
