import { motion } from "framer-motion";
import "./VolunteerRes.css";

export const Button = ({ children, onClick }) => {
  return (
    <motion.button
      className="volunteer-button"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};