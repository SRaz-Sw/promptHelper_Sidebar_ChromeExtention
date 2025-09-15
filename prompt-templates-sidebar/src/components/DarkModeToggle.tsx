import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '@/hooks/useDarkMode';
import { Button } from '@/components/ui/button';

export function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="mt-auto p-4 border-t bg-card"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleDarkMode}
        className="w-full flex items-center justify-center gap-2 h-10 hover:bg-primary/10 transition-all duration-200"
        aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      >
        <motion.div
          key={isDarkMode ? 'dark' : 'light'}
          initial={{ scale: 0.8, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0.8, rotate: 180 }}
          transition={{ 
            duration: 0.3,
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          className="flex items-center"
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4 text-yellow-500" />
          ) : (
            <Moon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          )}
        </motion.div>
        
        <motion.span
          key={`text-${isDarkMode ? 'dark' : 'light'}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="text-sm font-medium"
        >
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </motion.span>
        
        {/* Animated toggle background */}
        <motion.div
          className="ml-auto relative w-11 h-6 rounded-full border-2 border-primary/20 cursor-pointer"
          animate={{
            backgroundColor: isDarkMode ? '#1f2937' : '#f3f4f6'
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-primary shadow-sm"
            animate={{
              x: isDarkMode ? 18 : 0
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
          />
        </motion.div>
      </Button>
    </motion.div>
  );
}