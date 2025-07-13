import React from 'react'

const ErrorPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-lg mb-4">Oops! The page you’re looking for does not exist.</p>
      <a href="/" className="text-blue-600 underline">
        Go back home
      </a>
    </div>
  )
}

export default ErrorPage