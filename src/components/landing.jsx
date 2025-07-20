import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Play,
  Star,
  Users,
  Target,
  Calendar,
  MessageCircle,
  Trophy,
  Menu,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const features = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Expert Coaches",
      description:
        "Connect with certified fitness professionals who create personalized workout plans just for you.",
    },
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "Goal Tracking",
      description:
        "Set ambitious fitness goals and track your progress with our comprehensive monitoring system.",
    },
    {
      icon: <Calendar className="w-8 h-8 text-blue-600" />,
      title: "Smart Scheduling",
      description:
        "Organize your workouts with intelligent calendar integration and automated reminders.",
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-blue-600" />,
      title: "Real-time Chat",
      description:
        "Stay connected with your coach and community through our integrated messaging platform.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Client",
      avatar: "SJ",
      rating: 5,
      text: "This platform transformed my fitness journey. The personalized coaching and progress tracking kept me motivated every step of the way.",
    },
    {
      name: "Mike Chen",
      role: "Fitness Coach",
      avatar: "MC",
      rating: 5,
      text: "As a coach, this platform helps me manage all my clients efficiently. The plan creation tools are intuitive and powerful.",
    },
    {
      name: "Emily Rodriguez",
      role: "Client",
      avatar: "ER",
      rating: 5,
      text: "The goal tracking feature is amazing! I've achieved fitness milestones I never thought possible.",
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "500+", label: "Certified Coaches" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "Support" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const [statsResponse, testimonialsResponse] = await Promise.all([
  //         axios.get("https://fitedge-backend.onrender.com/api/public/stats"),
  //         axios.get("https://fitedge-backend.onrender.com/api/public/testimonials"),
  //       ]);
  //       setStats(statsResponse.data.stats);
  //       console.log("Fetched stats:", statsResponse.data);
  //       console.log("Fetched testimonials:", testimonialsResponse.data);
  //     } catch (error) {
  //       console.error(
  //         "Error fetching data:",
  //         error.response?.data || error.message
  //       );
  //       toast.error("Error loading page data");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, []);

  // const handleNewsletterSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
  //     toast.error("Please enter a valid email address");
  //     return;
  //   }
  //   try {
  //     await axios.post("https://fitedge-backend.onrender.com/api/public/newsletter", {
  //       email,
  //     });
  //     toast.success("Subscribed to newsletter successfully!");
  //     setEmail("");
  //   } catch (error) {
  //     console.error(
  //       "Newsletter subscription failed:",
  //       error.response?.data || error.message
  //     );
  //     toast.error(error.response?.data?.error || "Failed to subscribe");
  //   }
  // };

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "coach") return "/coach/dashboard";
    return "/client/dashboard";
  };

  // if (isLoading) {
  //   return (
  //     <div className="text-center py-8 bg-gray-50">
  //       <div className="animate-spin mx-auto text-blue-600" size={32}>
  //         <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
  //           <circle
  //             className="opacity-25"
  //             cx="12"
  //             cy="12"
  //             r="10"
  //             stroke="currentColor"
  //             strokeWidth="4"
  //           ></circle>
  //           <path
  //             className="opacity-75"
  //             fill="currentColor"
  //             d="M4 12a8 8 0 018-8v8z"
  //           ></path>
  //         </svg>
  //       </div>
  //       <p className="mt-2 text-gray-600">Loading...</p>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrollY > 20
            ? "bg-white/40 backdrop-blur-sm shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-blue-600">FitEdge</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="chat"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Chat
              </a>
              <a
                href="settings"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Settings
              </a>
              {user.role === "coach" && (
                <a
                  href="coach/create-plan"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Create-Plan
                </a>
              )}
              {user.role === "user" && (
                <a
                  href="client/plans/workout"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Plans
                </a>
              )}
              <Link
                to={getDashboardPath()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
              >
                {user ? "Dashboard" : "Get Started"}
              </Link>
              
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-md border-t border-gray-200">
            <div className="px-4 py-4 space-y-4">
              <a
                href="chat"
                className="block text-gray-600 hover:text-blue-600 transition-colors"
              >
                Chat
              </a>
              <a
                href="settings"
                className="block text-gray-600 hover:text-blue-600 transition-colors"
              >
                Settings
              </a>
              {user?.role === "coach" && (
                <a
                  href="coach/create-plan"
                  className="block text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Create-Plan
                </a>
              )}
              {user?.role === "user" && (
                <a
                  href="client/plans/workout"
                  className="block text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Plans
                </a>
              )}
              <Link
                to={getDashboardPath()}
                className="block bg-blue-600 text-white px-6 py-2 rounded-lg text-center hover:bg-blue-700 transition-all duration-300"
              >
                {user ? "Dashboard" : "Get Started"}
              </Link>
            </div>
          </div>
        )}
      </nav>
      <section className="relative pt-20 pb-16 min-h-screen flex items-center bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full">
                  <Star className="w-5 h-5 text-yellow-600 fill-yellow-500" />
                  <span className="text-sm font-medium text-blue-600">
                    Rated #1 Fitness Platform
                  </span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-gray-900">
                  Transform Your
                  <span className="block text-blue-600">Fitness Journey</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl">
                  Connect with expert coaches, track your goals, and achieve the
                  results you&apos;ve always wanted with our comprehensive
                  fitness platform.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  className="bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2"
                >
                  <Link to={getDashboardPath()}>
                    <span>
                      {user ? "Go to Dashboard" : "Start Your Journey"}
                    </span>
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-gray-300 text-gray-600 hover:bg-gray-100 transition-all duration-300 flex items-center space-x-2"
                >
                  <Link to="/demo">
                    <Play className="w-5 h-5" />
                    <span>Watch Demo</span>
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-blue-600">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <Card className="bg-white border-gray-200 shadow-md">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Personal Coaching
                      </h3>
                      <p className="text-sm text-gray-600">
                        1-on-1 expert guidance
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Target className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Goal Achievement
                      </h3>
                      <p className="text-sm text-gray-600">
                        Track & celebrate progress
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Smart Scheduling
                      </h3>
                      <p className="text-sm text-gray-600">
                        Automated workout plans
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Everything You Need to
              <span className="block text-blue-600">Succeed</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools and support you
              need to achieve your fitness goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              What Our Users
              <span className="block text-blue-600">Are Saying</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied users who have transformed their
              fitness journey with our platform.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.length > 0 ? (
              testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="bg-white border-gray-200 shadow-sm"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-yellow-500 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6">"{testimonial.text}"</p>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-gray-600 text-center col-span-3">
                No testimonials available.
              </p>
            )}
          </div>
        </div>
      </section>
      <section className="py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Ready to Transform Your
              <span className="block text-blue-600">Fitness Journey?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of users who have already achieved their fitness
              goals with our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2"
              >
                <Link to={getDashboardPath()}>
                  <span>Get Started Now</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-gray-300 text-gray-600 hover:bg-gray-100 transition-all duration-300"
              >
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-gray-800 text-gray-300 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-blue-400">FitPro</span>
              </div>
              <p className="text-gray-400">
                Transform your fitness journey with expert coaching and
                personalized plans.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-200 mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <Link
                    to="/success-stories"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Success Stories
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-200 mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    to="/help"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-200 mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    to="/about"
                    className="hover:text-blue-400 transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 FitPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
