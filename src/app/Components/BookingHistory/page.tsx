'use client';

import { EVENTBooking } from '@/app/Types/AllTypes';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import Pagination from '../Pagination/page';


export default function BookingHistory() {
    const [events, setEvents] = React.useState<EVENTBooking[]>([]);
    const router = useRouter();

    // Pagination
    const eventsPerPage = 8;
    const [currentPage, setCurrentPage] = React.useState(1);
    const totalPages = Math.ceil(events.length / eventsPerPage);
    const eventPage = events.slice(
        (currentPage - 1) * eventsPerPage,
        currentPage * eventsPerPage
    );


    useEffect(() => {
        async function fetchEvents() {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}user/bookingHistory`, { withCredentials: true });

                if (response.status === 200) {
                    console.log("response: ", response.data.data);
                    setEvents(response.data.data);
                }
                else {
                    if (response.status === 401) {
                        alert(response.statusText);
                        router.replace('/Login');
                    }
                    alert('Failed to fetch event information');
                }


            } catch (error) {
                console.error('Error fetching agency information:', error);
            }
        }
        fetchEvents();
    }, [])

    console.log("events: ", events);


    const cancelBooking = async (bookingId: number) => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_URL}user/cancelBooking/${bookingId}`,
                {},
                { withCredentials: true }
            );

            console.log("response cancel: ", response.status);
            if (response.status === 200) {
                setEvents(events.filter(event => event.id !== bookingId));
                alert('Booking canceled successfully');
            }
            else {
                alert('Failed to cancel booking');
            }
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 403) {
                    console.error('Booking can not be cancelled 48 hours before the event.', error);
                    alert('Booking can not be cancelled 48 hours before the event.');
                }
            } else {
                console.error('Error canceling booking:', error);
                alert('Failed to cancel booking');
            }
        }
    }


    return (
        <div className="min-h-screen bg-[#f7f7ff]">

            <h2 className="text-xl font-semibold text-[#242565] mb-4">
                My Registered Events
            </h2>

            <div className="space-y-4">
                {events.map((event) => (
                    <div
                        key={event.id}
                        className="bg-white p-4 rounded-lg border border-[#BDBBFB59] flex items-center justify-between"
                    >
                        <div className="flex items-center space-x-4">
                            {/* Date box */}
                            <div className="text-center bg-transparent  pr-4">
                                <div className="text-[#3D37F1] font-bold text-sm">
                                    {new Date(event.event_id.date).toLocaleString('en-US', { month: 'short' }).toUpperCase()}
                                </div>
                                <div className="text-3xl font-bold text-[#000000]">
                                    {new Date(event.event_id.date).toLocaleString('en-US', { day: '2-digit' })}
                                </div>
                            </div>

                            {/* Event Info */}
                            <div>
                                <h3 className="text-md font-semibold text-[#242565]">
                                    {event.event_id.title}
                                </h3>
                                <div className="flex items-center text-sm text-[#6A6A6A] gap-4 mt-1">
                                    <span className="flex items-center gap-1">
                                        <img width={18} src={'/calendar-2.svg'} />
                                        {new Date(event.event_id.date).toLocaleDateString('en-GB', {
                                            weekday: 'long'
                                        })}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <img width={18} src={'/clock.svg'} />
                                        {new Date(`1970-01-01T${event.event_id.time}Z`).toLocaleTimeString('en-US', {
                                            hour: 'numeric',
                                            hour12: true,
                                        })}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <img width={18} src={'/location.svg'} />
                                        {event.event_id.location}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Cancel Button */}
                        <button
                            onClick={() => { cancelBooking(event.id) }}
                            style={{ background: 'linear-gradient(to bottom, #FF847B, #FE4141)' }}
                            className="cursor-pointer text-white text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 transition">
                            Cancel registration
                        </button>
                    </div>
                ))}
            </div>

            {/* Browse More Events Button */}
            <div className="mt-10 flex justify-center">
                <button
                    onClick={() => router.push('/Homepage')}
                    style={{ background: 'linear-gradient(to bottom, #7B8BFF, #4157FE)' }}
                    className="text-white text-sm font-medium px-6 py-2 rounded-md hover:opacity-90 transition">

                    Browse more events
                </button>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage} />
        </div>
    );
}