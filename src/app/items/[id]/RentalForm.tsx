'use client';

import { useState } from 'react';

interface RentalFormProps {
  itemId: number;
  csrf: string;
  selectedSize: string;
}

export default function RentalForm({ itemId, csrf, selectedSize }: RentalFormProps) {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const form = e.currentTarget; // Guardar referencia al formulario
    const formData = new FormData(form);
    const startDate = formData.get('start') as string;
    const endDate = formData.get('end') as string;
    const today = new Date().toISOString().split('T')[0];

    // Validación de fechas pasadas
    if (startDate < today) {
      setMessage({ type: 'error', text: 'You cannot select a start date in the past' });
      setIsSubmitting(false);
      return;
    }

    if (endDate < today) {
      setMessage({ type: 'error', text: 'You cannot select an end date in the past' });
      setIsSubmitting(false);
      return;
    }

    // Validación de fecha de inicio menor que fecha de fin
    if (endDate < startDate) {
      setMessage({ type: 'error', text: 'End date must be after start date' });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/rentals', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        // Mensajes de error específicos del servidor
        if (data.error === 'Item not available for selected dates') {
          setMessage({ type: 'error', text: 'Item is already rented for the selected dates' });
        } else {
          setMessage({ type: 'error', text: data.error || 'Error creating rental' });
        }
        return;
      }

      const data = await response.json();
      setMessage({ type: 'success', text: 'Rental successfully completed' });
      form.reset(); // Usar la referencia guardada en lugar de e.currentTarget
      
      // Disparar evento para actualizar el calendario
      window.dispatchEvent(new CustomEvent('rentalCreated'));
    } catch (error) {
      console.error('Error en la petición:', error);
      setMessage({ type: 'error', text: 'Server connection error' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl border p-4">
        <input type="hidden" name="itemId" value={itemId} />
        <input type="hidden" name="csrf" value={csrf} />
        <input type="hidden" name="size" value={selectedSize} />
        <div className="sm:col-span-2">
          <label className="sr-only" htmlFor="name">Full name</label>
          <input 
            id="name" 
            name="name" 
            required 
            placeholder="Full name" 
            className="w-full rounded-xl border px-4 py-3 text-sm"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="sr-only" htmlFor="email">Email</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            required 
            placeholder="Email" 
            className="w-full rounded-xl border px-4 py-3 text-sm"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="sr-only" htmlFor="phone">Phone</label>
          <input 
            id="phone" 
            name="phone" 
            required 
            placeholder="Phone" 
            className="w-full rounded-xl border px-4 py-3 text-sm"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="sr-only" htmlFor="start">Start date</label>
          <input 
            id="start" 
            name="start" 
            type="date" 
            required 
            className="w-full rounded-xl border px-4 py-3 text-sm"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="sr-only" htmlFor="end">End date</label>
          <input 
            id="end" 
            name="end" 
            type="date" 
            required 
            className="w-full rounded-xl border px-4 py-3 text-sm"
            disabled={isSubmitting}
          />
        </div>
        
        {message && (
          <div className={`sm:col-span-2 p-3 rounded-xl border-2 text-sm font-medium ${
            message.type === 'success' 
              ? 'border-green-600 text-green-600 dark:border-green-400 dark:text-green-400' 
              : 'border-red-600 text-red-600 dark:border-red-400 dark:text-red-400'
          }`}>
            {message.text}
          </div>
        )}
        
        <div className="sm:col-span-2">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto rounded-xl bg-fuchsia-600 text-white px-6 py-3 text-sm font-semibold hover:bg-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Procesando...' : 'Request rental'}
          </button>
        </div>
      </form>
    </>
  );
}
