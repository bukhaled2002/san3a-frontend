import Books from "@/components/home/books";
import Contact from "@/components/home/contact";
import Courses from "@/components/home/courses";
import Hero from "@/components/home/hero";
import Menu from "@/components/home/menu";
import Subjects from "@/components/home/subjects";
import TeachersSlider from "@/components/home/teachersSlider";
import { getTeachers } from "@/services/teacher";

export default async function Home() {
  const teachers = await getTeachers();

  return (
    <>
      <Hero />
      <div className="laser-separator" />
      <Menu />
      <div className="laser-separator opacity-20" />
      <Subjects />
      <div className="laser-separator opacity-20" />
      <Courses />
      <div className="laser-separator opacity-20" />
      <TeachersSlider teachers={teachers} />
      <div className="laser-separator opacity-20" />
      <Books />
      <div className="laser-separator opacity-20" />
      <Contact />
    </>

  );
}
