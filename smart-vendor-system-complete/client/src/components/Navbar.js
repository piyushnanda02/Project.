import { FaBell, FaSearch, FaUserCircle, FaSignOutAlt } from "react-icons/fa";

export default function Navbar({ onLogout }) {
  return (
    <nav className="flex items-center justify-between bg-gray-900 text-white px-6 py-3 shadow-md">
      {/* Logo */}
      <div className="text-xl font-bold">Smart Vendor Ledger</div>

      {/* Search Bar */}
      <div className="flex items-center bg-gray-800 rounded-md px-3 py-1 w-1/3">
        <FaSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none text-sm w-full"
        />
      </div>

      {/* Icons */}
      <div className="flex items-center space-x-6">
        <FaBell className="cursor-pointer hover:text-yellow-400" />
        <FaUserCircle className="cursor-pointer hover:text-blue-400" />
        <FaSignOutAlt
          className="cursor-pointer hover:text-red-400"
          onClick={onLogout}
        />
      </div>
    </nav>
  );
}
