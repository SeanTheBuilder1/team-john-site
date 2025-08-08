"use client";

import { useState } from "react";
import { ArrowLeft, User, Lock, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/components/AuthProvider";
import valid_courses from "@/components/valid_courses";
import valid_campuses from "@/components/valid_campuses";

interface SettingsScreenProps {
  user: any;
  onBack: () => void;
}

export default function SettingsScreen({ user, onBack }: SettingsScreenProps) {
  const { logout } = useAuth();
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    course: user.course || "",
    campus: user.campus || "Main Campus",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Saving changes:", formData);
      setIsLoading(false);
    }, 1500);
  };

  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Changing password");
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setIsLoading(false);
    }, 1500);
  };

  const handleDeleteAccount = async () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        console.log("Deleting account");
        setIsLoading(false);
      }, 1500);
    }
  };

  const handleLogout = async () => {
    if (confirm("Are you sure you want to log out?")) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 lg:p-6">
        <div className="max-w-4xl mx-auto flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mr-3 text-[#820504] hover:bg-[#820504]/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl lg:text-2xl font-bold text-[#820504]">
            Settings
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-8">
        {/* Account Details */}
        <Card className="border-0 shadow-md rounded-3xl">
          <CardHeader className="p-6 lg:p-8">
            <CardTitle className="text-[#820504] text-xl lg:text-2xl flex items-center">
              <User className="w-6 h-6 mr-3" />
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 lg:px-8 pb-6 lg:pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="name"
                  className="text-[#820504] font-medium mb-2 block"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-xl"
                />
              </div>

              <div>
                <Label
                  htmlFor="email"
                  className="text-[#820504] font-medium mb-2 block"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-xl"
                />
              </div>

              <div>
                <Label
                  htmlFor="course"
                  className="text-[#820504] font-medium mb-2 block"
                >
                  Course
                </Label>
                <Select
                  value={formData.course}
                  onValueChange={(value) => handleInputChange("course", value)}
                  required
                >
                  <SelectTrigger className="border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-xl">
                    <SelectValue />
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
                  Campus
                </Label>
                <Select
                  value={formData.campus}
                  onValueChange={(value) => handleInputChange("campus", value)}
                >
                  <SelectTrigger className="border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-xl">
                    <SelectValue />
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
            </div>

            <div className="mt-6">
              <Button
                onClick={handleSaveChanges}
                disabled={isLoading}
                className="bg-[#820504] hover:bg-[#6d0403] text-white rounded-xl px-6 py-2"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="border-0 shadow-md rounded-3xl">
          <CardHeader className="p-6 lg:p-8">
            <CardTitle className="text-[#820504] text-xl lg:text-2xl flex items-center">
              <Lock className="w-6 h-6 mr-3" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 lg:px-8 pb-6 lg:pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <Label
                  htmlFor="currentPassword"
                  className="text-[#820504] font-medium mb-2 block"
                >
                  Current Password
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) =>
                    handleInputChange("currentPassword", e.target.value)
                  }
                  className="border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-xl"
                />
              </div>

              <div>
                <Label
                  htmlFor="newPassword"
                  className="text-[#820504] font-medium mb-2 block"
                >
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) =>
                    handleInputChange("newPassword", e.target.value)
                  }
                  className="border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-xl"
                />
              </div>

              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="text-[#820504] font-medium mb-2 block"
                >
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className="border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-xl"
                />
              </div>
            </div>

            <div className="mt-6">
              <Button
                onClick={handleChangePassword}
                disabled={
                  isLoading ||
                  !formData.currentPassword ||
                  !formData.newPassword ||
                  !formData.confirmPassword
                }
                className="bg-[#820504] hover:bg-[#6d0403] text-white rounded-xl px-6 py-2"
              >
                <Lock className="w-4 h-4 mr-2" />
                {isLoading ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="border-0 shadow-md rounded-3xl">
          <CardHeader className="p-6 lg:p-8">
            <CardTitle className="text-[#820504] text-xl lg:text-2xl">
              Account Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 lg:px-8 pb-6 lg:pb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-[#820504] text-[#820504] hover:bg-[#820504] hover:text-white rounded-xl px-6 py-2 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Log Out
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl px-6 py-2 bg-transparent"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-red-500">
                      Delete Account
                    </DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-gray-700 mb-4">
                      Are you sure you want to delete your account? This action
                      cannot be undone and you will lose all your data.
                    </p>
                    <div className="flex gap-3">
                      <Button
                        onClick={handleDeleteAccount}
                        disabled={isLoading}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-6 py-2"
                      >
                        {isLoading ? "Deleting..." : "Yes, Delete Account"}
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-xl px-6 py-2 bg-transparent"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
