import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Mail } from "lucide-react";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!pattern.test(email)) return toast.error("Enter a valid email");
    try {
      setLoading(true);
      await axios.post("https://fitedge-backend.onrender.com/api/auth/request-otp", { email });
      localStorage.setItem("auth_email", email);
      toast.success(`OTP sent on your email:${email}`);
      navigate("/verify");
    } catch (error) {
      console.log("Error in handleSendOTP:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-md w-full space-y-8">
        <CardHeader className={"text-center"}>
          <CardTitle
            className={
              "text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            }
          >
            Login to FitEdge
          </CardTitle>
        </CardHeader>
        <CardContent className={"space-y-4"}>
          <div className="space-y-2">
            <Label
              htmlFor="email"
              lassName="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Mail className="size-5 text-gray-400" />
              </div>
              <Input
                id="email"
                type={"email"}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={
                  "w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                }
              />
            </div>
          </div>
          <Button
            onClick={handleSendOTP}
            disabled={loading}
            className={
              "w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            }
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
