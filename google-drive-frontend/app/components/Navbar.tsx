import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router"
import { useAuth } from "~/context/AuthContext"

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user && location.pathname !== "/login" && location.pathname !== "/signup") {
      navigate("/login");
      return;
    }
  }, [user, loading, navigate]);

  const handleAuthClick = async () => {
    if (user) {
      try {
        await logout();
        navigate("/login");
      } catch (err) {
        console.error("Logout failed", err);
      }
    } else {
      navigate("/login");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <>
      <nav className="flex items-center justify-between gap-4 py-4 px-14 lg:pr-4 lg:pl-64 bg-gray-900 text-white shadow-xl">
        <h1 className="text-xl ml-4 font-extrabold">Drive Clone</h1>
        <button
          onClick={handleAuthClick}
          className="bg-blue-500 font-bold text-lg hover:bg-blue-600 px-4 py-2 rounded-lg cursor-pointer"
        >
          {user ? "Logout" : "Login"}
        </button>
      </nav>
      <Outlet />
    </>
  )
}

export default Navbar