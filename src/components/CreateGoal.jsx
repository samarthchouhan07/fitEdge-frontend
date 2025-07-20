import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Dumbbell,
  Heart,
  Plus,
  Scale,
  Target,
  Timer,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Checkbox } from "./ui/checkbox";

export const CreateGoal = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.id;
  const [selectedGoalType, setSelectedGoalType] = useState("");
  const [gaolData, setGoalData] = useState({
    title: "",
    description: "",
    type: "",
    targetValue: "",
    targetUnit: "",
    currentValue: "",
    deadline: null,
    priority: "medium",
    difficulty: "intermediate",
    isPublic: false,
    reminderFrequency: "daily",
    milestones: [],
    tags: [],
  });
  const [newMilestone, setNewMilestone] = useState("");
  const [newTag, setNewTag] = useState("");
  const [createdGoals, setCreatedGoals] = useState([]);

  const formatDate = (date) => {
    if (!date) return "Select date";
  
    const parsedDate = typeof date === "string" ? new Date(date) : date;
  
    if (isNaN(parsedDate)) return "Invalid date";
  
    return parsedDate.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  

  const handleGoalTypeSelect = (type) => {
    setSelectedGoalType(type);
    setGoalData((prev) => ({ ...prev, type }));
  };

  const addMilestone = () => {
    if (newMilestone.trim()) {
      setGoalData((prev) => ({
        ...prev,
        milestones: [
          ...prev.milestones,
          { id: Date.now(), text: newMilestone.trim(), completed: false },
        ],
      }));
      setNewMilestone("");
    }
  };

  const addTag = () => {
    if (newTag.trim() && !gaolData.tags.includes(newTag.trim())) {
      setGoalData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setGoalData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const removeMilestone = (milestoneId) => {
    setGoalData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((m) => m._id !== milestoneId),
    }));
  };

  const createGoal = async () => {
    try {
      const response = await fetch("https://fitedge-backend.onrender.com/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...gaolData,
          targetValue: Number(gaolData.targetValue),
          currentValue: Number(gaolData.currentValue),
          deadline: gaolData.deadline ? new Date(gaolData.deadline) : null,
          milestones: gaolData.milestones.map((m) => ({
            text: m.text,
            completed: m.completed ?? false,
          })),
          userId,
        }),
      });
      if (!response.ok) {
        toast.error("Failed to create goal");
      }
      const createdGoal = await response.json();
      setCreatedGoals((prev) => [...prev, createdGoal]);

      setGoalData({
        title: "",
        description: "",
        type: "",
        targetValue: "",
        targetUnit: "",
        currentValue: "",
        deadline: null,
        priority: "medium",
        difficulty: "intermediate",
        isPublic: false,
        reminderFrequency: "daily",
        milestones: [],
        tags: [],
      });
      setSelectedGoalType("");
      setCurrentStep(1);
    } catch (error) {
      console.log("error in createGoat:", error);
      toast.error("An Error occurred while creating the goal");
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const getStepIcon = (step) => {
    switch (step) {
      case 1:
        return Target;
      case 2:
        return Trophy;
      case 3:
        return Timer;
      case 4:
        return CheckCircle2;
      default:
        return Target;
    }
  };

  const goalTypes = [
    {
      id: "weight_loss",
      label: "Weight Loss",
      icon: Scale,
      color: "bg-red-100 text-red-700",
    },
    {
      id: "muscle_gain",
      label: "Muscle Gain",
      icon: Dumbbell,
      color: "bg-blue-100 text-blue-700",
    },
    {
      id: "endurance",
      label: "Endurance",
      icon: Heart,
      color: "bg-green-100 text-green-700",
    },
    {
      id: "strength",
      label: "Strength",
      icon: Zap,
      color: "bg-purple-100 text-purple-700",
    },
    {
      id: "flexibility",
      label: "Flexibility",
      icon: Activity,
      color: "bg-orange-100 text-orange-700",
    },
    {
      id: "general_fitness",
      label: "General Fitness",
      icon: TrendingUp,
      color: "bg-teal-100 text-teal-700",
    },
  ];

  const priorityLevels = [
    { value: "low", label: "Low", color: "bg-gray-100 text-gray-700" },
    {
      value: "medium",
      label: "Medium",
      color: "bg-yellow-100 text-yellow-700",
    },
    { value: "high", label: "High", color: "bg-red-100 text-red-700" },
  ];

  const difficultyLevels = [
    {
      value: "beginner",
      label: "Beginner",
      color: "bg-green-100 text-green-700",
    },
    {
      value: "intermediate",
      label: "Intermediate",
      color: "bg-yellow-100 text-yellow-700",
    },
    { value: "advanced", label: "Advanced", color: "bg-red-100 text-red-700" },
  ];

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch("https://fitedge-backend.onrender.com/api/goals");
        if (!response.ok) toast.error("Failed to fetch goals");
        const data = await response.json();
        setCreatedGoals(data);
      } catch (error) {
        console.log("error in fetchGoals:", error);
        toast.error("Error in fetching goals");
      }
    };

    fetchGoals();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 ">
            Set your Fitness Goals
          </h1>
          <p className="text-gray-600 text-lg">
            Define your objectives and track your progress
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className={"shadow-xl border-0 bg-white/80 backdrop-blur-sm"}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className={"text-2xl flex items-center gap-2"}>
                    {React.createElement(getStepIcon(currentStep), {
                      className: "size-7 text-purple-600",
                    })}
                    Create New Goal
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`size-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                          currentStep >= step
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
                <Separator
                  className={"bg-gradient-to-r from-blue-200 to-purple-200"}
                />
              </CardHeader>
              <CardContent className={"space-y-6"}>
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-lg font-semibold mb-4 block">
                        What's your fitness goal?
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {goalTypes.map((type) => (
                          <Card
                            key={type.id}
                            className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                              selectedGoalType === type.id
                                ? "border-purple-500 bg-purple-50"
                                : "border-gray-200 hover:border-purple-300"
                            }`}
                            onClick={() => handleGoalTypeSelect(type.id)}
                          >
                            <CardContent className={"p-4 text-center"}>
                              <div
                                className={`size-12 rounded-full ${type.color} flex items-center justify-center mx-auto mb-2`}
                              >
                                <type.icon className="size-6" />
                              </div>
                              <p className="font-medium text-sm">
                                {type.label}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                    {selectedGoalType && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Goal Title</Label>
                          <Input
                            className={"mt-2"}
                            id="title"
                            placeholder="e.g. Lose 10 pounds in 3 months"
                            value={gaolData.title}
                            onChange={(e) =>
                              setGoalData((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            className={"mt-2"}
                            placeholder="Describe your goal in details..."
                            value={gaolData.description}
                            onChange={(e) =>
                              setGoalData((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            rows={3}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <Label className={"text-lg font-semibold mb-4 block"}>
                        Set your target
                      </Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="targetValue">Target Value</Label>
                          <Input
                            id="targetValue"
                            className={"mt-2"}
                            type={"number"}
                            placeholder="e.g. 150"
                            value={gaolData.targetValue}
                            onChange={(e) =>
                              setGoalData((prev) => ({
                                ...prev,
                                targetValue: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="targetUnit">Unit</Label>
                          <Select
                            className=""
                            value={gaolData.targetUnit}
                            onValueChange={(value) =>
                              setGoalData((prev) => ({
                                ...prev,
                                targetUnit: value,
                              }))
                            }
                          >
                            <SelectTrigger className="mt-2 bg-white text-black">
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent className={"bg-white text-black"}>
                              <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                              <SelectItem value="kg">Kilograms (kg)</SelectItem>
                              <SelectItem value="reps">Repetitions</SelectItem>
                              <SelectItem value="minutes">Minutes</SelectItem>
                              <SelectItem value="miles">Miles</SelectItem>
                              <SelectItem value="km">Kilometers</SelectItem>
                              <SelectItem value="percent">
                                Percentage (%)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="currentValue">Current Value</Label>
                      <Input
                        id="currentValue"
                        className={"mt-2"}
                        type={"number"}
                        placeholder="e.g. 170"
                        value={gaolData.currentValue}
                        onChange={(e) =>
                          setGoalData((prev) => ({
                            ...prev,
                            currentValue: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label className={"mb-2 block"}>Priority Level</Label>
                      <RadioGroup
                        value={gaolData.priority}
                        onValueChange={(value) =>
                          setGoalData((prev) => ({ ...prev, priority: value }))
                        }
                      >
                        <div className="flex flex-col sm:flex-row gap-4">
                          {priorityLevels.map((level) => (
                            <div
                              key={level.value}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                value={level.value}
                                id={level.value}
                              />
                              <Label
                                htmlFor={level.value}
                                className={"cursor-pointer"}
                              >
                                <Badge className={level.color}>
                                  {level.label}
                                </Badge>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                    <div >
                      <Label className={"mb-2 block"}>Difficulty Level</Label>
                      <RadioGroup
                        value={gaolData.difficulty}
                        onValueChange={(value) =>
                          setGoalData((prev) => ({
                            ...prev,
                            difficulty: value,
                          }))
                        }
                      >
                        <div className="flex flex-col gap-4 sm:flex-row ">
                          {difficultyLevels.map((level) => (
                            <div
                              key={level.value}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                value={level.value}
                                id={`diff-${level.value}`}
                              />
                              <Label
                                htmlFor={`diff-${level.value}`}
                                className={"cursor-pointer"}
                              >
                                <Badge className={level.color}>
                                  {level.label}
                                </Badge>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                )}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <Label className={"text-lg font-semibold mb-4 block"}>
                        Timeline & Settings
                      </Label>
                      <div className="space-y-4">
                        <div>
                          <Label className={"mb-2 block"}>Deadline</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={
                                  "w-full justify-start text-left font-normal"
                                }
                              >
                                <CalendarDays className="mr-2 size-4" />
                                {formatDate(gaolData.deadline)}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className={"w-auto p-0 bg-white"}>
                              <Calendar
                                mode="single"
                                selected={gaolData.deadline}
                                onSelect={(date) =>
                                  setGoalData((prev) => ({
                                    ...prev,
                                    deadline: date,
                                  }))
                                }
                                className={
                                  "rounded-lg border-2 border-blue-100 shadow-sm min-w-[280px] max-w-full"
                                }
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <Label htmlFor="reminderFreq" className={"mb-2"}>
                            Reminder Frequency
                          </Label>
                          <Select
                            value={gaolData.reminderFrequency}
                            onValueChange={(value) =>
                              setGoalData((prev) => ({
                                ...prev,
                                reminderFrequency: value,
                              }))
                            }
                            className="bg-white"
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg border-2 bg-white border-blue-100 shadow-sm min-w-[280px] max-w-full">
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="never">Never</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="public"
                            checked={gaolData.isPublic}
                            onCheckedChange={(checked) =>
                              setGoalData((prev) => ({
                                ...prev,
                                isPublic: checked,
                              }))
                            }
                          />
                          <Label htmlFor="public">
                            Make this goal public (visible to other users)
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-lg font-semibold mb-4 block">
                        Milestones & Tags
                      </Label>
                      <div className="space-y-4">
                        <div>
                          <Label className={"mb-2 block"}>Milestones</Label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add a milestones..."
                              value={newMilestone}
                              onChange={(e) => setNewMilestone(e.target.value)}
                              onKeyPress={(e) =>
                                e.key === "Enter" && addMilestone()
                              }
                            />
                            <Button onClick={addMilestone} size={"sm"}>
                              <Plus className="size-4" />
                            </Button>
                          </div>
                          {gaolData.milestones.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {gaolData.milestones.map((milestone) => (
                                <div
                                  key={milestone._id}
                                  className="flex items-center justify-between bg-gray-50 p-2 rounded"
                                >
                                  <span className="text-sm">
                                    {milestone.text}
                                  </span>
                                  <Button
                                    variant={"ghost"}
                                    size={"sm"}
                                    onClick={() =>
                                      removeMilestone(milestone._id)
                                    }
                                  >
                                    X
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div>
                          <Label className={"mb-2 block"}>Tags</Label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add a tag..."
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              onKeyPress={(e) => e.key === "Enter" && addTag()}
                            />
                            <Button onClick={addTag} size={"sm"}>
                              <Plus className="size-4" />
                            </Button>
                          </div>
                          {gaolData.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {gaolData.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant={"secondary"}
                                  className={"cursor-pointer"}
                                  onClick={() => removeTag(tag)}
                                >
                                  {tag} x
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex justify-between pt-6">
                  <Button
                    variant={"outline"}
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  {currentStep < 4 ? (
                    <Button
                      onClick={nextStep}
                      disabled={currentStep === 1 && !selectedGoalType}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      onClick={createGoal}
                      disabled={!gaolData.title || !gaolData.targetValue}
                      className={
                        "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      }
                    >
                      Create Goal
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card className={"shadow-xl border-0 bg-white/80 backdrop-blur-sm"}>
              <CardHeader>
                <CardTitle className={"flex items-center gap-2"}>
                  <Trophy className="size-5 text-yellow-600" />
                  Your Goals ({createdGoals.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {createdGoals.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="size-12 mx-auto mb-2 text-gray-300" />
                    <p>No goals created yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {createdGoals.map((goal) => {
                      const goalTypeData = goalTypes.find(
                        (t) => t.id === goal.type
                      );
                      return (
                        <Card
                          key={goal._id}
                          className={"border border-gray-200"}
                        >
                          <CardContent className={"p-4"}>
                            <div className="flex items-start gap-3">
                              {goalTypeData && (
                                <div
                                  className={`size-8 rounded-full ${goalTypeData.color} flex items-center justify-center flex-shrink-0`}
                                >
                                  <goalTypeData.icon className="size-4" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate">
                                  {goal.title}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1">
                                  {goal.currentValue} → {goal.targetValue}{" "}
                                  {goal.targetUnit}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge
                                    className={
                                      priorityLevels.find(
                                        (p) => p.value === goal.priority
                                      )?.color
                                    }
                                    size="sm"
                                  >
                                    {goal.priority}
                                  </Badge>
                                  {goal.deadline && (
                                    <span className="text-xs text-gray-400">
                                      Due: {formatDate(goal.deadline)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
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
