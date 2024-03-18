'use client'

import { formatMoney } from "@/app/transition/page";

export const InputMoney = ({ value, onValue }) => {

  const handleChange = (event) => {
    const rawValue = event.target.value.replace(/[^\d]/g, '');
    const floatValue = parseFloat(rawValue) / 100;
    onValue(formatMoney(floatValue));
  };

  return (
    <div>
      <label htmlFor="valor" className="block mb-2 font-semibold text-lg">Valor</label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        id="valor" 
        name="valor"
        className="bg-gray-100 leading-[48px] px-4 w-56 outline-none rounded-md"
      />
    </div>
  );
};
