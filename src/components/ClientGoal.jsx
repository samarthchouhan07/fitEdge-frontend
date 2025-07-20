import {
  Activity,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Circle,
  Dumbbell,
  Eye,
  Heart,
  MoreHorizontal,
  Plus,
  Scale,
  Search,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { useNavigate } from "react-router-dom";

export const ClientGoal = () => {
  const [goals, setGoals] = useState([]);

  const navigate=useNavigate()
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        const res = await fetch(
          `http://localhost:5000/api/goals?userId=${user?.id}`
        );
        if (!res.ok) return toast.error("Failed to fetch goals");

        const data = await res.json();
        setGoals(data);
      } catch (error) {
        console.log("error in fetching goals:", error);
        toast.error("Error fetching the goals");
      }
    };
    fetchGoals();
  }, []);

  const goalTypes = [
    {
      id: "weight-loss",
      label: "Weight Loss",
      icon: Scale,
      color: "bg-red-100 text-red-700 border-red-200",
    },
    {
      id: "muscle-gain",
      label: "Muscle Gain",
      icon: Dumbbell,
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    {
      id: "endurance",
      label: "Endurance",
      icon: Heart,
      color: "bg-green-100 text-green-700 border-green-200",
    },
    {
      id: "strength",
      label: "Strength",
      icon: Zap,
      color: "bg-purple-100 text-purple-700 border-purple-200",
    },
    {
      id: "flexibility",
      label: "Flexibility",
      icon: Activity,
      color: "bg-orange-100 text-orange-700 border-orange-200",
    },
    {
      id: "general-fitness",
      label: "General Fitness",
      icon: TrendingUp,
      color: "bg-teal-100 text-teal-700 border-teal-200",
    },
  ];

  const priorityColors = {
    low: "bg-gray-100 text-gray-700 border-gray-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    high: "bg-red-100 text-red-700 border-red-200",
  };

  const statusColors = {
    weight_loss: "bg-red-100 text-red-700 border-red-200",
    muscle_gain: "bg-blue-100 text-blue-700 border-blue-200",
    endurance: "bg-green-100 text-green-700 border-green-200",
    strength: "bg-purple-100 text-purple-700 border-purple-200",
    flexibility: "bg-orange-100 text-orange-700 border-orange-200",
    general_fitness: "bg-teal-100 text-teal-700 border-teal-200",
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const filteredGoals = goals.filter((goal) => {
    const matchesSearch =
      goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesType = filterType === "all" || goal.type === filterType;
    const matchesStatus =
      filterStatus === "all" || goal.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || goal.priority === filterPriority;
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  const getGoalTypeData = (type) => goalTypes.find((gt) => gt.id === type);

  // const formatDate = (date) => {
  //   return date.toLocaleDateString("en-US", {
  //     month: "short",
  //     day: "numeric",
  //     year: "numeric",
  //   });
  // };

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // const getProgressColor = (progress) => {
  //   if (progress >= 80) return "bg-green-500";
  //   if (progress >= 50) return "bg-yellow-500";
  //   return "bg-red-500";
  // };

  const toggleMilestone = async (goalId, milestoneId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/goals/${goalId}/milestones/${milestoneId}/toggle`,
        { method: "PATCH" }
      );

      if (!res.ok) throw new Error("Failed to toggle milestone");

      const data = await res.json();

      setGoals((prev) =>
        prev.map((goal) => {
          if (goal._id === goalId) {
            const updatedMilestones = goal.milestones.map((m) =>
              m._id === milestoneId
                ? { ...m, completed: data.milestone.completed }
                : m
            );
            const completedCount = updatedMilestones.filter(
              (m) => m.completed
            ).length;
            const totalCount = updatedMilestones.length;
            const updatedProgress =
              totalCount === 0
                ? 0
                : Math.round((completedCount / totalCount) * 100);

            return {
              ...goal,
              milestones: updatedMilestones,
              progress: updatedProgress,
            };
          }
          return goal;
        })
      );
    } catch (err) {
      console.error("Toggle failed:", err);
      toast.error("Failed to update milestone");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Your Fitness Goals
          </h1>
          <p className="text-gray-600 text-lg">
            Track your progress and achieve your dreams
          </p>
        </div>
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 items-center flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search goals, tags, or descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex gap-2">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent className={"bg-white"}>
                      <SelectItem value="all">All Types</SelectItem>
                      {goalTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className={"bg-white"}>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={filterPriority}
                    onValueChange={setFilterPriority}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Priority" />
                    </SelectTrigger>
                    <SelectContent className={"bg-white"}>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {filteredGoals.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No goals found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600" onClick={()=>navigate("/create-goal")}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div
            className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}
          >
            {filteredGoals.map((goal) => {
              console.log("gaol:", goal);
              const goalTypeData = getGoalTypeData(goal.type);
              const daysUntilDeadline = getDaysUntilDeadline(goal.deadline);
              const completedMilestones = goal.milestones.filter(
                (m) => m.completed
              ).length;

              return (
                <Card
                  key={goal._id}
                  className={`bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <CardHeader className={`pb-4`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {goalTypeData && (
                          <div
                            className={`p-2 rounded-full ${goalTypeData.color}`}
                          >
                            <goalTypeData.icon className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-800">
                            {goal.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={statusColors[goal.type]}>
                              {goal.type}
                            </Badge>
                            <Badge className={priorityColors[goal.priority]}>
                              {goal.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className={`pt-0`}>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {goal.description}
                      </p>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">
                            Progress
                          </span>
                          <span className="text-sm font-semibold text-gray-800">
                            {goal.progress}%
                          </span>
                        </div>
                        <Progress value={goal.progress} className="h-2 " />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>
                            Current: {goal.currentValue} {goal.targetUnit}
                          </span>
                          <span>
                            Target: {goal.targetValue} {goal.targetUnit}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">
                            Milestones
                          </span>
                          <span className="text-xs text-gray-500">
                            {completedMilestones}/{goal.milestones.length}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {goal.milestones.slice(0, 3).map((milestone) => (
                            <div
                              key={milestone._id}
                              className="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-50 p-1 rounded"
                              onClick={() =>
                                toggleMilestone(goal._id, milestone._id)
                              }
                            >
                              {milestone.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              ) : (
                                <Circle className="w-4 h-4 text-gray-400" />
                              )}
                              <span
                                className={
                                  milestone.completed
                                    ? "line-through text-gray-400"
                                    : "text-gray-600"
                                }
                              >
                                {milestone.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {daysUntilDeadline > 0
                              ? `${daysUntilDeadline} days left`
                              : "Overdue"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {goal.isPublic && (
                            <Eye className="w-4 h-4 text-gray-400" />
                          )}
                          {daysUntilDeadline < 7 && daysUntilDeadline > 0 && (
                            <AlertCircle className="w-4 h-4 text-orange-500" />
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {goal.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
