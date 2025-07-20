import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, Settings, User, Trophy } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import axios from "axios";
import { toast } from "sonner";

export const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const storedUser = localStorage.getItem("user");
//   console.log("storedUser:",storedUser)
  const user = storedUser ? JSON.parse(storedUser) : null;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user || !token) return;
      try {
        const response = await axios.get("https://fitedge-backend.onrender.com/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error.response?.data || error.message);
        toast.error("Failed to load user profile");
      }
    };
    fetchUserProfile();
  }, [ token]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUserProfile(null);
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const getAvatarColor = (email) => {
    const hash = email
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      "bg-blue-600",
      "bg-green-600",
      "bg-red-600",
      "bg-purple-600",
      "bg-teal-600",
      "bg-orange-600",
    ];
    return colors[hash % colors.length];
  };

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "coach") return "/coach/dashboard";
    return "/client/dashboard";
  };
console.log("user:",user)
  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrollY > 20 ? "bg-white/40 backdrop-blur-sm shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={()=>navigate("/")} >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-blue-600">FitEdge</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/chat" className="text-gray-600 hover:text-blue-600 transition-colors">
              Chat
            </Link>
            <Link to="/settings" className="text-gray-600 hover:text-blue-600 transition-colors">
              Settings
            </Link>
            {user?.role === "coach" && (
              <Link
                to="/coach/create-plan"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Create Plan
              </Link>
            )}
            {user?.role === "user" && (
              <Link
                to="/client/plans/workout"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Plans
              </Link>
            )}
            <Link
              to={getDashboardPath()}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Dashboard
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer">
                  {userProfile?.profileImage ? (
                    <img
                      src={userProfile.profileImage}
                      alt={`${userProfile.name || userProfile.email} avatar`}
                      className="size-8 sm:size-10 rounded-full object-cover ring-2 ring-offset-2 ring-gray-200"
                    />
                  ) : (
                    <div
                      className={`size-8 sm:size-10 rounded-full flex items-center justify-center text-white text-sm sm:text-base font-medium ring-2 ring-offset-2 ${getAvatarColor(user?.email || "default")} ring-gray-200`}
                    >
                      {userProfile?.name ? userProfile.name[0].toUpperCase() : user?.email[0].toUpperCase()}
                    </div>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border-gray-200 shadow-md rounded-lg p-2">
                <DropdownMenuItem asChild>
                  <Link
                    to={`/profile/${user?.id}`}
                    className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 rounded-md px-3 py-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/settings"
                    className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 rounded-md px-3 py-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 rounded-md px-3 py-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md border-t border-gray-200">
          <div className="px-4 py-4 space-y-4">
            <Link
              to="/chat"
              className="block text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Chat
            </Link>
            <Link
              to="/settings"
              className="block text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Settings
            </Link>
            {user?.role === "coach" && (
              <Link
                to="/coach/create-plan"
                className="block text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Create Plan
              </Link>
            )}
            {user?.role === "user" && (
              <Link
                to="/client/plans/workout"
                className="block text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Plans
              </Link>
            )}
            <Link
              to={getDashboardPath()}
              className="block text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to={`/profile/${user?.id}`}
              className="block text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="block text-gray-600 hover:text-blue-600 transition-colors w-full text-left"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};