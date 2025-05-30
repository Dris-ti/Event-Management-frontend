'use client'

import React, { useEffect } from 'react'
import Navbar from '../Components/Navbar/page'
import Footer from '../Components/Footer/page'
import Pagination from '../Components/Pagination/page'
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { RiSearch2Line } from "react-icons/ri";
import { BiChair } from "react-icons/bi";
import { VscCircleSmallFilled } from "react-icons/vsc";
import { CalendarDays, MapPin, Clock } from 'lucide-react';
import { EVENT } from '../Types/AllTypes'



export default function Home() {
  const [search, setsearch] = React.useState<EVENT[]>([]);
  const [futureEvents, setFutureEvents] = React.useState<EVENT[]>([]);
  const [pastEvents, setPastEvents] = React.useState<EVENT[]>([]);


  const eventsPerPage = 6;
  const router = useRouter();


  // Pagination for Future Events
  const [futurePage, setFuturePage] = React.useState(1);
  const futureTotalPages = Math.ceil(futureEvents.length / eventsPerPage);
  const futureEventsPage = futureEvents.slice(
    (futurePage - 1) * eventsPerPage,
    futurePage * eventsPerPage
  );

  // Pagination for Search Results
  const [pastPage, setPastPage] = React.useState(1);
  const pastTotalPages = Math.ceil(pastEvents.length / eventsPerPage);
  const pastEventsPage = pastEvents.slice(
    (pastPage - 1) * eventsPerPage,
    pastPage * eventsPerPage
  );


  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}user/futureEvents`, {
          withCredentials: true,
        });

        console.log("RES F: " + response.data.data);

        if (response.status === 200) {
          setFutureEvents(response.data.data);
        } else {
          setFutureEvents([]);
        }
      }

      catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          // Handle server response errors
          const { status, data } = error.response;
          if (status === 401) {
            alert(data?.error?.message || "Invalid email or password");
          } else {
            alert("An unexpected error occurred. Please try again.");
          }
        } else {
          // Handle unexpected errors
          console.error("Error:", error);
          alert("Network or server error. Please try again. " + error);
        }
      }
    };
    fetchUpcomingEvents();
  }, [router]);


  useEffect(() => {
    const fetchPastEvents = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}user/pastEvents`, {
          withCredentials: true,
        });


        if (response.status === 200) {
          setPastEvents(response.data.data);
        } else {
          setPastEvents([]);
        }
      }

      catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          // Handle server response errors
          const { status, data } = error.response;
          if (status === 401) {
            alert(data?.error?.message || "Invalid email or password");
          } else {
            alert("An unexpected error occurred. Please try again.");
          }
        } else {
          // Handle unexpected errors
          console.error("Error:", error);
          alert("Network or server error. Please try again. " + error);
        }
      }
    };
    fetchPastEvents();
  }, []);

  const handleRowClick = (id: string) => {
    router.push(`/Homepage/${id}`);
  }


  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}user/eventSearch?query=`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setsearch(response.data);
        console.log(response.data);
      }
      else {
        setsearch([]);
      }
    }
    catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Handle server response errors
        const { status, data } = error.response;
        if (status === 401) {
          alert(data?.error?.message || "Invalid email or password");
        } else {
          alert("An unexpected error occurred. Please try again.");
        }
      } else {
        // Handle unexpected errors
        console.error("Error:", error);
        alert("Network or server error. Please try again. " + error);
      }
    }



  };



  return (
    <div>
      <Navbar />
      {/* --------------------------------------- Hero Section ------------------------------------------------*/}
      <div className='w-screen h-screen flex justify-center items-center absolute'>
        <img
          src="/Hero.svg"
          alt="Hero Image"
          className='w-full h-full object-cover'
        />
      </div>

      <div className='w-screen h-screen flex flex-col justify-center items-center text-center relative px-4'>
        <div className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#250A63] leading-tight'>
          Discover
          <div className='text-[#4157FE]'>
            Amazing
            <span className=' text-[#250A63]'> Events</span>
          </div>
        </div>

        <div className='text-base sm:text-lg md:text-xl font-medium text-[#250A63] mt-6 sm:mt-10 w-full sm:w-[80%] md:w-[65%] lg:w-[55%]'>
          Find and book events that match your interests. From tech conferences to music festivals, we've got you covered.
        </div>

        <div className='text-lg sm:text-xl text-[#250A63] font-bold mt-6 sm:mt-10'>
          Find Your Next Event
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className='w-full sm:w-[90%] md:w-[70%] lg:w-[40%] mt-4 sm:mt-5 flex flex-col sm:flex-row justify-center items-center gap-4'>

          <span className='flex flex-row justify-center items-center w-full sm:w-[100%] h-12 sm:h-[100%] bg-[#FFFFFF70] backdrop-blur-sm border border-[#BDBBFB] text-[#391E7999] text-base sm:text-lg font-light rounded-md px-3'>
            <RiSearch2Line size={24} className="mr-2" />
            <input
              className='bg-transparent border-none w-full h-full text-[#391E7999] text-base sm:text-lg font-light outline-none placeholder:text-[#391E7999]'
              type='text'
              placeholder='Search events'
            />
          </span>

          <input
            type='submit'
            value='Search Events'
            style={{ background: 'linear-gradient(to bottom, #7B8BFF, #4157FE)' }}
            className='w-full sm:w-auto h-12 rounded-md backdrop-blur-lg text-white text-base sm:text-lg font-medium px-6'
          />
        </form>
        {/* End of search */}
      </div>


      {/* ---------------------------------- End of Hero section ----------------------------------------------------*/}

      {/* ------------------------------------------------ Upcoming events ------------------------------------------------*/}
      <div>
        <div className="bg-[#f9f9ff] py-12 px-6 cursor-pointer">
          <h2 className="text-3xl font-bold text-[#242565] mb-8">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {futureEventsPage.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl shadow p-4 hover:shadow-md transition-all"
                onClick={() => handleRowClick(event.id)}
              >
                <div className="rounded overflow-hidden mb-4">
                  <img
                    src={event.image_url}
                    alt='Event Image'
                    width={500}
                    height={500}
                    className='w-full h-48 object-cover rounded-xl' />

                </div>
                <div className="flex items-start gap-4">
                  <div className="text-center">
                    <div className="text-xs font-bold text-[#3D37F1]">
                      {new Date(event.date).toLocaleString('en-US', { month: 'short' }).toUpperCase()}
                    </div>
                    <div className="text-2xl font-bold text-[#000000]">
                      {new Date(event.date).toLocaleString('en-US', { day: '2-digit' })}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#242565]">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      We’ll get you directly seated and inside for you to enjoy the
                      conference.
                    </p>
                    <div className="flex items-center text-sm text-[#6A6A6A] gap-4 mb-2">
                      <div className="flex items-center gap-1">
                        <CalendarDays size={16} color='#8570AD' />
                        {new Date(event.date).toLocaleString('en-US', { weekday: 'long' })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} color='#8570AD' /> {new Date(`1970-01-01T${event.time}Z`).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          hour12: true,
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={16} color='#8570AD' /> {event.location}
                      </div>
                    </div>
                    <div className="flex gap-2 mb-2 ml-2">
                      {event.tag?.map((tag) => (

                        <span
                          key={tag}
                          className="bg-[#DADEFF] text-[#1D4ED8] text-sm font-medium px-3 py-1 pl-1 rounded flex flex-row items-start"
                        >
                          <VscCircleSmallFilled />{tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm flex justify-between items-center border-t pt-2">
                      <span className="flex items-center gap-1 text-[#8570AD]">
                        <BiChair size={18} color='#8570AD' />
                        {event.available_seats} Spots Left
                      </span>
                      <span className="text-right text-[#8570AD]">Total {event.max_seats} Seats</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>


      <Pagination
        currentPage={futurePage}
        totalPages={futureTotalPages}
        onPageChange={setFuturePage}
      />
      {/* ------------------------------------------------ End of upcoming event  ----------------------------------------*/}


      {/* ------------------------------------------------ Past events ------------------------------------------------*/}
      <div>
        <div className="bg-[#f9f9ff] py-12 px-6 cursor-pointer">
          <h2 className="text-3xl font-bold text-[#242565] mb-8">Previous Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEventsPage.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl shadow p-4 hover:shadow-md transition-all"
                onClick={() => handleRowClick(event.id)}
              >
                <div className="rounded overflow-hidden mb-4">
                  <img
                    src={event.image_url}
                    alt='Event Image'
                    width={500}
                    height={500}
                    className='w-full h-48 object-cover rounded-xl' />

                </div>
                <div className="flex items-start gap-4">
                  <div className="text-center">
                    <div className="text-xs font-bold text-[#3D37F1]">
                      {new Date(event.date).toLocaleString('en-US', { month: 'short' }).toUpperCase()}
                    </div>
                    <div className="text-2xl font-bold text-[#000000]">
                      {new Date(event.date).toLocaleString('en-US', { day: '2-digit' })}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#242565]">
                      {event.title}
                    </h3>
                    <p className="text-sm text-[#6A6A6A] mb-2">
                      We’ll get you directly seated and inside for you to enjoy the
                      conference.
                    </p>
                    <div className="flex items-center text-sm text-gray-500 gap-4 mb-2">
                      <div className="flex items-center gap-1">
                        <CalendarDays size={16} color='#8570AD' />
                        {new Date(event.date).toLocaleString('en-US', { weekday: 'long' })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} color='#8570AD' /> {new Date(`1970-01-01T${event.time}Z`).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          hour12: true,
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={16} color='#8570AD' /> {event.location}
                      </div>
                    </div>
                    <div className="flex gap-2 mb-2">
                      {event.tag?.map((tag) => (

                        <span
                          key={tag}
                          className="bg-[#DADEFF] text-[#1D4ED8] text-sm font-medium px-3 py-1 pl-1 rounded flex flex-row items-start"
                        >
                          <VscCircleSmallFilled />{tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm flex justify-between items-center border-t pt-2">
                      <span className="flex items-center gap-1 text-[#8570AD]">
                        <BiChair size={18} color='#8570AD' />
                        {event.available_seats} Spots Left
                      </span>
                      <span className="text-right text-[#8570AD]">Total {event.max_seats} Seats</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>


      <Pagination
        currentPage={pastPage}
        totalPages={pastTotalPages}
        onPageChange={setPastPage}
      />
      {/* ------------------------------------------------ End of past event  ----------------------------------------*/}








      <Footer />
    </div>
  )
}

