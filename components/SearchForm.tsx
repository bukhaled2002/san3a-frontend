"use client";

import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useDebounce } from "use-debounce";

interface Props {}

const SearchForm = ({}: Props) => {
  const [searchedWord, setSearchedWord] = useState<string>("");
  const [query] = useDebounce(searchedWord, 400);

  //   const { data: searchData, isLoading } = useQuery({
  //     queryKey: ["search", locale, query],
  //     queryFn: () => (query ? searchApi(locale, query) : null),
  //   });

  return (
    <div>
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className={"relative w-1/2 mx-auto"}>
        <Input
          className="border-primary/10 bg-card/50 h-12 pe-10 ps-4 rounded-xl font-medium text-sm focus:border-primary transition-all w-full text-white placeholder:text-tech-grey/50"
          type="search"
          id="formSearch"
          name="search"
          placeholder="بحث..."
          value={searchedWord}
          onChange={(e) => setSearchedWord(e.target.value)}
          autoComplete="off"
        />
        <button className="absolute end-5 top-1/2 -translate-y-1/2">
          <Image
            src="/icons/magnifier.svg"
            alt="search"
            width={22}
            height={22}
          />
        </button>
        {searchedWord && (
          <div className="absolute z-40 w-full top-16 bg-white rounded-lg px-5 py-2 max-h-72 overflow-auto">
            {false ? (
              <Loader2 className="w-10 h-10 p-2 rounded-full animate-spin mx-auto text-primary" />
            ) : false ? (
              [
                {
                  id: 1,
                  name: "event1",
                  image: "/images/event1.jpg",
                  location_name: "location1",
                  start_at: "2022-10-10T10:00:00",
                },
                {
                  id: 2,
                  name: "event2",
                  image: "/images/event2.jpg",
                  location_name: "location2",
                  start_at: "2022-10-10T10:00:00",
                },
                {
                  id: 3,
                  name: "event3",
                  image: "/images/event3.jpg",
                  location_name: "location3",
                  start_at: "2022-10-10T10:00:00",
                },
                {
                  id: 4,
                  name: "event4",
                  image: "/images/event4.jpg",
                  location_name: "location4",
                  start_at: "2022-10-10T10:00:00",
                },
                {
                  id: 5,
                  name: "event5",
                  image: "/images/event5.jpg",
                  location_name: "location5",
                  start_at: "2022-10-10T10:00:00",
                },
              ].map((item, index) => {
                return (
                  <Link
                    href="#"
                    key={item.id}
                    className={`flex items-start gap-2 md:gap-4 py-3 `}
                  >
                    <Image
                      src={item.image}
                      width={150}
                      height={150}
                      className="h-16 sm:w-28 w-16 sm:h-28 rounded-[5px] object-center object-cover"
                      loading="eager"
                      alt="eventImage"
                    />
                    <div className="flex flex-col justify-between flex-1">
                      <div className="title textbase md:text-lg line-clamp-1 md:line-clamp-0 -text--clr-Blue font-semibold">
                        {item.name}
                      </div>
                      <div className="location flex items-center gap-x-1 my-1 md:my-3">
                        <Image
                          src="/icons/pinGray.svg"
                          width={25}
                          height={25}
                          className="w-5 md:w-6 h-5 md:h-6"
                          alt="pinIcon"
                        />
                        <div className="text-xs -text--clr-Gray">
                          {item.location_name}
                        </div>
                      </div>
                      <div className="date flex items-center gap-x-1">
                        <Image
                          src="/icons/calendarGray.svg"
                          width={18}
                          height={17}
                          className="ms-1 w-3.5 md:w-5 h-3.5 md:h-5 "
                          alt="calendarIcon"
                        />
                        <div className="text-xs -text--clr-Gray ms-1">
                          {new Date(item.start_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="text-center py-10">
                 <p className="text-tech-grey font-bold">لا توجد نتائج بحث حالياً</p>
              </div>
            )}
          </div>
        )}
      </div>
      {searchedWord && (
        <div
          className="fixed inset-0 bg-transparent opacity-5 z-40"
          onClick={() => {
            setSearchedWord("");
          }}
        />
      )}
    </div>
  );
};

export default SearchForm;
