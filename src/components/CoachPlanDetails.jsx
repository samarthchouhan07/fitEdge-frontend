import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Calendar,
  CheckCircle,
  ChevronLeft,
  Clock,
  Target,
  User,
  XCircle,
} from "lucide-react";
import { Badge } from "./ui/badge";

export const CoachPlanDetails = () => {
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);
  const navigate = useNavigate();

  console.log("plan:", plan);

  useEffect(() => {
    axios
      .get(`https://fitedge-backend.onrender.com/api/coach/plan/${planId}`)
      .then((res) => setPlan(res.data))
      .catch((e) => console.log("Failed to fetch plan:", e));
  }, [planId]);

  if (!plan) return <div>Loading...</div>;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/coach/dashboard")}
              className={"p-2 hover:bg-gray-100 rounded-full transition-colors"}
            >
              <ChevronLeft className="size-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{plan.title}</h1>
              <p>Create on {formatDate(plan.createdAt)}</p>
            </div>
            <div className="flex items-center gap-2">
              {plan.completed ? (
                <CheckCircle className="size-5 text-green-500" />
              ) : (
                <XCircle className="size-5 text-gray-400" />
              )}
              <span
                className={`text-sm font-medium ${
                  plan.completed ? "text-green-600" : "text-gray-500"
                }`}
              >
                {plan.completed ? "Completed" : "In Progress"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Plan Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Target className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium capitalize">{plan.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <Clock className="size-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-medium">{plan.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <User className="size-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Difficulty</p>
                <Badge
                  className={`inline-block px-2 py-1 text-xs font-medium ${getDifficultyColor(
                    plan.difficulty
                  )}`}
                >
                  {plan.difficulty}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">CreatedAt </p>
                <p className="font-medium">{formatDate(plan.createdAt)}</p>
              </div>
            </div>
          </div>
          {plan.description && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{plan.description}</p>
            </div>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Exercises ({plan.exercises.length})
            </h2>
          </div>
          <div className="space-y-4">
            {plan.exercises.map((exercise, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 transition-all duration-200  bg-white border-gray-200 hover:border-gray-300`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-semibold text-gray-900">
                        {exercise.name}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-3">
                      {exercise.sets && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <span className="font-medium">Sets:</span>
                          <span>{exercise.sets}</span>
                        </div>
                      )}
                      {exercise.reps && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <span className="font-medium">Reps:</span>
                          <span>{exercise.reps}</span>
                        </div>
                      )}
                      {exercise.rest && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <span className="font-medium">Rest:</span>
                          <span>{exercise.rest}</span>
                        </div>
                      )}
                      {exercise.weight && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <span className="font-medium">Weight:</span>
                          <span>{exercise.weight}</span>
                        </div>
                      )}
                      {exercise.notes && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                        <span className="font-medium">Notes:</span>
                        <span>{exercise.notes}</span>
                      </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};