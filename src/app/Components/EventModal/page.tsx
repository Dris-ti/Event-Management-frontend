'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parse, set } from 'date-fns';
import { FaRegCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import dayjs from 'dayjs';
import customParseFormat from "dayjs/plugin/customParseFormat";
import { EVENT } from '@/app/Types/AllTypes';
dayjs.extend(customParseFormat);

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (eventData: any) => void;
  eventId: number;
};

const EventModal: React.FC<Props> = ({ isOpen, onClose, onCreate, eventId }) => {
  const [newEvent, setNewEvent] = useState(true);
  const [form, setForm] = useState<EVENT>({
  id: '', 
  title: '',
  date: '',
  time: '',
  description: '',
  location: '',
  max_seats: 0,
  available_seats: 0,
  tag: [],
  image_url: new File([], 'default.jpg'),
  });


  useEffect(() => {
    const fetchEvent = async () => {
      if (eventId === 0) {
        // Reset form for new event
        setForm({
          id: '',
          title: '',
          date: '',
          time: '',
          description: '',
          location: '',
          max_seats: 0,
          available_seats: 0,
          tag: [],
          image_url: new File([], "default.jpg"),
        });
        setNewEvent(true);
      } else {
        setNewEvent(false);
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}admin/showEvent/${eventId}`, {
            withCredentials: true,
          });

          if (response.status !== 200) {
            alert("Failed to load event details.")
          }
          const data = response.data.data;

          setForm({
            id: data.id,
            title: data.title || '',
            date: data.date ? format(new Date(data.date), 'dd/MM/yyyy') : '',
            time: data.time ? dayjs(data.time, "HH:mm:ss").format("hh:mm A") : '',
            description: data.description || '',
            location: data.location || '',
            max_seats: data.max_seats || 0,
            available_seats: data.available_seats || 0,
            tag: data.tags || [],
            image_url: data.image_url || 'default.jpg',
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

    setForm((prev) => {
      if (!prev) return prev;

      if (name === 'max_seats') {
        return { ...prev, max_seats: parseInt(value), available_seats: parseInt(value) };
      }

      if (name === 'tag') {
        return { ...prev, tag: value.split(',').map((t: string) => t.trim()) };
      }

      if (name === 'image_url') {
        return { ...prev, image_url: files ? files[0] : prev.image_url };
      }

      return { ...prev, [name]: value };
    });
  };


  const handleSubmit = async () => {
    const formattedDate = dayjs(form.date, "DD/MM/YYYY").format("YYYY-MM-DD");
    const formattedTime = dayjs(form.time, ["hh:mm A"]).format("HH:mm:ss");

    console.log('Formatted time:', formattedTime);

    const eventData = {
      title: form.title,
      description: form.description,
      location: form.location,
      date: formattedDate,
      time: formattedTime,
      max_seats: form.max_seats,
      available_seats: form.max_seats,
      tag: form.tag,
      image_url: form.image_url instanceof File ? form.image_url : new File([], form.image_url),
    };


    console.log('Submitting event data:', eventData);
    try {
      if (newEvent) {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}admin/createEvent`,
          eventData,
          { withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
           });

        if (response.status === 201) {
          alert("Event created successfully.");
          onCreate(form);
        } else {
          alert("Event failed to create.");
        }
      }
      else {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}admin/editEvent/${eventId}`,
          eventData,
          { withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
           });

        if (response.status === 200) {
          alert("Event edited successfully.");
          onCreate(form); 
        } else {
          console.error('Failed to edit event:', response.data);
          alert("Event failed to edit.");
        }
      }
      onClose(); 
    } catch (error) {
      console.error('Error submitting event:', error);
      alert('Failed to submit event. Please check your data and try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative shadow-xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#191F38] hover:text-gray-600">
          <X />
        </button>
        
        <h2 className="text-xl font-semibold text-[#242565] mb-6">{newEvent ? 'Create New Event' : 'Edit Event'}</h2>

        <div className="space-y-4 text-[#242565]">
          <label className="block text-sm font-medium text-[#242565] mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border border-[#E5E9EB] px-4 py-2 rounded-md text-sm"
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
                  className="w-full border border-[#E5E9EB] placeholder-[#6F6F6F] px-4 py-2 rounded-md text-sm pr-10"
                />
                <img src='/calendar.svg' className="absolute right-3 top-1/2 transform -translate-y-1/2" />
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
                  className="w-full border border-[#E5E9EB] placeholder-[#6F6F6F] px-4 py-2 rounded-md text-sm"
                />
                <img src='/clock sm.svg' className="absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>


            </div>



          </div>

          <label className="block text-sm font-medium text-[#242565] mb-1">Desciption</label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-[#E5E9EB] placeholder-[#6F6F6F] px-4 py-2 rounded-md text-sm resize-none h-20 text-[#242565]"
          />

          <label className="block text-sm font-medium text-[#242565] mb-1">Location</label>

          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full border border-[#E5E9EB] placeholder-[#6F6F6F] px-4 py-2 rounded-md text-sm"
          />

          <div className="flex text-[#242565] gap-4">
            <div className='w-1/2'>
              <label className="block text-sm font-medium text-[#242565] mb-1">Capacity</label>

              <input
                type="number"
                name="max_seats"
                value={form.max_seats}
                onChange={handleChange}
                className="w-full border border-[#E5E9EB] placeholder-[#6F6F6F] px-4 py-2 rounded-md text-sm"
              />
            </div>

            <div className='w-1/2'>
              <label className="block text-sm font-medium text-[#242565] mb-1">Tags (Comma Separated)</label>

              <input
                type="text"
                name="tag"
                value={form.tag}
                onChange={handleChange}
                className="w-full border border-[#E5E9EB] placeholder-[#6F6F6F] px-4 py-2 rounded-md text-sm"
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
                  name="image_url"
                  className="hidden"
                  onChange={handleChange}
                />
              </label>

            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="text-[#6A6A6A] hover:opacity-90 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="cursor-pointer bg-[#6F7EFF] hover:opacity-90 text-white px-4 py-2 rounded-md text-sm"
            style={{ background: 'linear-gradient(to bottom, #7B8BFF, #4157FE)' }}
          >
            {newEvent ? 'Create Event' : 'Edit Event'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
