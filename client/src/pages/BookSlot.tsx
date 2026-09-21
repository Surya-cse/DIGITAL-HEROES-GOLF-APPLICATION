import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Calendar, Clock, MapPin, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const BookSlot = () => {
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const courses = ["Emerald Greens CC", "Digital Heroes Links", "Royal Palm Course"];
  const times = ["07:00 AM", "09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"];

  const handleBooking = async () => {
    if (!date || !slot) return toast.error("Please select date and time");
    try {
      await axiosInstance.post('/bookings', { date, timeSlot: slot, course: courses[0] });
      toast.success("Teetime Confirmed!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-10">
      <h1 className="text-4xl font-bold text-primary mb-8 tracking-tight">Reserve a Teetime</h1>
      
      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-white p-8 rounded-3xl shadow-card border border-slate-100">
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase mb-3">
                <Calendar size={16}/> Select Date
              </label>
              <input type="date" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary-light" 
                onChange={e => setDate(e.target.value)} />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase mb-3">
                <Clock size={16}/> Preferred Time
              </label>
              <div className="grid grid-cols-2 gap-3">
                {times.map(t => (
                  <button key={t} onClick={() => setSlot(t)}
                    className={`p-3 rounded-xl font-bold border ${slot === t ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-slate-100 hover:border-primary-light'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleBooking} className="w-full bg-primary-light text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-400 shadow-lg shadow-emerald-100">
              Confirm Booking
            </button>
          </div>
        </div>

        <div className="bg-primary rounded-[2.5rem] p-10 text-white relative overflow-hidden">
          <MapPin className="mb-6 text-emerald-300" size={32} />
          <h3 className="text-2xl font-bold mb-4">Course Details</h3>
          <p className="text-emerald-100 mb-8 leading-relaxed">You are booking at the <span className="font-bold text-white">Emerald Greens Championship Course</span>. Please arrive 15 minutes before your slot.</p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl">
              <CheckCircle size={18} className="text-emerald-400" />
              <span className="text-sm font-medium">Valid for Draw Verification</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSlot;