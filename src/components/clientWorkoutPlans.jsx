import axios from "axios";
import {
  ChevronRight,
  Clock,
  Dumbbell,
  Play,
  Star,
  Target,
  Trophy,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Progress } from "./ui/progress";

export const ClientWorkoutPlans = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const clientId = user?.id;

  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const totalPlans = plans.length;
  const completedPlans = plans.filter((p) => p.completed).length;
  const completionRate =
    totalPlans > 0 ? (completedPlans / totalPlans) * 100 : 0;
  console.log("completionRate:", completionRate);

  useEffect(() => {
    if (!clientId) return;
    axios
      .get(`http://localhost:5000/api/client/plans/${clientId}`)
      .then((res) => {
        const allPlans = res.data;
        setPlans(allPlans);
        setWorkoutPlans(allPlans.filter((p) => p.type === "workout"));
      })
      .catch((err) => console.log("Failed to fetch plans:", err));
  }, [clientId]);

  console.log("plans:", plans);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800 border-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return <Star className="w-4 h-4" />;
      case "intermediate":
        return <Target className="size-4" />;
      case "advanced":
        return <Trophy className="size-4" />;
      default:
        return <Target className="size-4" />;
    }
  };

  const handleMarkAsDone = async (planId) => {
    try {
      await axios.post(`http://localhost:5000/api/client/plans/done/${planId}`);
      toast.success("Plan marked as done!");
      setPlans((prev) =>
        prev.map((plan) =>
          plan._id === planId ? { ...plan, completed: true } : plan
        )
      );
      setSelectedPlan(null);
    } catch (error) {
      console.log("Error in handleMarkAsDone:", error);
      toast.error("Failed to mark plan as done");
    }
  }; 

  console.log("completionRate", completedPlans, completionRate, totalPlans);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Your Fitness plans
          </h1>
          <p>
            Personalized workout programs designed by certified trainers to help
            you achieve your fitness goals
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {workoutPlans.map((plan) => (
            <div
              key={plan._id}
              className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2 cursor-pointer"
              onClick={() => setSelectedPlan(plan)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative p-8 pb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors ">
                        {plan.title}
                      </h3>
                      {plan.completed && (
                        <span className="text-sm font-semibold text-green-600 ml-2 mt-2">
                          ✅ Completed
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {plan.description}
                    </p>
                  </div>
                  <div className="ml-4 p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg">
                    <Dumbbell className="size-6 text-white" />
                  </div>
                </div>
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${getDifficultyColor(
                    plan.difficulty
                  )} mb-6`}
                >
                  {getDifficultyIcon(plan.difficulty)}
                  {plan.difficulty}
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Clock className="size-5 text-blue-500" />
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="font-semibold text-gray-800">
                        {plan.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Target className="size-5 text-green-500" />
                    <div>
                      <p className="text-xs text-gray-500">Exercises</p>
                      <p className="font-semibold text-gray-800">
                        {plan.exercises.length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex truncate items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100">
                  <div className="hidden sm:flex size-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full items-center justify-center">
                    <User className="size-4 sm:size-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">
                      {plan.coach.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      Personal Trainer&apos;s email
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <Button
                    className={
                      "flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    }
                  >
                    <Play className="size-4" />
                    Start Workout
                  </Button>
                  <Button
                    className={
                      "p-3 text-gray-400 hover:text-gray-600 transition-colors "
                    }
                  >
                    <ChevronRight className="size-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {selectedPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors ">
                      {selectedPlan.title}
                    </h3>
                    {selectedPlan.completed && (
                      <span className="text-sm font-semibold text-green-600 ml-2 mt-2">
                        ✅ Completed
                      </span>
                    )}
                  </div>
                  <Button
                    onClick={() => setSelectedPlan(null)}
                    className={
                      "p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    }
                  >
                    X
                  </Button>
                </div>
                <p className="text-gray-400 mb-6">{selectedPlan.description}</p>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Exercises
                  </h3>
                  {selectedPlan.exercises.map((exercise, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">
                          Exercise Name:{" "}
                          <span className="font-semibold text-gray-600">
                            {exercise.name}
                          </span>
                        </h4>

                        {/* <span className="text-sm text-purple-600 font-medium">
                          {exercise.category}
                          </span> */}
                      </div>

                      <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Sets: </span>
                          {exercise.sets}
                        </div>
                        <div>
                          <span className="font-medium">Reps:</span>{" "}
                          {exercise.reps}
                        </div>
                        <div>
                          <span className="font-medium">Weight:</span>{" "}
                          {exercise.weight}
                        </div>
                        <div>
                          <span className="font-medium">Rest:</span>{" "}
                          {exercise.rest}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex gap-4">
                  <Button
                    className={
                      "flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg"
                    }
                    onClick={() => handleMarkAsDone(selectedPlan._id)}
                  >
                    Mark as done
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
