import axios from "axios";
import {
  Apple,
  Calendar,
  Dumbbell,
  MessageSquare,
  Settings,
  Target,
  Trophy,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const getAvatarColor = (email) => {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-pink-500",
  ];
  const index = email.charCodeAt(0) % colors.length;
  return colors[index];
};

export const ClientDashboard = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.id;
  const token = localStorage.getItem("token");

  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    profileImage: "",
    assignedCoach: null,
  });
  const [plans, setPlans] = useState([]);
  const [goals, setGoals] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const handlekeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };
    window.addEventListener("keydown", handlekeyDown);
    return () => window.removeEventListener("keydown", handlekeyDown);
  }, []);

  useEffect(() => {
    if (!userId || !token) {
      toast.error("Please login as a client to access the dashboard");
      navigate("/login");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const profileResponse = await axios.get(
          "https://fitedge-backend.onrender.com/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfileData(profileResponse.data);

        const plansResponse = await axios.get(
          `https://fitedge-backend.onrender.com/api/client/plans/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPlans(plansResponse.data);

        const goalsResponse = await axios.get(
          "https://fitedge-backend.onrender.com/api/goals",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setGoals(goalsResponse.data);

        console.log("Fetched profile:", profileResponse.data);
        console.log("Fetched plans:", plansResponse.data);
        console.log("Fetched goals:", goalsResponse.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Error loading dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userId, token, user?.role, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-6 sm:py-8">
      <div className="animate-spin text-blue-600">
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
      </div>
    </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="relative">
            {profileData.coverImage ? (
              <img
                src={profileData.coverImage}
                alt="Cover"
                className="w-full h-40 object-cover rounded-t-lg cursor-pointer"
                onClick={() => setSelectedImage(profileData.coverImage)}
              />
            ) : (
              <div>No Cover Image</div>
            )}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative inline-block">
                    <div className="size-16 rounded-full flex items-center justify-center">
                      {profileData.profileImage ? (
                        <img
                          src={profileData.profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover rounded-full"
                          onClick={() =>
                            setSelectedImage(profileData.profileImage)
                          }
                        />
                      ) : (
                        <div
                          className={`size-16 rounded-full flex items-center justify-center text-white text-xl font-medium ${getAvatarColor(
                            profileData.email
                          )}`}
                        >
                          {profileData.email[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h1 className="sm:text-2xl font-bold text-gray-900">
                      Welcome, {profileData.name || "Client"}
                    </h1>
                    <p className="text-sm sm:text-2xl text-gray-600 mt-1">
                      Your fitness journey dashboard
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/settings")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Settings size={16} />
                  Settings{" "}
                </button>
              </div>
            </div>
          </div>
        </div>
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative max-w-4xl w-full h-[90vh] flex items-center justify-center">
              <img
                src={selectedImage}
                alt="Full-screen"
                className="max-w-full max-h-full object-contain"
              />
              <button
                className="absolute top-4 right-4 p-2 bg-white rounded-full text-gray-800 hover:bg-gray-100 transition-colors"
                aria-label="Close full-screen image"
                onClick={() => setSelectedImage(null)}
              >
                <X size={24} />
              </button>
            </div>
          </div>
        )}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Coach
            </h2>
            {profileData.assignedCoach ? (
              <div
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() =>
                  navigate(`/profile/${profileData.assignedCoach._id}`)
                }
              >
                <div
                  className={`size-10 rounded-full flex items-center justify-center text-white text-lg font-medium ${getAvatarColor(
                    profileData.assignedCoach.email
                  )}`}
                >
                  {profileData.assignedCoach.email[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    {profileData.assignedCoach.name ||
                      profileData.assignedCoach.email}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Click to view coach profile
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No Coach assigned yet</p>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-gray-900">
                Active plans
              </h2>
              <button
                onClick={() => navigate("/client/plans/workout")}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
              >
                View all plans
              </button>
            </div>
            {plans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plans.slice(0, 4).map((plan) => (
                  <div
                    key={plan._id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate("/client/plans/workout")}
                  >
                    <div className="flex items-center gap-2">
                      {plan.type === "workout" ? (
                        <Dumbbell size={16} className="text-blue-600" />
                      ) : (
                        <Apple size={16} className="text-green-600" />
                      )}
                      <h3 className="text-base font-medium text-gray-900">
                        {plan.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {plan.description}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Coach: {plan.coach?.name || plan.coach.email || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status: {plan.completed ? "Completed" : "In Progress"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No Active plans available</p>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Fitness Goals
              </h2>
              <button
                onClick={() => navigate("/create-goal")}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
              >
                <Target size={16} /> Add Goal
              </button>
            </div>
            {goals.length > 0 ? (
              <div className="space-y-2">
                {goals.slice(0.3).map((goal) => (
                  <div
                    key={goal._id}
                    className="border border-gray-200 rounded-lg p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate("/client/goals")}
                  >
                    <div className="flex items-center gap-2">
                      <Target size={16} className="text-blue-600" />
                      <div>
                        <span className="text-base font-medium text-gray-900">
                          {goal.title}
                        </span>
                        <p className="text-sm text-gray-600">
                          {goal.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          Progress: {goal.progress}% | Deadline:{" "}
                          {new Date(goal.deadline).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No fitness goals set.</p>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate("/chat")}
                className="p-4 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
              >
                <MessageSquare size={20} />
                Chat with Coach
              </button>
              <button
                onClick={() => navigate("/client/calendar")}
                className="p-4 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2"
              >
                <Calendar size={20} />
                View Calendar
              </button>
              <button
                onClick={() => navigate("/client/goals")}
                className="p-4 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors flex items-center gap-2"
              >
                <Trophy size={20} />
                Manage Goals
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
