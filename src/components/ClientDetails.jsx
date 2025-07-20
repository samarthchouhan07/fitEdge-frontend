import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Apple,
  ArrowLeft,
  CheckCircle,
  Clock,
  Dumbbell,
  Eye,
  MessageSquare,
  User,
} from "lucide-react";

export const ClientDetails = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const token = localStorage.getItem("token");
  const coachId = user?.id;

  const [client, setClient] = useState(null);
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!coachId || !token || user?.role !== "coach") {
      toast.error("Please login as a coach to access this page");
      navigate("/login");
      setIsLoading(false);
      return;
    }

    const fetchClientDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/coach/dashboard/${coachId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const clientData = response.data.clients.find(
          (c) => c._id === clientId
        );
        if (!clientData) {
          throw new Error("Client not found");
        }
        setClient(clientData);
        setPlans(
          response.data.plans.filter((p) => p.client.toString() === clientId)
        );
        console.log("Fetched client:", clientData);
        console.log("Fetched plans:", response.data.plans);
      } catch (err) {
        console.error(
          "Error fetching client details:",
          err.response?.data || err.message
        );
        toast.error(
          err.response?.data?.error || "Failed to load client details"
        );
        navigate("/coach/dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    fetchClientDetails();
  }, [coachId, clientId, token, user?.role, navigate]);

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

  if (!client) {
    return null;
  }

  console.log("client:", client);
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/coach/dashboard")}
            className="text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Client Details</h1>
        </div>
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className={"truncate"}>
            <CardTitle className="flex items-center gap-3">
              <div className="size-12 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="size-6 text-white" />
              </div>
              <div className="">
                <h2 className="text-xl font-semibold text-gray-900 truncate">
                  {client.name || client.email}
                </h2>
                <p className="text-sm text-gray-600 truncate">{client.email}</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p
                  className={`text-sm font-medium ${
                    client.status === "active"
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {client.status
                    ? client.status.charAt(0).toUpperCase() +
                      client.status.slice(1)
                    : "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${client.progress || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {client.progress || 0}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Plans</p>
                <p className="text-sm font-medium text-gray-900">
                  {client.activePlans || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed Workouts</p>
                <p className="text-sm font-medium text-gray-900">
                  {client.completedWorkouts || 0}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={() => navigate("/coach/create-plan")}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Create Plan for Client
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/chat")}
                className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 border-gray-300"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Client Plans
          </h2>
          {plans.length === 0 ? (
            <p className="text-gray-600">No plans assigned to this client.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {plans.map((plan) => (
                <Card
                  key={plan._id}
                  className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
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
                      <Button
                        variant="outline"
                        onClick={() =>
                          navigate(`/coach/dashboard/plan/${plan._id}`)
                        }
                        className="p-2 text-gray-600 hover:text-blue-600 border-gray-300"
                      >
                        <Eye className="size-4" />
                      </Button>
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
                                • {meal.meal} - {meal.calories} cal ({meal.time}
                                )
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
                          Created:{" "}
                          {new Date(plan.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
