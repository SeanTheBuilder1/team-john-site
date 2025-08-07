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

interface AuthScreenProps {
  onAuthComplete: (user: any) => void;
}

const valid_courses = [
  "N/A",
  "Associate Degree Associate in Tourism Management (ATM) Associate in Tourism Management (ATM)",
  "Bachelor in Advertising and Public Relations (BADPR)",
  "Bachelor in Cooperatives (BCOOP)",
  "Bachelor in Elementary Education (BEED)",
  "Bachelor in Secondary Education major in Mathematics (BSEDMT)",
  "Bachelor of Arts in Broadcasting (BA Broadcasting)",
  "Bachelor of Arts in Communication Research (BACR)",
  "Bachelor of Arts in English Language Studies (formerly Bachelor of Arts in English) (ABELS)",
  "Bachelor of Arts in Filipinology (ABF)",
  "Bachelor of Arts in History (BAH)",
  "Bachelor of Arts in International Studies (BAIS)",
  "Bachelor of Arts in Journalism (BAJ)",
  "Bachelor of Arts in Literary and Cultural Studies (ABLCS)",
  "Bachelor of Arts in Philosophy (AB-PHILO)",
  "Bachelor of Arts in Political Economy (BAPE)",
  "Bachelor of Arts in Political Science (BAPS)",
  "Bachelor of Arts in Sociology (formerly Bachelor of Science in Sociology) (BAS)",
  "Bachelor of Business Technology and Livelihood Education (BBTLE)",
  "Bachelor of Business Technology and Livelihood Education major in Home Economics (BBTLEDHE)",
  "Bachelor of Early Childhood Education (BECEd)",
  "Bachelor of Elementary Education (BEEd)",
  "Bachelor of Library and Information Science (BLIS)",
  "Bachelor of Performing Arts major in Theater Arts (formerly BA Theater Arts) (BPEA)",
  "Bachelor of Physical Education (BPE)",
  "Bachelor of Public Administration (BPA)",
  "Bachelor of Public Administration major in Public Financial Management (BPAPFM)",
  "Bachelor of Science Food Technology (BSFT)",
  "Bachelor of Science in Accountancy (BSA)",
  "Bachelor of Science in Agricultural Business Management (BSAM)",
  "Bachelor of Science in Applied Mathematics (BSAPMATH)",
  "Bachelor of Science in Architecture (BS-ARCH)",
  "Bachelor of Science in Biology (BSBIO)",
  "Bachelor of Science in Business Administration Major in Financial Management (BSBAFM)",
  "Bachelor of Science in Business Administration major in Human Resource Management (BSBA-HRM)",
  "Bachelor of Science in Business Administration major in Marketing Management (BSBA-MM)",
  "Bachelor of Science in Chemistry (BSCHEM)",
  "Bachelor of Science in Civil Engineering (BSCE)",
  "Bachelor of Science in Computer Engineering (BSCpE)",
  "Bachelor of Science in Computer Science (BSCS)",
  "Bachelor of Science in Cooperatives (formerly Bachelor in Cooperatives) (BSC)",
  "Bachelor of Science in Economics (BSE)",
  "Bachelor of Science in Electrical Engineering (BSEE)",
  "Bachelor of Science in Electronics Engineering (BS-ECE)",
  "Bachelor of Science in Entrepreneurship (BSENTREP)",
  "Bachelor of Science in Entrepreneurship (Open University) (BSENTREP)",
  "Bachelor of Science in Environmental Planning (BSEP)",
  "Bachelor of Science in Exercises and Sports (BSESS)",
  "Bachelor of Science in Hospitality Management (BSHM)",
  "Bachelor of Science in Industrial Engineering (BSIE)",
  "Bachelor of Science in Information Technology (BSIT)",
  "Bachelor of Science in Interior Design (BSID)",
  "Bachelor of Science in Management Accounting (BSMA)",
  "Bachelor of Science in Mathematics (BSMATH)",
  "Bachelor of Science in Mechanical Engineering (BSME)",
  "Bachelor of Science in Nutrition and Dietetics (BSND)",
  "Bachelor of Science in Office Administration (BSOA)",
  "Bachelor of Science in Office Administration major in Legal Transcription (BSOALT)",
  "Bachelor of Science in Physics (BSPHY)",
  "Bachelor of Science in Psychology (BSPSY)",
  "Bachelor of Science in Railway Engineering (formerly Bachelor of Science in Railway Engineering and Management) (BSRE)",
  "Bachelor of Science in Statistics (formerly Bachelor in Applied Statistics) (BSSTAT)",
  "Bachelor of Science in Tourism Management (BSTM)",
  "Bachelor of Science in Transportation Management (formerly Bachelor in Transportation Management) (BSTRM)",
  "Bachelor of Secondary Education (BSEd) major in:",
  "Bachelor of Secondary Education major in English (BSEDEN)",
  "Bachelor of Secondary Education major in Filipino (BSEDFL)",
  "Bachelor of Secondary Education major in Mathematics (BSEDMT)",
  "Bachelor of Secondary Education major in Social Studies (BSEDSS)",
  "Bachelor of Technology and Livelihood Education (BTLEd) major in:",
  "Diploma in Computer Engineering Technology (DCET)",
  "Diploma in Electrical Engineering Technology (DEET)",
  "Diploma in Electronics Engineering Technology (DECET)",
  "Diploma in Information Communication Technology (DICT)",
  "Diploma in Mechanical Engineering Technology (DMET)",
  "Diploma in Office Management Technology (DOMT)",
  "Diploma in Office Management Technology Legal Office Management (DOMTLOM)",
  "Diploma in Office Management Technology Medical Office Management (DOMTMOM)",
  "Doctor in Business Administration (DBA)",
  "Doctor in Engineering Management (D.Eng)",
  "Doctor in Public Administration (DPA)",
  "Doctor of Philosophy in Communication (PhD Com)",
  "Doctor of Philosophy in Economics (PhD Econ)",
  "Doctor of Philosophy in English Language Studies (PhD ELS)",
  "Doctor of Philosophy in Filipino (PhD Fil)",
  "Doctor of Philosophy in Psychology (PhD Psy)",
  "Doctor of Philsophy in Education Management (PhDEM)",
  "Juris Doctor (JD)",
  "Master in Applied Statistics (MAS)",
  "Master in Business Administration (MBA)",
  "Master in Business Education (MBE)",
  "Master in Communication (MC)",
  "Master in Educational Management (MEM, Open University System)",
  "Master in Information Technology (MIT)",
  "Master in Library and Information Science (MLIS)",
  "Master in Public Administration (MPA, Open University System)",
  "Master in Public Administration (MPA)",
  "Master of Arts in Communication (MAC)",
  "Master of Arts in Education major in Mathematics Education (MAEd-ME)",
  "Master of Arts in Education major in Teaching in the Challenged Areas (MAED-TCA)",
  "Master of Arts in Education Management  (MAEM)",
  "Master of Arts in Education Management (Open University)",
  "Master of Arts in English Language Studies (MAELS)",
  "Master of Arts in English Language Teaching (MAELT)",
  "Master of Arts in Filipino (MAF)",
  "Master of Arts in Philippine Studies (MAPhilS)",
  "Master of Arts in Philosophy (MAPhilo)",
  "Master of Arts in Physical Education and Sports (MAPES)",
  "Master of Arts in Psychology (MAP)",
  "Master of Arts in Sociology (MASocio)",
  "Master of Science in Biology (MSBio)",
  "Master of Science in Civil Engineering (MSCE)",
  "Master of Science in Computer Engineering (MSCpE)",
  "Master of Science in Construction Management (MSCM)",
  "Master of Science in Economics (MSEcon)",
  "Master of Science in Electronics Engineering (MSEcE)",
  "Master of Science in Industrial Engineering (MSIE)",
  "Master of Science in Information Technology (MSIT)",
  "Master of Science in International Tourism and Hospitality Management (MSITHM)",
  "Master of Science in Mathematics (MSMath)",
  "Master of Science in Mechanical Engineering (MSME)",
  "Master of Science in Nutrition and Dietetics (MSND)",
  "Masters in Educational Management (MEM, Open University System)",
  "Masters in Public Administration (MPA, Open University System)",
  "Post Baccalaureate Diploma in Information Technology (PBDIT)",
  "Post Baccalaureate in Teacher Education (PBTE)",
  "Post-Baccalaureate Diploma in Education (PBDE)",
  "Professional Science Masters in Railway Engineering Management (PSMREM)",
];

const valid_campuses = [
  "Sta. Mesa",
  "Taguig",
  "San Juan",
  "Parañaque",
  "Bataan",
  "Sta. Maria",
  "Pulilan",
  "Cabiao",
  "Lopez",
  "Mulanay",
  "General Luna",
  "Unisan",
  "Ragay",
  "Sto. Tomas",
  "Maragondon",
  "Alfonso",
  "Bansud",
  "Sablayan",
  "Biñan",
  "San Pedro",
  "Sta. Rosa",
  "Calauan",
];

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
