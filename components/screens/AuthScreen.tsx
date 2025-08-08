import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart } from "lucide-react";
import api_link from "@/components/api_link";
import valid_campuses from "@/components/valid_campuses";
import valid_courses from "@/components/valid_courses";

interface AuthScreenProps {
  onAuthComplete: (user: any) => void;
}

export default function AuthScreen({ onAuthComplete }: AuthScreenProps) {
  const [currentView, setCurrentView] = useState<
    "main" | "login" | "signup" | "verify-email"
  >("main");
  const [isLoading, setIsLoading] = useState(false);
  const [signupData, setSignupData] = useState({
    username: "",
    fullName: "",
    student_id: "",
    email: "",
    course: "",
    campus: "",
    password: "",
  });
  const [loginData, setLoginData] = useState({
    username: "",
    fullName: "",
    student_id: "",
    email: "",
    course: "",
    campus: "",
    password: "",
  });
  const [verifyEmailData, setVerifyEmailData] = useState({
    username: "",
    email_code: "",
  });

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await fetch(api_link + "/api/verify-email", {
      method: "POST",
      body: JSON.stringify({
        email_code: verifyEmailData.email_code,
        username: verifyEmailData.username,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const { message } = await response.json();
    setIsLoading(false);
    console.log(verifyEmailData.username);
    console.log(verifyEmailData.email_code);
    if (response.status == 404) {
    }
    if (response.status == 200) {
      handleLoginInputChange("username", verifyEmailData.username);
      setCurrentView("login");
    }
  };

  const resendEmailCode = async () => {
    setIsLoading(true);

    const response = await fetch(api_link + "/api/resend-email", {
      method: "POST",
      body: JSON.stringify({
        username: verifyEmailData.username,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const { message, token } = await response.json();
    setIsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await fetch(api_link + "/api/login", {
      method: "POST",
      body: JSON.stringify({
        password: loginData.password,
        username: loginData.username,
      }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    setIsLoading(false);
    if (response.status == 403) {
      const { message } = await response.json();
      handleVerifyEmailInputChange("username", loginData.username);
      setCurrentView("verify-email");
    } else if (response.status == 200) {
      const { message } = await response.json();
      location.reload();
    } else {
      const { message } = await response.json();
      toast.error(message);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await fetch(api_link + "/api/register", {
      method: "POST",
      body: JSON.stringify({
        email: signupData.email,
        username: signupData.username,
        password: signupData.password,
        full_name: signupData.fullName,
        student_id: signupData.student_id,
        course: signupData.course,
        campus: signupData.campus,
      }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const { message } = await response.json();
    setIsLoading(false);
    if (response.status == 200) {
      handleVerifyEmailInputChange("username", signupData.username);
      setCurrentView("verify-email");
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  const handleVerifyEmailInputChange = (field: string, value: string) => {
    setVerifyEmailData((prev) => ({ ...prev, [field]: value }));
  };
  const handleSignupInputChange = (field: string, value: string) => {
    setSignupData((prev) => ({ ...prev, [field]: value }));
  };
  const handleLoginInputChange = (field: string, value: string) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
  };

  if (currentView === "main") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#820504] rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#820504]">
              Welcome to PUP Cause Catalyst
            </h1>
            <p className="text-gray-600 mt-2">
              Connecting Hearts, Creating Impact
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => setCurrentView("login")}
              className="w-full bg-[#820504] hover:bg-[#6d0403] text-white py-3 rounded-2xl font-semibold"
            >
              Log In
            </Button>
            <Button
              onClick={() => setCurrentView("signup")}
              variant="outline"
              className="w-full border-[#820504] text-[#820504] hover:bg-[#820504] hover:text-white py-3 rounded-2xl font-semibold bg-transparent"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === "verify-email") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#820504] rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#820504] mb-2">
              Veify your email
            </h2>
            <p className="text-gray-600">
              Check your email address for an email code and input it here
            </p>
          </div>

          <form onSubmit={handleVerifyEmail} className="space-y-4">
            <div>
              <Label
                htmlFor="email_code"
                className="text-[#820504] font-medium mb-2 block"
              >
                Email Code
              </Label>
              <Input
                id="email_code"
                type="number"
                value={verifyEmailData.email_code}
                onChange={(e) =>
                  handleVerifyEmailInputChange("email_code", e.target.value)
                }
                required
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#820504] focus:ring-0 bg-white"
              />
            </div>

            <Button
              className="w-full bg-[#820504] hover:bg-[#6d0403] text-white py-3 rounded-2xl font-semibold mt-6"
              onClick={() => resendEmailCode()}
              disabled={isLoading}
            >
              Resend Email Code
            </Button>
            <Button
              type="submit"
              className="w-full bg-[#820504] hover:bg-[#6d0403] text-white py-3 rounded-2xl font-semibold mt-6"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => setCurrentView("main")}
              className="text-gray-600 hover:text-[#820504]"
            >
              ← Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === "login") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#820504] rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#820504] mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Sign in to continue making a difference
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label
                htmlFor="username"
                className="text-[#820504] font-medium mb-2 block"
              >
                Username
              </Label>
              <Input
                id="username"
                placeholder="juan1234"
                value={loginData.username}
                onChange={(e) =>
                  handleLoginInputChange("username", e.target.value)
                }
                required
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#820504] focus:ring-0 bg-white"
              />
            </div>
            <div>
              <Label
                htmlFor="password"
                className="text-[#820504] font-medium mb-2 block"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={loginData.password}
                onChange={(e) =>
                  handleLoginInputChange("password", e.target.value)
                }
                required
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#820504] focus:ring-0 bg-white"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#820504] hover:bg-[#6d0403] text-white py-3 rounded-2xl font-semibold mt-6"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => setCurrentView("main")}
              className="text-gray-600 hover:text-[#820504]"
            >
              ← Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === "signup") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#820504] rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#820504] mb-2">
              Join the Community
            </h2>
            <p className="text-gray-600">
              Create your PUP Cause Catalyst account
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label
                htmlFor="username"
                className="text-[#820504] font-medium mb-2 block"
              >
                Username
              </Label>
              <Input
                id="fullName"
                placeholder="juan1234"
                value={signupData.username}
                onChange={(e) =>
                  handleSignupInputChange("username", e.target.value)
                }
                required
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#820504] focus:ring-0 bg-white"
              />
            </div>
            <div>
              <Label
                htmlFor="fullName"
                className="text-[#820504] font-medium mb-2 block"
              >
                Full Name
              </Label>
              <Input
                id="fullName"
                placeholder="Juan Dela Cruz"
                value={signupData.fullName}
                onChange={(e) =>
                  handleSignupInputChange("fullName", e.target.value)
                }
                required
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#820504] focus:ring-0 bg-white"
              />
            </div>
            <div>
              <Label
                htmlFor="student_id"
                className="text-[#820504] font-medium mb-2 block"
              >
                Student ID
              </Label>
              <Input
                id="student_id"
                placeholder="2021-12345-MN-0"
                value={signupData.student_id}
                onChange={(e) =>
                  handleSignupInputChange("student_id", e.target.value)
                }
                required
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#820504] focus:ring-0 bg-white"
              />
            </div>
            <div>
              <Label
                htmlFor="signupEmail"
                className="text-[#820504] font-medium mb-2 block"
              >
                Email
              </Label>
              <Input
                id="signupEmail"
                type="email"
                placeholder="your.email@pup.edu.ph"
                value={signupData.email}
                onChange={(e) =>
                  handleSignupInputChange("email", e.target.value)
                }
                required
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#820504] focus:ring-0 bg-white"
              />
            </div>
            <div>
              <Label
                htmlFor="course"
                className="text-[#820504] font-medium mb-2 block"
              >
                PUP Campus
              </Label>
              <Select
                value={signupData.course}
                onValueChange={(value) =>
                  handleSignupInputChange("course", value)
                }
                required
              >
                <SelectTrigger className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#820504] focus:ring-0 bg-white">
                  <SelectValue placeholder="Select your course" />
                </SelectTrigger>
                <SelectContent>
                  {valid_courses.map((a: string) => (
                    <SelectItem value={a} key={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label
                htmlFor="campus"
                className="text-[#820504] font-medium mb-2 block"
              >
                PUP Campus
              </Label>
              <Select
                value={signupData.campus}
                onValueChange={(value) =>
                  handleSignupInputChange("campus", value)
                }
                required
              >
                <SelectTrigger className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#820504] focus:ring-0 bg-white">
                  <SelectValue placeholder="Select your campus" />
                </SelectTrigger>
                <SelectContent>
                  {valid_campuses.map((a: string) => (
                    <SelectItem value={a} key={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label
                htmlFor="signupPassword"
                className="text-[#820504] font-medium mb-2 block"
              >
                Password
              </Label>
              <Input
                id="signupPassword"
                type="password"
                value={signupData.password}
                onChange={(e) =>
                  handleSignupInputChange("password", e.target.value)
                }
                required
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#820504] focus:ring-0 bg-white"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#820504] hover:bg-[#6d0403] text-white py-3 rounded-2xl font-semibold mt-6"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => setCurrentView("main")}
              className="text-gray-600 hover:text-[#820504]"
            >
              ← Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
