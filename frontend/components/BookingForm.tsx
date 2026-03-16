import { useState } from 'react';
import { FiCalendar, FiClock, FiUser, FiMail, FiPhone } from 'react-icons/fi';
import { useForm } from 'react-hook-form';

interface BookingFormProps {
  onBooking?: (data: any) => void;
}

export default function BookingForm({ onBooking }: BookingFormProps) {
  const { register, handleSubmit, watch } = useForm();
  const [step, setStep] = useState(1);

  const selectedDate = watch('date');
  const selectedTime = watch('time');

  const handleFormSubmit = (data: any) => {
    if (onBooking) {
      onBooking(data);
    }
  };

  const steps = [
    { number: 1, title: 'Select Station' },
    { number: 2, title: 'Choose Time' },
    { number: 3, title: 'Personal Info' },
    { number: 4, title: 'Confirm' },
  ];

  return (
    <div className="card">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex gap-4 mb-4">
          {steps.map((s) => (
            <div key={s.number} className="flex-1">
              <button
                onClick={() => setStep(s.number)}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  step >= s.number
                    ? 'bg-primary-600 text-white'
                    : 'bg-accent-100 text-accent-600'
                }`}
              >
                {s.number}
              </button>
              <p className="text-xs text-accent-600 text-center mt-1">{s.title}</p>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Step 1: Station Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-accent-900">Select a Station</h3>
            <div className="space-y-3">
              {[
                { id: 1, name: 'Downtown Station', address: '123 Main St' },
                { id: 2, name: 'Green Park Hub', address: '456 Park Ave' },
                { id: 3, name: 'Tech Central', address: '789 Tech Blvd' },
              ].map((station) => (
                <label key={station.id} className="flex items-center p-4 border-2 border-accent-200 rounded-lg cursor-pointer hover:border-primary-300">
                  <input
                    type="radio"
                    value={station.id}
                    {...register('stationId', { required: true })}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-semibold text-accent-900">{station.name}</p>
                    <p className="text-sm text-accent-600">{station.address}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Date and Time */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-accent-900">Choose Date & Time</h3>
            <div>
              <label className="label flex items-center gap-2">
                <FiCalendar />
                Date
              </label>
              <input
                type="date"
                {...register('date', { required: true })}
                className="input"
              />
            </div>
            <div>
              <label className="label flex items-center gap-2">
                <FiClock />
                Time
              </label>
              <input
                type="time"
                {...register('time', { required: true })}
                className="input"
              />
            </div>
            <div>
              <label className="label">Duration</label>
              <select {...register('duration', { required: true })} className="input">
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="180">3 hours</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Personal Info */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-accent-900">Your Information</h3>
            <div>
              <label className="label flex items-center gap-2">
                <FiUser />
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                {...register('fullName', { required: true })}
                className="input"
              />
            </div>
            <div>
              <label className="label flex items-center gap-2">
                <FiMail />
                Email
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                {...register('email', { required: true })}
                className="input"
              />
            </div>
            <div>
              <label className="label flex items-center gap-2">
                <FiPhone />
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 (234) 567-890"
                {...register('phone', { required: true })}
                className="input"
              />
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-accent-900">Confirm Booking</h3>
            <div className="bg-primary-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-accent-600">Station:</span>
                <span className="font-semibold text-accent-900">Downtown Station</span>
              </div>
              <div className="flex justify-between">
                <span className="text-accent-600">Date & Time:</span>
                <span className="font-semibold text-accent-900">{selectedDate} at {selectedTime}</span>
              </div>
              <div className="border-t border-primary-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-accent-600">Total Price:</span>
                  <span className="text-2xl font-bold text-gradient">$12.50</span>
                </div>
              </div>
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('terms', { required: true })}
                className="mt-1"
              />
              <span className="text-sm text-accent-600">
                I agree to the terms and conditions
              </span>
            </label>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-6 border-t border-accent-100">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="btn btn-outline flex-1"
            >
              Back
            </button>
          )}
          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="btn btn-primary flex-1"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-primary flex-1"
            >
              Confirm Booking
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
