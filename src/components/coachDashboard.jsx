import axios from "axios";
import {
  Activity,
  Apple,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Dumbbell,
  Eye,
  LogOut,
  MessageSquare,
  Plus,
  Search,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export const CoachDashboard = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const token = localStorage.getItem("token");
  const coachId = user?.id;
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [clients, setClients] = useState([]);
  const [plans, setPlans] = useState([]);
  const [stats, setStats] = useState({});
  const [coach, setCoach] = useState({});
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [deletePlanId, setDeletePlanId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!coachId || !token || user?.role !== "coach") {
      toast.error("Please login as a coach to access this page");
      navigate("/login");
      setIsLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/coach/dashboard/${coachId}?year=${selectedYear}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setClients(response.data.clients);
        setPlans(response.data.plans);
        setStats(response.data.stats);
        setCoach(response.data.coach);
        console.log("Fetched dashboard data:", response.data);
      } catch (err) {
        console.error(
          "Failed to fetch coach dashboard data:",
          err.response?.data || err.message
        );
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [coachId, selectedYear, token, user?.role, navigate]);

  const handleDeletePlan = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/coach/plan/${deletePlanId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPlans(plans.filter((plan) => plan._id !== deletePlanId));
      toast.success("Plan deleted successfully");
      setIsDeleteModalOpen(false);
      setDeletePlanId(null);
    } catch (err) {
      console.error("Error deleting plan:", err.response?.data || err.message);
      toast.error(err.response?.data?.error || "Failed to delete plan");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    return status === "active" ? "text-green-600" : "text-gray-400";
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthlyChartData =
    stats.monthlyPlanChart?.map((count, index) => ({
      month: months[index],
      total: count,
      workout: stats.monthlyWorkoutChart?.[index] || 0,
      diet: stats.monthlyDietChart?.[index] || 0,
    })) || [];

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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="ml-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  Coach Dashboard
                </h1>
                <p className="text-gray-600">
                  Welcome Back, {coach.name || coach.email || "Coach"}
                </p>
              </div>
            </div>
            {/* <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="text-gray-600 hover:text-blue-600 border-gray-300"
                onClick={() => {
                  localStorage.removeItem("user");
                  localStorage.removeItem("userId");
                  localStorage.removeItem("token");
                  toast.success("Logged out successfully");
                  navigate("/login");
                }}
              >
                <LogOut className="w-5 h-5 mr-1" />
                Logout
              </Button>
            </div> */}
          </div>
        </div>
      </div>
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className=" overflow-x-auto max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "clients", label: "Clients", icon: Users },
              { id: "plans", label: "Plans", icon: Calendar },
              { id: "analytics", label: "Analytics", icon: Activity },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-blue-800"
                }`}
              >
                <tab.icon className="size-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <StatCard title="Clients" value={stats.totalClients || 0} />
              <StatCard title="Active Plans" value={stats.activePlans || 0} />
              <StatCard
                title="Completed Plans"
                value={stats.completedPlans || 0}
              />
              <StatCard
                title="This Week Workouts"
                value={stats.thisWeekWorkouts || 0}
              />
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button
                  onClick={() => navigate("/coach/create-plan")}
                  className="flex items-center gap-3 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                >
                  <Plus className="size-5" />
                  Create New Plan
                </Button>
                <Button
                  onClick={() => navigate("/chat")}
                  className="flex items-center gap-3 p-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <MessageSquare className="size-5" />
                  Message Clients
                </Button>
                <Button
                  onClick={() => setActiveTab("analytics")}
                  className="flex items-center gap-3 p-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <BarChart3 className="size-5" />
                  View Analytics
                </Button>
              </div>
            </div>
          </>
        )}
        {activeTab === "clients" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">My Clients</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="size-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <Input
                    type="text"
                    placeholder="Search Clients..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="pl-10 pr-4 py-2 bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>
              </div>
            </div>
            {filteredClients.length === 0 && searchQuery && (
              <p className="text-gray-600">
                No clients found for "{searchQuery}".
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map((client) => (
                <div
                  key={client._id}
                  className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => navigate(`/coach/client/${client._id}`)}
                    >
                      <div className="size-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="size-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {client.name || client.email}
                        </h3>
                        <p className="text-sm text-gray-600">{client.email}</p>
                      </div>
                    </div>
                    <div
                      className={`size-3 rounded-full ${
                        getStatusColor(client.status) === "text-green-600"
                          ? "bg-green-600"
                          : "bg-gray-400"
                      }`}
                    ></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">
                        {client.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${client.progress}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {client.activePlans}
                        </p>
                        <p className="text-xs text-gray-600">Active Plans</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {client.completedWorkouts}
                        </p>
                        <p className="text-xs text-gray-600">Workouts Done</p>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-4">
                      <Button
                        onClick={() => navigate(`/coach/client/${client._id}`)}
                        className="flex-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate("/chat")}
                        className="p-2 text-gray-600 hover:text-blue-600 border-gray-300"
                      >
                        <MessageSquare className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === "plans" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Training Plans
              </h2>
              <Button
                onClick={() => navigate("/coach/create-plan")}
                className="flex items-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
              >
                <Plus className="size-5" />
                Create New Plan
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan._id}
                  className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`p-2 rounded-lg ${
                            plan.type === "workout"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {plan.type === "workout" ? (
                            <Dumbbell className="size-5" />
                          ) : (
                            <Apple className="size-5" />
                          )}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                            plan.difficulty
                          )}`}
                        >
                          {plan.difficulty}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {plan.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {plan.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          navigate(`/coach/dashboard/plan/${plan._id}`)
                        }
                        className="p-2 text-gray-600 hover:text-blue-600 border-gray-300"
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setDeletePlanId(plan._id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 text-red-600 hover:text-red-800 border-gray-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="size-4" />
                        {plan.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        {plan.type === "workout" ? (
                          <Dumbbell className="size-4" />
                        ) : (
                          <Apple className="size-4" />
                        )}
                        {plan.type === "workout"
                          ? `${plan.exercises.length} exercises`
                          : `${plan.diet.length} meals`}
                      </div>
                    </div>
                    {plan.type === "workout" && plan.exercises.length > 0 && (
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Sample Exercises:
                        </h4>
                        <div className="space-y-1">
                          {plan.exercises.slice(0, 2).map((exercise, idx) => (
                            <div key={idx} className="text-sm text-gray-600">
                              • {exercise.name} - {exercise.sets} sets ×{" "}
                              {exercise.reps} reps
                            </div>
                          ))}
                          {plan.exercises.length > 2 && (
                            <div className="text-sm text-gray-500">
                              +{plan.exercises.length - 2} more exercises
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {plan.type === "diet" && plan.diet.length > 0 && (
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Sample Meals:
                        </h4>
                        <div className="space-y-1">
                          {plan.diet.slice(0, 2).map((meal, idx) => (
                            <div key={idx} className="text-sm text-gray-600">
                              • {meal.meal} - {meal.calories} cal ({meal.time})
                            </div>
                          ))}
                          {plan.diet.length > 2 && (
                            <div className="text-sm text-gray-500">
                              +{plan.diet.length - 2} more meals
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        {plan.completed ? (
                          <CheckCircle className="size-5 text-green-600" />
                        ) : (
                          <Clock className="size-5 text-yellow-600" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            plan.completed
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {plan.completed ? "Completed" : "In Progress"}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">
                        Created: {new Date(plan.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Analytics & Insights
              </h2>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white text-gray-900"
              >
                {stats.availableYears?.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Plans Created Per Month - {selectedYear}
              </h3>
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyChartData}>
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar
                      dataKey="workout"
                      stackId="a"
                      fill="#3b82f6"
                      name="Workouts"
                    />
                    <Bar
                      dataKey="diet"
                      stackId="a"
                      fill="#10b981"
                      name="Diets"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-gray-900">
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete this plan? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="text-gray-600 hover:text-blue-600 border-gray-300"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleDeletePlan}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4 text-center border border-gray-200">
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-blue-600">{value}</p>
    </div>
  );
};
