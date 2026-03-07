import { Link } from "react-router-dom";

function NotFound() {
  return (

    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">

      <h1 className="text-6xl font-bold text-gray-700">
        404
      </h1>

      <p className="text-xl text-gray-500 mt-3">
        Page Not Found
      </p>

      <p className="text-gray-400 mt-2">
        The page you are looking for does not exist.
      </p>

      <Link
        to="/"
        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        Go Back Home
      </Link>

    </div>

  );
}

export default NotFound;