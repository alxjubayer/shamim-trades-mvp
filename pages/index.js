export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300">
      <div className="bg-white shadow-xl rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Welcome to Shamim Trades 🚀
        </h1>
        <p className="text-gray-700 text-lg">
          This is your MVP platform with bilingual support (English & বাংলা).
        </p>

        <div className="mt-6 space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
            Employee Sign Up
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700">
            Admin Login
          </button>
        </div>
      </div>

      <footer className="mt-10 text-gray-600">
        © {new Date().getFullYear()} Shamim Trades
      </footer>
    </div>
  );
}
