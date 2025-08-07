"use client"

import { Heart, Users, TrendingUp, User, Settings } from "lucide-react"

interface BottomNavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function BottomNavigation({ activeTab, setActiveTab }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            activeTab === "home" ? "text-[#820504] bg-[#820504]/10" : "text-gray-500"
          }`}
        >
          <Heart className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Home</span>
        </button>
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            activeTab === "dashboard" ? "text-[#820504] bg-[#820504]/10" : "text-gray-500"
          }`}
        >
          <Users className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Dashboard</span>
        </button>
        <button
          onClick={() => setActiveTab("impact")}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            activeTab === "impact" ? "text-[#820504] bg-[#820504]/10" : "text-gray-500"
          }`}
        >
          <TrendingUp className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Impact</span>
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            activeTab === "profile" ? "text-[#820504] bg-[#820504]/10" : "text-gray-500"
          }`}
        >
          <User className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Profile</span>
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            activeTab === "settings" ? "text-[#820504] bg-[#820504]/10" : "text-gray-500"
          }`}
        >
          <Settings className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Settings</span>
        </button>
      </div>
    </div>
  )
}
