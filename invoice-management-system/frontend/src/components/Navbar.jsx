import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">

      {/* Logo / Title */}
      <Link to="/dashboard" className="text-lg font-semibold tracking-wide">AINextBill</Link>


      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-gray-700 hover:text-black font-medium cursor-pointer"
      >
        <FiLogOut size={18} />
        Logout
      </button>

    </nav>
  );

}

export default Navbar;
