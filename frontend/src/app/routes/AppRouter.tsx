import { Suspense } from "react";
import { useRoutes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Routes from "./routes";
import Loader from "../../components/Loader/Loader";

export default function AppRouter() {
  const location = useLocation();

  return (
    <Suspense fallback={<Loader />}>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {useRoutes(Routes)}
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );
}
