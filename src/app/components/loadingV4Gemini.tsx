import GeminiSvg from "@/app/components/icons/gemini";
import { motion } from "framer-motion";

export default function LoadingV4Gemini({ className }: { className?: string }) {
  return (
    <div
      className={`flex h-32 gap-4 fade-in-25 md:gap-6 justify-center ${className || ""}`}
    >
      <motion.div
        className="w-6 h-6"
        initial={{ scale: 1, rotate: 0 }}
        animate={{ scale: 1.4, rotate: 360 }}
        transition={{
          type: "spring",
          stiffness: 15,
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <GeminiSvg className="w-6 h-6" />
      </motion.div>
      <div className="flex w-full max-w-3xl flex-col gap-4 rounded-lg pt-2">
        <div className="h-5 w-10/12 origin-left animate-loading bg-[length:200%] rounded-sm bg-gradient-to-r from-purple-50 from-30% via-blue-600/60 to-purple-50 bg-2x opacity-0"></div>
        <div className="h-5 w-full origin-left animate-loading bg-[length:200%] rounded-sm bg-gradient-to-r from-blue-500/60 via-purple-100 via-30% to-blue-500/60 to-60% bg-2x opacity-0 "></div>
        <div className="duration-600 h-5 w-3/5 origin-left animate-loading bg-[length:200%] rounded-sm bg-gradient-to-r from-purple-50 from-40% via-blue-500/60 to-purple-50 to-70% bg-2x opacity-0 "></div>
      </div>
    </div>
  );
}
