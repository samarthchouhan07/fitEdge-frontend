import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Calendar } from "./ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  CalendarDays,
  Clock,
  Dumbbell,
  Target,
  User,
  Utensils,
} from "lucide-react";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

export const ClientCalendar = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const clientId = user?.id;

  const [plans, setPlans] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPlans, setSelectedPlans] = useState([]);

  useEffect(() => {
    if (!clientId) {
      toast.error("No clientId found");
      return;
    }

    axios
      .get(`https://fitedge-backend.onrender.com/api/client/plans/${clientId}`)
      .then((res) => {
        console.log("Raw plans from API:", res.data);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const filtered = res.data.filter((p) => {
          const created = new Date(p.createdAt);
          created.setHours(0, 0, 0, 0);
          return !p.completed && created >= today;
        });

        console.log("Filtered upcoming workout plans:", filtered);
        setPlans(filtered);
      })
      .catch((err) => console.log("Error fetching plans:", err));
  }, [clientId]);

  useEffect(() => {
    if (!selectedDate) return;

    const matches = plans.filter((p) => {
      if (!p.createdAt) return false;
      const created = new Date(p.createdAt);
      if (isNaN(created)) return false;
      return created.toLocaleDateString() === selectedDate.toLocaleDateString();
    });

    setSelectedPlans(matches);
  }, [selectedDate, plans]);
  // console.log("plans:",plans)
  // console.log("selected:",selectedDate)

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Your Fitness Journey
          </h1>
          <p className="text-gray-600 text-lg">
            Track your workouts and nutrition plans
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className={"shadow-xl border-0 bg-white/80 backdrop-blur-sm"}>
              <CardHeader className={"text-center"}>
                <CardTitle
                  className={"flex items-center justify-center gap-2 text-xl"}
                >
                  <CalendarDays className="size-6 text-blue-600" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent className={"flex justify-center"}>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) setSelectedDate(date);
                   }}
                  className={"rounded-lg border-2 border-blue-100 shadow-sm min-w-[280px] max-w-full"}
                />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Card className={"shadow-xl border-0 bg-white/80 backdrop-blur-sm"}>
              <CardHeader>
                <CardTitle className={"flex items-center gap-2 text-2xl"}>
                  <Target className="size-7 text-purple-600" />
                  Plans for{" "}
                  {selectedDate
                    ? format(selectedDate, "PPP")
                    : "No date selected"}
                </CardTitle>
                <Separator className="bg-gradient-to-r from-blue-200 to-purple-200" />
              </CardHeader>
              <CardContent>
                {selectedPlans.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CalendarDays className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">
                      No plans scheduled for this date
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      Choose another date to see your plans
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {selectedPlans.map((plan) => (
                      <Card
                        key={plan._id}
                        className="border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg"
                      >
                        <CardHeader className={"pb-4"}>
                          <div className="flex items-start justify-between">
                            <CardTitle
                              className={"flex items-center gap-3 text-xl"}
                            >
                              {plan.type === "diet" ? (
                                <div className="p-2 bg-green-100 rounded-full">
                                  <Utensils className="size-6 text-green-600" />
                                </div>
                              ) : (
                                <div className="p-2 bg-blue-100 rounded-full">
                                  <Dumbbell className="size-6 text-blue-600" />
                                </div>
                              )}
                              <div>
                                <div className="font-semibold text-gray-800">
                                  {plan.title}
                                </div>
                                <div className="text-sm text-gray-500 font-normal mt-1">
                                  {plan.description}
                                </div>
                              </div>
                            </CardTitle>
                            <Badge
                              className={getDifficultyColor(plan.difficulty)}
                            >
                              {plan.difficulty}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className={"pt-0"}>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <User className="size-4 text-gray-500" />
                              <span className="text-gray-600">Coach :</span>
                              <span className="font-medium">
                                {plan.coach?.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="size-4 text-gray-500" />
                              <span className="text-gray-600">Duration:</span>
                              <span className="font-medium">
                                {plan.duration}
                              </span>
                            </div>
                            {plan.type === "workout" && (
                              <div className="flex items-center gap-2 text-sm">
                                <Target className="size-4 text-gray-500" />
                                <span className="text-gray-600">
                                  Exercises:
                                </span>
                                <span className="font-medium">
                                  {plan.exercises?.length || 0}
                                </span>
                              </div>
                            )}
                          </div>
                          {plan.type === "diet" && plan.diet && (
                            <div className="space-y-3">
                              <Separator />
                              <h4 className="font-semibold text-gray-800 mb-3">
                                Meal Plan
                              </h4>
                              <div className="grid gap-3">
                                {plan.diet.map((meal, idx) => (
                                  <Card
                                    key={idx}
                                    className="border border-gray-200 bg-gradient-to-r from-green-50 to-blue-50"
                                  >
                                    <CardContent className="p-4">
                                      <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                          <span className="font-semibold text-gray-800">
                                            {meal.meal}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm">
                                          <span className="text-orange-600 font-medium">
                                            {meal.calories}
                                          </span>
                                          <span className="text-gray-500">
                                            cal
                                          </span>
                                        </div>
                                      </div>
                                      <p className="text-sm text-gray-600 mb-2">
                                        {meal.notes}
                                      </p>
                                      <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Clock className="w-3 h-3" />
                                        <span>
                                          {meal.time || "Time not specified"}
                                        </span>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          )}
                          {plan.type === "workout" && plan.exercises && (
                            <div className="space-y-3">
                              <Separator />
                              <h4 className="font-semibold text-gray-800 mb-3">
                                Exercises
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {plan.exercises.map((exercise, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="secondary"
                                    className="bg-blue-50 text-blue-700 border-blue-200"
                                  >
                                    {exercise}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
