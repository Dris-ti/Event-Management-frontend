'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parse, set } from 'date-fns';
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

  const [imagePreview, setImagePreview] = useState<string | null>(null);


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
          setImagePreview(data.image_url || null);

          setForm({
            id: data.id,
            title: data.title || '',
            date: data.date ? format(new Date(data.date), 'dd/MM/yyyy') : '',
            time: data.time ? dayjs(data.time, "HH:mm:ss").format("hh:mm A") : '',
            description: data.description || '',
            location: data.location || '',
            max_seats: data.max_seats || 0,
            available_seats: data.available_seats || 0,
            tag: data.tag || [],
            image_url: data.image_url || '',
          });
          setImagePreview(data.image_url || null);
        } catch (error) {
          console.error('Error fetching event:', error);
          alert('Failed to load event details.');
        }
      }
    };

    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    if (!isOpen) {
      setImagePreview(null); // Reset image when modal is closed
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as any;

    setForm((prev) => {
      if (name === 'max_seats') {
        return { ...prev, max_seats: parseInt(value), available_seats: parseInt(value) };
      }

      if (name === 'tag') {
        return { ...prev, tag: value.split(',').map((t: string) => t.trim()) };
      }

      if (name === 'image_url') {
        if (files && files.length > 0) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result as string);
          };
          reader.readAsDataURL(files[0]);

          return { ...prev, image_url: files[0] };
        }
        return { ...prev, [name]: value };
      }

      return { ...prev, [name]: value };
    });

  };


  const handleSubmit = async () => {
    const formattedDate = dayjs(form.date, "DD/MM/YYYY").format("YYYY-MM-DD");
    const formattedTime = dayjs(form.time, ["hh:mm A"]).format("HH:mm:ss");

    console.log('Formatted time:', formattedTime);

    const eventData = new FormData();
    eventData.append('title', form.title);
    eventData.append('description', form.description);
    eventData.append('location', form.location);
    eventData.append('date', formattedDate);
    eventData.append('time', formattedTime);
    eventData.append('max_seats', String(form.max_seats));
    eventData.append('available_seats', String(form.max_seats));
    (form.tag ?? []).forEach((tag) => {
      eventData.append('tag', tag);
    });

    if (form.image_url && typeof form.image_url !== 'string') {
      eventData.append('image_url', form.image_url);
    }
    for (let [key, value] of eventData.entries()) {
      console.log(key, value);
    }

    try {
      const url = newEvent
        ? `${process.env.NEXT_PUBLIC_URL}admin/createEvent`
        : `${process.env.NEXT_PUBLIC_URL}admin/editEvent/${eventId}`;

      const response = await axios.post(url, eventData, {
        withCredentials: true,
      });


      if ((newEvent && response.status === 201) || (!newEvent && response.status === 200)) {
        alert(`Event ${newEvent ? "created" : "edited"} successfully.`);
        onCreate(form);
        onClose();
      } else {
        alert(`Event failed to ${newEvent ? "create" : "edit"}.`);
      }
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
            value={form.title ?? ''}
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
                  value={form.time ?? ''}
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
            value={form.location ?? ''}
            onChange={handleChange}
            className="w-full border border-[#E5E9EB] placeholder-[#6F6F6F] px-4 py-2 rounded-md text-sm"
          />

          <div className="flex text-[#242565] gap-4">
            <div className='w-1/2'>
              <label className="block text-sm font-medium text-[#242565] mb-1">Capacity</label>

              <input
                type="number"
                name="max_seats"
                value={form.max_seats ?? ''}
                onChange={handleChange}
                className="w-full border border-[#E5E9EB] placeholder-[#6F6F6F] px-4 py-2 rounded-md text-sm"
              />
            </div>

            <div className='w-1/2'>
              <label className="block text-sm font-medium text-[#242565] mb-1">Tags (Comma Separated)</label>

              <input
                type="text"
                name="tag"
                value={(form.tag ?? []).join(', ')}
                onChange={handleChange}
                className="w-full border border-[#E5E9EB] placeholder-[#6F6F6F] px-4 py-2 rounded-md text-sm"
              />
            </div>
          </div>


          <div>
            <label className="block text-sm font-medium text-[#242565] mb-1">Image</label>
            <div className='flex gap-2 items-center'>
              {imagePreview ? (
                <div className="relative w-10 h-10 border-2 border-[#242565] rounded overflow-hidden shadow-md">
                  <img src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
                </div>
              ) : (
                <img src='/Frame 2.svg' alt="Placeholder" className="lg:w-13 lg:h-13 " />
              )}

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
