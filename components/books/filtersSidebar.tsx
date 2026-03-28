"use client"
import { FilterIcon } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import CloseIcon from "@/public/icons/CloseIcon";
import CoursesFilter from "./filter";
import { GetClass } from "@/services/public/classes";
import { GetSubject } from "@/services/subjects";
import { GetTeacher } from "@/services/teacher";
type Props = {
    classes: GetClass[];
    subjects: GetSubject[];
    teachers: GetTeacher[];
  };
  
const BookFiltersSidebar = ({ classes, subjects, teachers }: Props) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
  
    const sidebarVariants = {
      open: { x: 0 },
      closed: { x: "-100%" },
    };
  
  return (
    <div className="lg:hidden block">
              <button onClick={toggleSidebar} className="flex items-center gap-2">
          <FilterIcon className="text-primary" size={20} />
          <span className="text-secondary text-lg">تصفية النتائج</span>
      </button>
      {isSidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={toggleSidebar}
          />
        )}
        <motion.div
          className="flex flex-col bg-white fixed top-0 left-0 h-full shadow-lg z-50 p-4 max-h-screen overflow-y-scroll lg:hidden md:w-[50%] w-[70%]"
          variants={sidebarVariants}
          initial="closed"
          animate={isSidebarOpen ? "open" : "closed"}
          transition={{
            ease: "linear",
            duration: 2,
            x: { duration: 0.3 },
          }}
        >
          <button onClick={toggleSidebar} className="self-end">
            <CloseIcon />
          </button>
          <div className="space-y-5 mt-4">
          <CoursesFilter/>
          </div>
        </motion.div>


    </div>
  )
}

export default BookFiltersSidebar
