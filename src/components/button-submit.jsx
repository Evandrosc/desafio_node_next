export function ButtonSubmit({children, ...props}) {
  return (
    <button
      type="submit"
      {...props}
      className="bg-blue-500 rounded-md w-56 p-3 text-white disabled:bg-blue-100 font-semibold hover:bg-blue-600 duration-300 disabled:text-blue-400 disabled:cursor-not-allowed">
        {children}
    </button>
  )
}