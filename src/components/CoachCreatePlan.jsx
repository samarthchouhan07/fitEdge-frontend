import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CoachCreatePlan = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  console.log("user:", user);
  const coachId = user?.id;

  console.log("coachId:", coachId);
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [activeTab, setActiveTab] = useState("workout");
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem("token");

  const [plan, setPlan] = useState({
    title: "",
    description: "",
    duration: "",
    difficulty: "Beginner",
    exercises: [
      { name: "", sets: 3, reps: "10", weight: "", rest: "60s", notes: "" },
    ],
    diet: [{ meal: "", time: "", calories: "", notes: "" }],
  });

  useEffect(() => {
    if (!coachId || !token || !user?.role === "coach") {
      console.error("Coach ID is undefined. Cannot fetch clients.");
      navigate("/login");
      toast.error("No coach found. Please check your login.");
      setIsLoading(false);
      return;
    }
    const fetchClients = async () => {
      try {
        axios
          .get(`https://fitedge-backend.onrender.com/api/coach/clients/${coachId}`)
          .then((res) => {
            setClients(res.data);
          })
          .catch((err) => {
            console.error("Error fetching clients:", err);
          });
      } catch (error) {
        console.log("error in fetchClients", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClients();
  }, [coachId, token, user?.role, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!selectedClient) newErrors.client = "Please select a client";
    if (!plan.title.trim()) newErrors.title = "Plan title is required";
    if (!plan.description.trim())
      newErrors.description = "Description is required";
    if (!plan.duration.trim()) newErrors.duration = "Duration is required";
    if (
      activeTab === "workout" &&
      plan.exercises.some((ex) => !ex.name.trim())
    ) {
      newErrors.exercises = "All exercises must have a name";
    }
    if (activeTab === "diet" && plan.diet.some((item) => !item.meal.trim())) {
      newErrors.diet = "All meals must have a name";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateExercise = (index, field, value) => {
    setPlan((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) =>
        i === index ? { ...ex, [field]: value } : ex
      ),
    }));
  };

  const addExercise = () => {
    setPlan((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        { name: "", sets: 3, reps: "10", rest: "60s", notes: "" },
      ],
    }));
  };

  const removeExercise = (index) => {
    setPlan((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }));
  };

  const updateDiet = (index, field, value) => {
    setPlan((prev) => {
      const newDiet = [...prev.diet];
      newDiet[index][field] = value;
      return { ...prev, diet: newDiet };
    });
  };

  const addDiet = () => {
    setPlan((prev) => ({
      ...prev,
      diet: [...prev.diet, { meal: "", time: "", calories: "", notes: "" }],
    }));
  };

  const removeDiet = (index) => {
    setPlan((prev) => ({
      ...prev,
      diet: prev.diet.filter((_, i) => i !== index),
    }));
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }
    setIsConfirmOpen(true);
  };

  const confirmCreate = async () => {
    setIsLoading(true);
    try {
      await axios.post(
        "https://fitedge-backend.onrender.com/api/coach/create-plan",
        { coachId, clientId: selectedClient, type: activeTab, ...plan },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Plan created successfully");
      setIsConfirmOpen(false);
      navigate("/coach/dashboard");
    } catch (error) {
      console.log("Error in handling plan creation:", error);
      toast.error("Failed to create plan");
    } finally {
      setIsLoading(false);
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

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Button
              variant={"ghost"}
              onClick={() => navigate("/coach/dashboard")}
              className={"text-gray-600 hover:text-blue-600"}
            >
              <ArrowLeft className="size-5 mr-2" />
              Back to dashboard
            </Button>
          </div>
          <h1 className="sm:text-2xl font-bold text-gray-900">
            Create {activeTab === "workout" ? "Workout" : "Diet"} Plan
          </h1>
        </div>
      </div>
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <div className="flex gap-4">
            <Button
              variant={activeTab === "workout" ? "default" : "outline"}
              onClick={() => setActiveTab("workout")}
              className={
                activeTab === "workout"
                  ? "bg-blue-600 text-white hover:bg-gray-700"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
              }
            >
              Workout
            </Button>
            <Button
              variant={activeTab === "diet" ? "default" : "outline"}
              onClick={() => setActiveTab("diet")}
              className={
                activeTab === "diet"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
              }
            >
              Diet
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className={"text-gray-900"}>Assign to Client</Label>
            <Select onValueChange={setSelectedClient} value={selectedClient}>
              <SelectTrigger className="mt-2 bg-white border-gray-300">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent className="bg-white text-gray-900">
                {clients.map((c) => (
                  <SelectItem key={c._id} value={c._id}>
                    {c.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.client && (
              <p className="text-red-500 text-sm mt-1">{errors.client}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className={"text-gray-900"}>Plan Title</Label>
              <Input
                placeholder="e.g. Strength Training Plan"
                value={plan.title}
                onChange={(e) => setPlan({ ...plan, title: e.target.value })}
                className="mt-1 bg-white border-gray-300"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>
            <div>
              <Label className={"text-gray-900"}>Duration</Label>
              <Input
                value={plan.duration}
                onChange={(e) => setPlan({ ...plan, duration: e.target.value })}
                className="mt-1 bg-white border-gray-300"
                placeholder="e.g. 4 weeks"
              />
              {errors.duration && (
                <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
              )}
            </div>
          </div>
          <div>
            <Label className={"text-gray-900"}>Description</Label>
            <Textarea
              placeholder="Describe the plan gaols and details"
              value={plan.description}
              onChange={(e) =>
                setPlan({ ...plan, description: e.target.value })
              }
              className="mt-1 bg-white border-gray-300"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
          <div>
            <Label className={"text-gray-900"}>Difficulty</Label>
            <Select
              value={plan.difficulty}
              onChange={(e) => setPlan({ ...plan, difficulty: e.target.value })}
            >
              <SelectTrigger className={"mt-1 bg-white border-gray-300"}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={"bg-white text-gray-900"}>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>{" "}
              </SelectContent>
            </Select>
          </div>
          {activeTab === "workout" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-lg text-gray-900">Exercises</Label>
                <Button
                  size="sm"
                  onClick={addExercise}
                  className={"bg-blue-600 text-white hover:bg-blue-700"}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
              {plan.exercises.map((exercise, i) => (
                <Card key={i} className="bg-gray-50 border-gray-200 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className={"text-gray-900"}>Exercise</Label>
                      <Input
                        placeholder="e.g. Bench Press"
                        value={exercise.name}
                        onChange={(e) =>
                          updateExercise(i, "name", e.target.value)
                        }
                        className={"bg-white border-gray-300 mt-2"}
                      />
                    </div>
                    <div>
                      <Label className={"text-gray-900"}>Sets</Label>
                      <Input
                        placeholder="Sets"
                        type={"number"}
                        value={exercise.sets}
                        onChange={(e) =>
                          updateExercise(i, "sets", parseInt(e.target.value))
                        }
                        className={"bg-white border-gray-300 mt-2"}
                      />
                    </div>
                    <div>
                      <Label className={"text-gray-900"}>Reps</Label>
                      <Input
                        placeholder="Reps"
                        value={exercise.reps}
                        onChange={(e) =>
                          updateExercise(i, "reps", e.target.value)
                        }
                        className={"bg-white border-gray-300 mt-2"}
                      />
                    </div>
                    <div>
                      <Label className={"text-gray-900"}>Weight</Label>
                      <Input
                        placeholder={"e.g. 135 lbs"}
                        value={exercise.weight || ""}
                        onChange={(e) =>
                          updateExercise(i, "weight", e.target.value)
                        }
                        className={"bg-white border-gray-300 mt-2"}
                      />
                    </div>
                    <div>
                      <Label className={"text-gray-900"}>Rest</Label>
                      <Input
                        placeholder="e.g. 60s"
                        value={exercise.rest || ""}
                        onChange={(e) =>
                          updateExercise(i, "rest", e.target.value)
                        }
                        className={"bg-white border-gray-300"}
                      />
                    </div>
                    <div>
                      <Label className="text-gray-900">Notes</Label>
                      <Input
                        placeholder="e.g. Focus on form"
                        value={exercise.notes || ""}
                        onChange={(e) =>
                          updateExercise(i, "notes", e.target.value)
                        }
                        className="bg-white border-gray-300"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeExercise(i)}
                      className="bg-red-600 hover:bg-red-700 text-white mt-6"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  {errors.exercises && i === 0 && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.exercises}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          )}
          {activeTab === "diet" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className={"text-lg text-gray-900"}>Meals</Label>
                <Button
                  size={"sm"}
                  onClick={addDiet}
                  className={"bg-blue-600 text-white hover:bg-blue-700"}
                >
                  <Plus className="size-4 mr-1" /> Add Meal
                </Button>
              </div>
              {plan.diet.map((item, i) => (
                <Card key={i} className="bg-gray-50 border-gray-200 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className={"text-gray-900"}>Meal</Label>
                      <Input
                        placeholder="e.g. Breakfast"
                        value={item.meal}
                        onChange={(e) => updateDiet(i, "meal", e.target.value)}
                        className={"bg-white border-gray-300 mt-2"}
                      />
                    </div>
                    <div>
                      <Label className="text-gray-900">Calories</Label>
                      <Input
                        placeholder="e.g. 500 kcal"
                        value={item.calories}
                        onChange={(e) =>
                          updateDiet(i, "calories", e.target.value)
                        }
                        className="bg-white border-gray-300 mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-900">Time</Label>
                      <Input
                        placeholder="e.g. 8:00 AM"
                        value={item.time}
                        onChange={(e) => updateDiet(i, "time", e.target.value)}
                        className="bg-white border-gray-300 mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-900">Notes</Label>
                      <Input
                        placeholder="e.g. High protein"
                        value={item.notes}
                        onChange={(e) => updateDiet(i, "notes", e.target.value)}
                        className="bg-white border-gray-300 mt-2"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      className={"bg-red-600 hover:bg-red-700 text-white mt-6"}
                      size="icon"
                      onClick={() => removeDiet(i)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  {errors.diet && i === 0 && (
                    <p className="text-red-500 text-sm mt-2">{errors.diet}</p>
                  )}
                </Card>
              ))}
            </div>
          )}
          <Button
            onClick={handleCreate}
            className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Plan"}
          </Button>
        </CardContent>
      </Card>
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Confirm Plan Creation
              </h2>
              <Button
                onClick={() => setIsConfirmOpen(false)}
                className={"p-1 text-gray-600 hover:text-gray-800"}
              >
                <X size={20} />
              </Button>
            </div>
            <p>
              Create {activeTab} plan{" "}
              <span className="font-medium">{plan.title || "Untitled"} </span>
              for{" "}
              <span className="font-medium">
                {clients.find((c) => c._id === selectedClient)?.name ||
                  clients.find((c) => c._id === selectedClient)?.email ||
                  "Selected Client"}
              </span>
              ?
            </p>
            <div className="flex gap-2 mt-6">
              <Button
                onClick={() => setIsConfirmOpen(false)}
                className={"flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800"}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmCreate}
                className={"flex-1 bg-blue-600 hover:bg-blue-700 text-white"}
                disabled={isLoading}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
