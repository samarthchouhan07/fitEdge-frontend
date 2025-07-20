import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { LogInIcon, OptionIcon } from "lucide-react";

export default function OtpPage() {
  const [otp, setOtp] = useState("");
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem("auth_email");

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          email,
          otp,
        }
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (res.data.isNew) {
        toast.success("Welcome new User!");
      } else {
        toast.success("Login Successfully");
      }
      navigate("/");
    } catch (error) {
      console.log("error in handleVerifyOtp:", error);
      toast.error("Enter valid OTP");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className={"w-full max-w-sm"}>
        <CardHeader>
          <CardTitle className={"text-center text-2xl font-bold"}>
            Verify OTP
          </CardTitle>
        </CardHeader>
        <CardContent className={"space-y-4"}>
          <div>
            <Label
              className={"block text0sm font-medium text-gray-700 mb-2"}
              htmlFor="otp"
            >
              Enter OTP:
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <LogInIcon className="size-5 text-gray-400" />
              </div>
              <Input
                id="otp"
                type={"text"}
                className={
                  "w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                }
                placeholder="Enter your OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          </div>
          <Button
            onClick={handleVerifyOtp}
            disabled={isLoading}
            className={
              "w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            }
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
