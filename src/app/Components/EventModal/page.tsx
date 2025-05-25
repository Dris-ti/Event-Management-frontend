'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parse } from 'date-fns';
import { FaRegCalendarAlt } from 'react-icons/fa';
import axios from 'axios';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (eventData: any) => void;
  eventId: number;
};

const EventModal: React.FC<Props> = ({ isOpen, onClose, onCreate, eventId }) => {
  const [form, setForm] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    location: '',
    capacity: '',
    tags: '',
    image: null as File | null,
  });

  useEffect(() => {
    const fetchEvent = async () => {
      if (eventId === 0) {
        // Reset form for new event
        setForm({
          title: '',
          date: '',
          time: '',
          description: '',
          location: '',
          capacity: '',
          tags: '',
          image: null,
        });
      } else {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}admin/showEvent/${eventId}`, {
            withCredentials: true,
          });

          if (response.status !== 200) {
            alert("Failed to load event details.")
          }
          const data = response.data.data;

          setForm({
            title: data.title || '',
            date: data.date ? format(new Date(data.date), 'dd/MM/yyyy') : '',
            time: data.time || '',
            description: data.description || '',
            location: data.location || '',
            capacity: data.max_seats?.toString() || '',
            tags: data.tags?.join(', ') || '',
            image: data.image_url || null, // 
          });
        } catch (error) {
          console.error('Error fetching event:', error);
          alert('Failed to load event details.');
        }
      }
    };

    fetchEvent();
  }, [eventId]);


  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as any;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = () => {
    onCreate(async () => {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}admin/createEvent`, {
          form,
          withCredentials: true,
        });

        if (response.status === 201) {
          alert("Event edited successfully.");
        }
        else {
          alert("Event failed to edit.");
        }
      }
      catch (error) {
        console.error('Error submitting event:', error);
        alert('Failed to submit event. Please check your data and try again.');
      }

    });
    onClose();
  };

  const parsedDate = form.date
    ? parse(form.date, 'dd/MM/yyyy', new Date())
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative shadow-xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X />
        </button>
        <h2 className="text-xl font-semibold text-[#242565] mb-6">Create New Event</h2>

        <div className="space-y-4 text-[#242565]">
          <label className="block text-sm font-medium text-[#242565] mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md text-sm"
          />

          <div className="flex text-[#242565] gap-4">
            <div className='w-1/2'>
              <label className="block text-sm font-medium text-[#242565] mb-1">Date</label>
              <div className="relative w-full">
                <DatePicker
                  selected={form.date ? parse(form.date, 'dd/MM/yyyy', new Date()) : null}
                  onChange={(date: Date | null) => {
                    setForm(prev => ({
                      ...prev,
                      date: date ? format(date, 'dd/MM/yyyy') : '',
                    }));
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="dd/mm/yyyy"
                  className="w-full border border-gray-300 px-4 py-2 rounded-md text-sm pr-10"
                />
                <img src='/calendar.svg' className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className='w-1/2'>
              <label className="block text-sm font-medium text-[#242565] mb-1">Time</label>
              <div className='relative w-full'>
                <input
                  type="text"
                  name="time"
                  placeholder="e.g. 09:00 AM - 11:00 AM"
                  value={form.time}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-md text-sm"
                />
                <img src='/clock sm.svg' className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8570AD] pointer-events-none" />
              </div>


            </div>



          </div>

          <label className="block text-sm font-medium text-[#242565] mb-1">Desciption</label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md text-sm resize-none h-20 text-[#242565]"
          />

          <label className="block text-sm font-medium text-[#242565] mb-1">Location</label>

          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md text-sm"
          />

          <div className="flex text-[#242565] gap-4">
            <div className='w-1/2'>
              <label className="block text-sm font-medium text-[#242565] mb-1">Capacity</label>

              <input
                type="number"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-md text-sm"
              />
            </div>

            <div className='w-1/2'>
              <label className="block text-sm font-medium text-[#242565] mb-1">Tags (Comma Separated)</label>

              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-md text-sm"
              />
            </div>
          </div>


          <div>
            <label className="block text-sm font-medium text-[#242565] mb-1">Image</label>
            <div className='flex gap-2'>
              <img src='/Frame 2.svg' />

              <label htmlFor="image" className="cursor-pointer block">
                <p className='text-sm'>
                  Drag or <span className="text-[#1D4ED8] underline">upload</span> the picture here
                </p>
                <p className="mt-1 text-xs text-[#6A6A6A]">Max. 5MB | JPG, PNG</p>
                <input
                  id="image"
                  type="file"
                  accept=".jpg,.png"
                  name="image"
                  className="hidden"
                  onChange={handleChange}
                />
              </label>

              {/* {form.image && (
              <p className="mt-2 text-xs text-green-600">Selected: {form.image.name}</p>
            )} */}


            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-[#6F7EFF] hover:bg-[#5c6cf2] text-white px-4 py-2 rounded-md text-sm"
            style={{ background: 'linear-gradient(to bottom, #7B8BFF, #4157FE)' }}
          >
            Create Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
