import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Users,
  UserCheck,
  Activity,
  TrendingUp,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Settings,
  X,
  Target,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const token = localStorage.getItem("token");

  const [coaches, setCoaches] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCoaches: 0,
    activeAssignments: 0,
    monthlyGrowth: 0,
  });
  const [activity, setActivity] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    // if (!user?.id || !token || user?.role !== "admin") {
    //   toast.error("Please login as an admin to access the dashboard");
    //   navigate("/login");
    //   setIsLoading(false);
    //   return;
    // }

    const fetchData = async () => {
      try {
        const [
          coachesResponse,
          usersResponse,
          statsResponse,
          activityResponse,
        ] = await Promise.all([
          axios.get("https://fitedge-backend.onrender.com/api/admin/coaches", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://fitedge-backend.onrender.com/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://fitedge-backend.onrender.com/api/admin/stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://fitedge-backend.onrender.com/api/admin/activity", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setCoaches(coachesResponse.data);
        setUsers(usersResponse.data);
        setStats(statsResponse.data);
        setActivity(activityResponse.data.slice(0, 4));
        console.log("Fetched coaches:", coachesResponse.data);
        console.log("Fetched users:", usersResponse.data);
        console.log("Fetched stats:", statsResponse.data);
        console.log("Fetched activity:", activityResponse.data);
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response?.data || error.message
        );
        toast.error("Error loading dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [ token, navigate]);

  const handleAssign = async () => {
    if (!selectedCoach || !selectedClient) {
      toast.error("Please select both a coach and a client");
      return;
    }
    try {
      await axios.post(
        "https://fitedge-backend.onrender.com/api/admin/assign",
        { coachId: selectedCoach, clientId: selectedClient },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Client assigned to coach successfully!");
      setIsConfirmOpen(false);
      setSelectedCoach("");
      setSelectedClient("");
      const [usersResponse, activityResponse] = await Promise.all([
        axios.get("https://fitedge-backend.onrender.com/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("https://fitedge-backend.onrender.com/api/admin/activity", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setUsers(usersResponse.data);
      setActivity(activityResponse.data.slice(0, 4));
    } catch (error) {
      console.error(
        "Assignment failed:",
        error.response?.data || error.message
      );
      toast.error("Assignment failed");
    }
  };

  const handleEdit = async (userId, updatedData) => {
    try {
      await axios.put(
        `https://fitedge-backend.onrender.com/api/admin/users/${userId}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("User updated successfully!");
      setEditingUser(null);
      const usersResponse = await axios.get(
        "https://fitedge-backend.onrender.com/api/admin/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(usersResponse.data);
      setCoaches(usersResponse.data.filter((u) => u.role === "coach"));
    } catch (error) {
      console.error("Edit failed:", error.response?.data || error.message);
      toast.error("Failed to update user");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`https://fitedge-backend.onrender.com/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User deleted successfully!");
      const usersResponse = await axios.get(
        "https://fitedge-backend.onrender.com/api/admin/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(usersResponse.data);
      setCoaches(usersResponse.data.filter((u) => u.role === "coach"));
    } catch (error) {
      console.error("Delete failed:", error.response?.data || error.message);
      toast.error("Failed to delete user");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesFilter && user.role === "client";
  });

  const filteredCoaches = coaches.filter((coach) => {
    const matchesSearch =
      (coach.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (coach.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || coach.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const StatCard = ({ title, value, change, icon: Icon }) => (
    <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {change && (
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-green-600 text-sm">+{change}%</span>
              </div>
            )}
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const TabButton = ({ id, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 duration-400 ${
        isActive
          ? "bg-blue-600 text-white"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );

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

  console.log("coaches:", coaches);
  console.log("clients:", users);
  console.log("activites:", activity);
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="size-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-serif font-medium">
                  A
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Manage your fitness platform
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            change={stats.monthlyGrowth}
            icon={Users}
          />
          <StatCard
            title="Total Coaches"
            value={stats.totalCoaches}
            icon={UserCheck}
          />
          <StatCard
            title="Active Assignments"
            value={stats.activeAssignments}
            icon={Target}
          />
        </div>
        <div className="flex overflow-x-auto space-x-2 mb-8 bg-white p-2 rounded-lg border border-gray-200">
          <TabButton
            id="overview"
            label="Overview"
            isActive={activeTab === "overview"}
            onClick={setActiveTab}
          />
          <TabButton
            id="users"
            label="Users"
            isActive={activeTab === "users"}
            onClick={setActiveTab}
          />
          <TabButton
            id="coaches"
            label="Coaches"
            isActive={activeTab === "coaches"}
            onClick={setActiveTab}
          />
          <TabButton
            id="assignments"
            label="Assignments"
            isActive={activeTab === "assignments"}
            onClick={setActiveTab}
          />
        </div>
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activity.length > 0 ? (
                      activity.map((act, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-gray-900 font-medium">
                              {act.action}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {act.user} {act.details ? `- ${act.details}` : ""}
                            </p>
                          </div>
                          <span className="text-gray-600 text-xs">
                            {act.time
                              ? new Date(act.time).toLocaleString()
                              : "N/A"}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">No recent activity.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => navigate("/chat")}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat
                  </Button>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => navigate("/settings")}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {activeTab === "users" && (
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-4 text-sm font-medium text-gray-700">
                        User
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">
                        Coach
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">
                        Join Date
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.name?.charAt(0) ||
                                user.email?.charAt(0) ||
                                "?"}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {user.name || "N/A"}
                              </p>
                              <p className="text-gray-600 text-sm">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 text-gray-600">
                          {user.assignedCoach?.name ||
                            user.assignedCoach?.email ||
                            "Unassigned"}
                        </td>

                        <td className="p-4 text-gray-600">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <button
                              className="p-2 text-gray-600 hover:text-blue-600"
                              onClick={() => navigate(`/profile/${user._id}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 text-gray-600 hover:text-blue-600"
                              onClick={() => setEditingUser(user)}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 text-gray-600 hover:text-red-600"
                              onClick={() => handleDelete(user._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {users.length === 0 && (
                <p className="text-gray-600 text-center py-4">
                  No users found.
                </p>
              )}
            </CardContent>
          </Card>
        )}
        {activeTab === "coaches" && (
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                Coach Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-4 text-sm font-medium text-gray-700">
                        Coach
                      </th>

                      <th className="text-left p-4 text-sm font-medium text-gray-700">
                        Clients
                      </th>

                      <th className="text-left p-4 text-sm font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCoaches.map((coach) => (
                      <tr
                        key={coach._id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {coach.name?.charAt(0) ||
                                coach.email?.charAt(0) ||
                                "?"}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {coach.name || "N/A"}
                              </p>
                              <p className="text-gray-600 text-sm">
                                {coach.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm font-medium">
                            {coach.assignedClients?.length || 0} clients
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <button
                              className="p-2 text-gray-600 hover:text-blue-600"
                              onClick={() => navigate(`/profile/${coach._id}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 text-gray-600 hover:text-blue-600"
                              onClick={() => setEditingUser(coach)}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 text-gray-600 hover:text-red-600"
                              onClick={() => handleDelete(coach._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredCoaches.length === 0 && (
                <p className="text-gray-600 text-center py-4">
                  No coaches found.
                </p>
              )}
            </CardContent>
          </Card>
        )}
        {activeTab === "assignments" && (
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Assign Client to Coach
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Coach
                  </label>
                  <Select
                    value={selectedCoach}
                    onValueChange={setSelectedCoach}
                  >
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder="Choose a coach" />
                    </SelectTrigger>
                    <SelectContent className={"bg-white"}>
                      {coaches.map((coach) => (
                        <SelectItem key={coach._id} value={coach._id}>
                          {coach.name || coach.email}{" "}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Client
                  </label>
                  <Select
                    value={selectedClient}
                    onValueChange={setSelectedClient}
                  >
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder="Choose a client" />
                    </SelectTrigger>
                    <SelectContent className={"bg-white"}>
                      {users
                        .filter((user) => user.role === "user")
                        .map((client) => (
                          <SelectItem key={client._id} value={client._id}>
                            {client.name || client.email}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={() => setIsConfirmOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!selectedCoach || !selectedClient}
              >
                Assign Client
              </Button>
            </CardContent>
          </Card>
        )}
        {isConfirmOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Confirm Assignment
                </h2>
                <button
                  onClick={() => setIsConfirmOpen(false)}
                  className="p-1 text-gray-600 hover:text-gray-800"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-gray-600 mb-4">
                Assign{" "}
                <span className="font-medium">
                  {users.find((u) => u._id === selectedClient)?.name ||
                    users.find((u) => u._id === selectedClient)?.email}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {coaches.find((c) => c._id === selectedCoach)?.name ||
                    coaches.find((c) => c._id === selectedCoach)?.email}
                </span>
                ?
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleAssign}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Confirm
                </Button>
                <Button
                  onClick={() => setIsConfirmOpen(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Edit {editingUser.role === "client" ? "Client" : "Coach"}
                </h2>
                <button
                  onClick={() => setEditingUser(null)}
                  className="p-1 text-gray-600 hover:text-gray-800"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <Input
                    value={editingUser.name || ""}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, name: e.target.value })
                    }
                    className="bg-white border-gray-300"
                  />
                </div>

                {editingUser.role === "client" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plan
                    </label>
                    <Select
                      value={editingUser.plan || ""}
                      onValueChange={(value) =>
                        setEditingUser({ ...editingUser, plan: value })
                      }
                    >
                      <SelectTrigger className="bg-white border-gray-300">
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Basic">Basic</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {editingUser.role === "coach" && <div></div>}
                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      handleEdit(editingUser._id, {
                        name: editingUser.name,
                        status: editingUser.status,
                        plan:
                          editingUser.role === "client"
                            ? editingUser.plan
                            : undefined,
                        specialization:
                          editingUser.role === "coach"
                            ? editingUser.specialization
                            : undefined,
                      })
                    }
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => setEditingUser(null)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
