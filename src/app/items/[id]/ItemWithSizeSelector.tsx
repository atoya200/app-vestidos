'use client';

import { useState } from 'react';
import ItemCalendar from './ItemCalendar';
import RentalForm from './RentalForm';

interface Props {
  itemId: number;
  availableSizes: string[];
  csrf: string;
}

export default function ItemWithSizeSelector({ itemId, availableSizes, csrf }: Props) {
  const [selectedSize, setSelectedSize] = useState<string>(availableSizes[0] || '');

  return (
    <>
      <div className="mt-4">
        <h3 className="text-sm font-semibold mb-2">Available sizes:</h3>
        <div className="flex gap-2 flex-wrap">
          {availableSizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedSize === size
                  ? 'bg-fuchsia-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-semibold mb-3">Availability for size {selectedSize}</h2>
        <ItemCalendar itemId={itemId} selectedSize={selectedSize} />
        <p className="mt-2 text-xs text-slate-500">Dates marked are already booked for this size.</p>
      </div>

      <div className="mt-10">
        <h2 className="font-semibold mb-3">Schedule a rental</h2>
        <RentalForm itemId={itemId} csrf={csrf} selectedSize={selectedSize} />
        <p className="mt-2 text-xs text-slate-500">No account required. We'll confirm availability via email.</p>
      </div>
    </>
  );
}
