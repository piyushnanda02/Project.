import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaExchangeAlt,
  FaUsers,
  FaBoxes,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Sidebar() {
  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen p-4 shadow-lg">
      <ul className="space-y-4">
        <li>
          <NavLink
            to="/dashboard"
            className="flex items-center space-x-2 hover:text-yellow-400"
          >
            <FaTachometerAlt /> <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/transactions"
            className="flex items-center space-x-2 hover:text-yellow-400"
          >
            <FaExchangeAlt /> <span>Transactions</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/vendors"
            className="flex items-center space-x-2 hover:text-yellow-400"
          >
            <FaUsers /> <span>Vendors</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/inventory"
            className="flex items-center space-x-2 hover:text-yellow-400"
          >
            <FaBoxes /> <span>Inventory</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/reports"
            className="flex items-center space-x-2 hover:text-yellow-400"
          >
            <FaChartBar /> <span>Reports</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/analytics"
            className="flex items-center space-x-2 hover:text-yellow-400"
          >
            <FaChartBar /> <span>Analytics</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/settings"
            className="flex items-center space-x-2 hover:text-yellow-400"
          >
            <FaCog /> <span>Settings</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/logout"
            className="flex items-center space-x-2 hover:text-red-400"
          >
            <FaSignOutAlt /> <span>Logout</span>
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
