'use client';
import React, { useEffect, useState } from 'react';
import { FiArrowLeftCircle } from "react-icons/fi";
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { VscCircleSmallFilled } from 'react-icons/vsc';
import Navbar from '../../Components/Navbar/page'
import Footer from '../../Components/Footer/page'
import type { EVENT } from '../../Types/AllTypes'
import { getUserFromCookie } from '@/app/lib/auth';
import { NextApiRequest } from 'next';



export default function EventDetails({user} : any) {
  const [event, setEvent] = React.useState<EVENT>();
  const [selectedSeats, setSelectedSeats] = useState(1);

  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    async function fetchEventData(id: string) {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}user/showEvent/${id}`, { withCredentials: true });

        if (response.status === 200) {
          console.log("response: ", response.data.data);
          setEvent(response.data.data);
        }
        else {
          if (response.status === 401) {
            alert(response.statusText);
            router.replace('/SignIn');
          }
          alert('Failed to fetch event information');
        }


      } catch (error) {
        console.error('Error fetching agency information:', error);
      }

    }
    if (id && typeof id === 'string')
      fetchEventData(id);
  }, [id]);

  

  const handleSelect = (seats: number) => {
    setSelectedSeats(seats);
  };


  const isUserLoggedIn = async () =>
  {
   try {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include'
      });

      if (res.status === 401) {
        return false;
      }
      else{
        return true;
      }
  }
  catch(err)
  {
    return false;
  }
};

  const bookEvents = async (seats: number) =>{
    if (!(await isUserLoggedIn()))
    {
      alert("Login to Book events")
      router.push('/SignIn');
      return;
    }

    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}user/eventBooking/${id}`, 
          { seat : seats },
          { withCredentials: true });

        console.log("RESPONSE: ", response.data, response.status)
      
        if (response.status === 200) {
          alert("Booking Successful")
        }
        else{
          alert("Booking failed")
        }
      }
      catch(error)
      {
        if (axios.isAxiosError(error) && error.response) {
          // Handle server response errors
          const { status, data } = error.response;
          if (status === 401) {
            alert(data?.error?.message || "Login bofore booking");
            router.push('/SignIn')
          } else {
            alert("An unexpected error occurred. Please try again.");
          }
        } else {
          // Handle unexpected errors
          console.error("Error:", error);
          alert("Network or server error. Please try again. " + error);
        }
      }

  }


  return (
    <div className='bg-[#F9F9FF]'>

      <Navbar user={user}/>
      <div className="px-6 py-10 max-w-6xl mx-auto text-[#1e1e4b] pt-20">
        <button className="text-[#242565] font-semibold flex items-center mb-6">
          <FiArrowLeftCircle className="mr-2" size={20} /> Back to event
        </button>

        {event && (
          <div key={event.id}>
            <div className="rounded-xl overflow-hidden mb-6">
              <img src={event.image_url || "/event-photo.jpg"} alt={event.title} className="w-full h-96 object-cover rounded-xl" />
            </div>

            <div className="mb-4 flex gap-2">
              {event.tag && event.tag.map((t, idx) => (
                <span key={idx} className="bg-[#DADEFF] text-[#1D4ED8] text-sm px-3 py-1 pl-1 rounded flex flex-row items-start">
                  <VscCircleSmallFilled />{t}</span>
              ))}
            </div>

            <h1 className="text-3xl font-bold mb-4 text-[#242565]">{event.title}</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-[#FFFFFF] border-1 rounded-lg p-4 border-[#BDBBFB59]">
              <div className="flex items-center gap-2">
                <img src={'/calendar-2.svg'} />
                <span className='text-[#8570AD]'>
                  <p className='text-[#6A6A6A]'>Date</p>
                  {new Date(event.date).toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}

                </span>
              </div>
              <div className="flex items-center gap-2">
                <img src={'/clock.svg'} />
                <span className='text-[#8570AD]'>
                  <p className='text-[#6A6A6A]'>Time</p>
                  {new Date(`1970-01-01T${event.time}Z`).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    hour12: true,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <img src={'/location.svg'} />
                <span className='text-[#8570AD]'>
                  <p className='text-[#6A6A6A]'>Location</p>
                  {event.location}
                </span>
              </div>
            </div>




            <div className="p-6 bg-[#ffff] rounded-xl border border-[#eaeaf5] max-w-3xl mx-auto">
              <h2 className="text-lg font-semibold text-[#242565] mb-4">Select Number of Seats</h2>
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[1, 2, 3, 4].map((num) => (
                  <div
                    key={num}
                    onClick={() => handleSelect(num)}
                    className={`cursor-pointer border rounded-xl flex flex-col items-center justify-center py-6 transition-all ${selectedSeats === num
                      ? 'border-[#8570AD] bg-white shadow-md'
                      : 'border-[#E6E6E6] bg-white'
                      }`}
                  >
                    <img src={'/ticket.svg'} />
                    <div className="text-xl font-bold text-[#1e1e4b]">{num}</div>
                    <div className="text-sm text-[#8570AD]">{num === 1 ? 'Seat' : 'Seats'}</div>
                  </div>
                ))}
              </div>
              <div className='flex justify-center items-center'>
                <button
                onClick={()=>bookEvents(selectedSeats)}
                  style={{ background: 'linear-gradient(to bottom, #7B8BFF, #4157FE)' }}
                  className="cursor-pointer hover:bg-[#4533ff] text-white font-medium py-2 px-4 rounded-md">
                  Book {selectedSeats} {selectedSeats === 1 ? 'Seat' : 'Seat'}
                </button>
              </div>

            </div>


            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2 text-[#242565]">About this event</h2>
              <p className="text-[#8570AD] mb-4">{event.description}</p>
              <p className='text-[#8570AD]'>
                This event will feature:
                <ul className='list-disc list-inside text-[#8570AD]'>
                  <li>
                    Keynote talks from industry pioneers
                  </li>

                  <li>
                    Live demos of upcoming tech products
                  </li>

                  <li>
                    Startup pitching sessions  Hands-on coding workshops
                  </li>

                  <li>
                    Networking lounge for professionals and students
                  </li>

                  <li>
                    Whether you're an aspiring developer, a seasoned engineer, or just curious about what’s next in tech, this event offers something for everyone.
                  </li>
                </ul>
                <p className='text-[#8570AD]'>
                  Reserve your seat today and be part of tomorrow’s innovation. Limited seats available. Advance booking required
                </p>
              </p>

            </div>

            <div className="flex items-center text-[#4157FE] gap-2 font-medium">
              <img src={'/Chair.svg'} />
              <span className='text-[#8570AD] font-semibold text-lg'>{event.available_seats} Spots Left</span>
              <span className="text-[#6A6A6A66] font-semibold text-lg">({event.max_seats - event.available_seats} registered)</span>
            </div>
          </div>
        )}

      </div>

      <Footer/>
    </div>
  )
}
