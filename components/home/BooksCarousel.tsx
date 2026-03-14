"use client"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/scrollbar";
import { GetBook } from "@/services/admin/books";
import BookCard from "../cards/BookCard";
const BooksCarousel = ({ books }: { books: any }) => {
  return (
    <Swiper
      spaceBetween={24}
      slidesPerView={1.2}
      breakpoints={{
        500: { slidesPerView: 1.5 },
        768: { slidesPerView: 2.2 },
        1024: { slidesPerView: 3.2 },
        1280: { slidesPerView: 4 },
      }}
      className="pb-10"
    >
      {books.data.map((book: GetBook) => {
        return (
          <SwiperSlide className="!h-auto" key={book.id}>
            <BookCard book={book} />
          </SwiperSlide>
        );
      })}
    </Swiper>

)
}

export default BooksCarousel