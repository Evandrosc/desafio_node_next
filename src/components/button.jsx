'use client'

export function Button({ func, disabled, children }) {
  return (
    <button 
      onClick={func} 
      disabled={disabled} 
      className='bg-gray-500 disabled:opacity-60 disabled:bg-gray-500 disabled:cursor-not-allowed flex justify-center items-center w-[50px] h-[50px] mt-[50px] mx-[10px] rounded-[50%] text-white cursor-pointer text-xl hover:bg-blue-500'
    >
      {children}
    </button>
  )
}