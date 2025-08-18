"use client";

import { Heart, Users, TrendingUp, User, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";

interface SidebarNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
  onShowProfile: () => void;
  onShowSettings: () => void;
}

export default function SidebarNavigation({
  activeTab,
  setActiveTab,
  user,
  onShowProfile,
  onShowSettings,
}: SidebarNavigationProps) {
  const { logout } = useAuth();
  const handleLogout = async () => {
    logout();
  };
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center mb-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mr-3">
            <img src="/puppy.svg" />
          </div>
          <div className="w-1/2 flex items-center">
            <img
              src="/text_logo.svg"
              className="h-auto w-full object-contain transform scale-150"
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("home")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors text-left ${
              activeTab === "home"
                ? "bg-[#820504] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Heart className="w-5 h-5 mr-3" />
            <span className="font-medium">Discover Causes</span>
          </button>

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors text-left ${
              activeTab === "dashboard"
                ? "bg-[#820504] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Users className="w-5 h-5 mr-3" />
            <span className="font-medium">My Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("impact")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors text-left ${
              activeTab === "impact"
                ? "bg-[#820504] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <TrendingUp className="w-5 h-5 mr-3" />
            <span className="font-medium">Impact Tracker</span>
          </button>
        </nav>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center mb-4">
          <Avatar className="w-10 h-10 mr-3">
            <AvatarFallback className="bg-[#dca92c] text-white">
              {user.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-medium text-[#820504] text-sm">
              {user.name}
            </div>
            <div className="font-light text-[#820504] text-sm">
              @{user.username == "sean1" ? user.username + "☆" : user.username}
            </div>
            <div className="text-xs text-gray-600">{user.course}</div>
          </div>
        </div>

        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onShowProfile}
            className="w-full justify-start text-gray-600 hover:text-[#820504]"
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onShowSettings}
            className="w-full justify-start text-gray-600 hover:text-[#820504]"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-600 hover:text-[#820504]"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
