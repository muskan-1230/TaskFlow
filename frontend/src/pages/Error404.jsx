import { Link } from "react-router-dom";

function Error404() {
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-900 overflow-hidden">

      {/* Background image */}

      <img
        src="https://images.unsplash.com/photo-1518770660439-4636190af475"
        className="absolute w-full h-full object-cover opacity-30"
      />

      {/* pink glow */}

      <div className="absolute w-[500px] h-[500px] bg-pink-500 blur-[180px] opacity-40"></div>

      {/* glass card */}

      <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-16 text-center shadow-2xl">

        {/* animated 404 */}

        <h1 className="text-[120px] font-extrabold text-white animate-pulse">
          404
        </h1>

        <h2 className="text-2xl text-white font-semibold mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-300 mb-8 max-w-md">
          The page you are trying to access doesn’t exist or has been moved.
        </p>

        <Link
          to="/"
          className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full transition shadow-lg"
        >
          Back to Dashboard
        </Link>

      </div>
    </div>
  );
}

export default Error404;