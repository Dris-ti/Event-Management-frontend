import EventModal from '@/app/Components/EventModal/page';
import { EVENT } from '@/app/Types/AllTypes';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import Pagination from '../Pagination/page';


export default function EventManagementTable() {
    const [showModal, setShowModal] = React.useState(false);
    const [selectedEventId, setSelectedEventId] = React.useState<number>(0);
    const [events, setEvents] = React.useState<EVENT[]>([]);
    const router = useRouter();

    // Pagination
    const eventsPerPage = 8;
    const [currentPage, setCurrentPage] = React.useState(1);
    const totalPages = Math.ceil(events.length / eventsPerPage);
    const eventPage = Array.isArray(events)
  ? events.slice((currentPage - 1) * eventsPerPage, currentPage * eventsPerPage)
  : [];

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                console.log("Fetching events...");
                const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}admin/showallEvents`, {
                    withCredentials: true,
                });
                console.log("Response:", response.data);

                if (response.status === 200) {
                    setEvents(response.data.data);
                } else {
                    setEvents([]);
                }
            }
            catch (error) {
                console.error("Error fetching events:", error);
                if (axios.isAxiosError(error) && error.response) {
                    // Handle server response errors
                    const { status, data } = error.response;
                    if (status === 401) {
                        alert(data?.error?.message || "Invalid email or password");
                        router.push('/SignIn');

                    } else {
                        alert("An unexpected error occurred. Please try again.");
                    }
                } else {
                    // Handle unexpected errors
                    console.error("Error:", error);
                    alert("Network or server error. Please try again. " + error);
                }
            };
        }
        fetchEvents();
    }, [showModal]);


    const onCreate = (id: string | number) => {
        setSelectedEventId(Number(id));
        setShowModal(true);
    }

    const onDelete = async (id: string | number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this event?");
        if (confirmDelete) {
            try {
                const response = await axios.delete(`${process.env.NEXT_PUBLIC_URL}admin/deleteEvent/${id}`, { withCredentials: true })

                console.log("Type of data:", typeof response.data.data);
                console.log("Data:", response.data.data);

                if (response.status === 200 && Array.isArray(response.data.data)) {
                    setEvents(response.data.data);
                } else {
                    console.warn("Expected an array but got:", response.data.data);
                    setEvents([]);
                }
            }
            catch (error) {
                console.error("Error deleting event:", error);
                alert("An error occurred while deleting the event");
            }
        }
    }

    const handleModal = () => {

    }

    return (
        <div className='min-h-screen bg-[#f7f7ff]'>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-[600] text-indigo-900">Events Management</h2>
                <button
                    onClick={() => onCreate(0)}
                    style={{ background: 'linear-gradient(to bottom, #7B8BFF, #4157FE)' }}
                    className="cursor-pointer backdrop-blur-lg hover:opacity-90 transition text-white px-4 py-2 rounded-md text-sm shadow"
                >
                    Create Event
                </button>
            </div>

            <EventModal
                isOpen={showModal}
                eventId={selectedEventId}
                onClose={() => setShowModal(false)}
                onCreate={handleModal}
            />

            <div className="bg-white shadow rounded-md overflow-x-auto">
                <table className="bg-[#F8F8FB] min-w-full text-sm text-left">
                    <thead className="bg-white text-[#242565] border-[#E6E6E6] border-1">
                        <tr>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Location</th>
                            <th className="px-6 py-3">Registrations</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {eventPage.map((event) => (
                            <tr key={event.id} className="border-[#E6E6E6] border-b-1 hover:bg-[#E6E6E6] transition">
                                <td className="px-6 py-4">{event.title}</td>
                                <td className="px-6 py-4">{new Date(event.date).toLocaleDateString('en-GB', {
                                    weekday: 'long',
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                })}</td>
                                <td className="px-6 py-4">{event.location}</td>
                                <td className="px-6 py-4">
                                    {event.max_seats - event.available_seats}/{event.max_seats}
                                </td>
                                <td className="flex items-center gap-4 lg:px-6 py-4 sm:justify-center">
                                    <button className=''>
                                        <img src="/eye.svg" alt="View" className="cursor-pointer" onClick={() => { }} />
                                    </button>

                                    <button>
                                        <img src="/edit.svg" alt="Edit" className="cursor-pointer" onClick={() => { onCreate(event.id) }} />
                                    </button>
                                    <button>
                                        <img src="/trash.svg" alt="Delete" className="cursor-pointer" onClick={() => { onDelete(event.id) }} />
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage} />
        </div>
    )
}
