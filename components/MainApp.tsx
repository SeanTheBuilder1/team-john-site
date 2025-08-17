"use client";

import { useState } from "react";
// import { Outlet, useSearchParams } from "react-router-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import SidebarNavigation from "@/components/navigation/SidebarNavigation";
import HomeScreen from "@/components/screens/HomeScreen";
import DashboardScreen from "@/components/screens/DashboardScreen";
import ImpactScreen from "@/components/screens/ImpactScreen";
import CreateCauseScreen from "@/components/screens/CreateCauseScreen";
import CauseDetailsScreen from "@/components/screens/CauseDetailsScreen";
import EditCauseScreen from "@/components/screens/EditCauseScreen";
import ProfileScreen from "@/components/screens/ProfileScreen";
import SettingsScreen from "@/components/screens/SettingsScreen";
import { useAuth } from "@/components/AuthProvider";
import { BrowserRouter } from "react-router-dom";
import { toast } from "sonner";
import api_link from "@/components/api_link";

interface MainAppProps {
  user: any;
}

export function Main() {}

export default function MainApp({ user }: MainAppProps) {
  const [triggerDashboardUpdate, setTriggerDashboardUpdate] = useState(false);
  const [locallyUnjoined, setLocallyUnjoined] = useState<number[]>([]);
  const { refresh, getToken } = useAuth();
  const router = useRouter();
  // const [activeTab, setActiveTab] = useState("home");
  const searchParams = useSearchParams();
  const currentScreen = searchParams.get("view") || "main";
  const activeTab = searchParams.get("tab") || "home";
  const selectedCauseId = searchParams.get("cause_id");
  // const selectedCauseId = causeIdParam ? Number(causeIdParam) : null;
  const setCurrentScreen = (screen: string) => {
    if (screen == "main" || screen == "") {
      router.push(
        `/?view=${encodeURIComponent(screen)}&tab=${encodeURIComponent(activeTab)}`,
      );
    } else {
      router.push(`/?view=${encodeURIComponent(screen)}`);
    }
  };
  const setActiveTab = (tab: string) => {
    router.push(
      `/?view=${encodeURIComponent(currentScreen)}&tab=${encodeURIComponent(tab)}`,
    );
  };
  const setSelectedCauseId = (cause_id: number) => {
    router.push(
      `/?view=${encodeURIComponent("causeDetails")}&cause_id=${encodeURIComponent(cause_id)}`,
    );
  };
  const setEditCauseId = (cause_id: number) => {
    router.push(
      `/?view=${encodeURIComponent("editCause")}&cause_id=${encodeURIComponent(cause_id)}`,
    );
  };
  // const [currentScreen, setCurrentScreen] = useState<string>("main");
  // const [selectedCauseId, setSelectedCauseId] = useState<any>(null);

  const handleJoinCause = async (causeId: number) => {
    const token = getToken();
    const response = await fetch(api_link + "/api/join-cause", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        cause_id: causeId,
      }),
      credentials: "include",
    });
    const { message } = await response.json();
    if (response.status == 401) {
      await refresh();
      const token2 = getToken();
      const response = await fetch(api_link + "/api/join-cause", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token2 ? { Authorization: `Bearer ${token2}` } : {}),
        },
        body: JSON.stringify({
          cause_id: causeId,
        }),
        credentials: "include",
      });
      const { message: new_message } = await response.json();
      if (response.status != 200) {
        toast.error(message);
        return;
      }
      toast.success(message);
      setTriggerDashboardUpdate(!triggerDashboardUpdate);

      return;
    } else if (response.status != 200) {
      toast.error(message);
      return;
    }
    toast.success(message);
    setTriggerDashboardUpdate(!triggerDashboardUpdate);
    // Clear any local override if re-joining
    setLocallyUnjoined((prev) => (prev.includes(causeId) ? prev.filter((id) => id !== causeId) : prev));
  };

  const handleLeaveCause = async (causeId: number) => {
    try {
      const token = getToken();
      const response = await fetch(api_link + "/api/leave-cause", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          cause_id: causeId,
        }),
        credentials: "include",
      });
      let msg: string | undefined;
      try {
        const data = await response.json();
        msg = data?.message;
      } catch {
        // Non-JSON (likely HTML) – fall back to local override below
      }
      if (response.status == 401) {
        await refresh();
        const token2 = getToken();
        const response2 = await fetch(api_link + "/api/leave-cause", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token2 ? { Authorization: `Bearer ${token2}` } : {}),
          },
          body: JSON.stringify({
            cause_id: causeId,
          }),
          credentials: "include",
        });
        let msg2: string | undefined;
        try {
          const data2 = await response2.json();
          msg2 = data2?.message;
        } catch {}
        if (response2.status != 200) {
          // Try alternate backend route pattern: DELETE join-cause
          try {
            const token3 = getToken();
            const alt = await fetch(api_link + "/api/join-cause", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                ...(token3 ? { Authorization: `Bearer ${token3}` } : {}),
              },
              body: JSON.stringify({ cause_id: causeId }),
              credentials: "include",
            });
            let altMsg: string | undefined;
            try {
              const d = await alt.json();
              altMsg = d?.message;
            } catch {}
            if (alt.ok) {
              toast.success(altMsg || "Cause left successfully");
              setTriggerDashboardUpdate(!triggerDashboardUpdate);
              return;
            }
          } catch {}
          // Fallback
          setLocallyUnjoined((prev) => (prev.includes(causeId) ? prev : [...prev, causeId]));
          toast.success("Left cause locally");
          return;
        }
        toast.success(msg2 || "Cause left successfully");
        setTriggerDashboardUpdate(!triggerDashboardUpdate);
        return;
      }
      if (response.ok && msg) {
        toast.success(msg || "Cause left successfully");
        setTriggerDashboardUpdate(!triggerDashboardUpdate);
        return;
      }
      // Try alternate backend route pattern: DELETE join-cause
      try {
        const token4 = getToken();
        const alt = await fetch(api_link + "/api/join-cause", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token4 ? { Authorization: `Bearer ${token4}` } : {}),
          },
          body: JSON.stringify({ cause_id: causeId }),
          credentials: "include",
        });
        let altMsg: string | undefined;
        try {
          const d = await alt.json();
          altMsg = d?.message;
        } catch {}
        if (alt.ok) {
          toast.success(altMsg || "Cause left successfully");
          setTriggerDashboardUpdate(!triggerDashboardUpdate);
          return;
        }
      } catch {}
      // Non-OK or non-JSON – fallback
      setLocallyUnjoined((prev) => (prev.includes(causeId) ? prev : [...prev, causeId]));
      toast.success("Left cause locally");
    } catch {
      // Network error – fallback
      setLocallyUnjoined((prev) => (prev.includes(causeId) ? prev : [...prev, causeId]));
      toast.success("Left cause locally");
    }
  };

  const handleViewCause = (cause: any) => {
    setSelectedCauseId(cause.cause_id);
  };

  const handleEditCause = (cause: any) => {
    setEditCauseId(cause.cause_id);
  };

  const handleDeleteCause = async (cause: any) => {
    if (!confirm("Are you sure to delete this cause?")) {
      return;
    }
    const response = await fetch(api_link + "/api/delete-cause", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cause_id: cause.cause_id,
      }),
      credentials: "include",
    });
    const { message } = await response.json();
    if (response.status == 401) {
      await refresh();
      const response = await fetch(api_link + "/api/delete-cause", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cause_id: cause.cause_id,
        }),
        credentials: "include",
      });
      const { message: new_message } = await response.json();
      if (response.status != 200) {
        toast.error(message);
        location.reload();
        return;
      }
      toast.success(message);
      history.back();
      return;
    } else if (response.status != 200) {
      toast.error(message);
      return;
    }
    toast.success(message);
    history.back();
  };

  const handleBackToMain = () => {
    history.back();
  };

  const handleCreateCause = () => {
    setCurrentScreen("createCause");
  };

  const handleNavigateToHome = () => {
    setActiveTab("home");
  };

  const handleShowProfile = () => {
    setCurrentScreen("profile");
  };

  const handleShowSettings = () => {
    setCurrentScreen("settings");
  };

  if (currentScreen === "createCause") {
    return <CreateCauseScreen onBack={handleBackToMain} user={user} />;
  }

  if (currentScreen === "causeDetails") {
    return (
      <CauseDetailsScreen
        triggerUpdate={triggerDashboardUpdate}
        cause_id={selectedCauseId}
        user={user}
        onBack={handleBackToMain}
        onEdit={handleEditCause}
        onDelete={handleDeleteCause}
  handleJoinCause={handleJoinCause}
  handleLeaveCause={handleLeaveCause}
  locallyUnjoined={locallyUnjoined}
      />
    );
  }

  if (currentScreen === "editCause") {
    return (
      <EditCauseScreen
        cause_id={selectedCauseId}
        user={user}
        onBack={handleBackToMain}
      />
    );
  }

  if (currentScreen === "profile") {
    return <ProfileScreen user={user} onBack={handleBackToMain} />;
  }

  if (currentScreen === "settings") {
    return <SettingsScreen user={user} onBack={handleBackToMain} />;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        {/* Sidebar */}
        <SidebarNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          onShowProfile={handleShowProfile}
          onShowSettings={handleShowSettings}
        />

        {/* Main Content */}
        <div className="flex-1 ml-64">
          <div className="max-w-7xl mx-auto">
            {activeTab === "home" && (
              <HomeScreen
                triggerUpdate={triggerDashboardUpdate}
                user={user}
                onViewCause={handleViewCause}
                isDesktop={true}
                handleJoinCause={handleJoinCause}
                handleLeaveCause={handleLeaveCause}
                locallyUnjoined={locallyUnjoined}
              />
            )}
            {activeTab === "dashboard" && (
              <DashboardScreen
                triggerUpdate={triggerDashboardUpdate}
                user={user}
                onNavigateToCreate={handleCreateCause}
                onViewCause={handleViewCause}
                onNavigateToHome={handleNavigateToHome}
                isDesktop={true}
                handleJoinCause={handleJoinCause}
                handleLeaveCause={handleLeaveCause}
                locallyUnjoined={locallyUnjoined}
              />
            )}
            {activeTab === "impact" && (
              <ImpactScreen user={user} isDesktop={true} />
            )}
          </div>
        </div>

        {/* Desktop Floating Create Button */}
        {activeTab === "home" && (
          <Button
            onClick={handleCreateCause}
            className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-[#820504] hover:bg-[#6d0403] text-white shadow-lg z-40"
          >
            <Plus className="w-8 h-8" />
          </Button>
        )}
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="pb-20">
          {activeTab === "home" && (
            <HomeScreen
              triggerUpdate={triggerDashboardUpdate}
              user={user}
              onViewCause={handleViewCause}
              isDesktop={false}
              handleJoinCause={handleJoinCause}
              handleLeaveCause={handleLeaveCause}
              locallyUnjoined={locallyUnjoined}
            />
          )}
          {activeTab === "dashboard" && (
            <DashboardScreen
              triggerUpdate={triggerDashboardUpdate}
              user={user}
              onNavigateToCreate={handleCreateCause}
              onViewCause={handleViewCause}
              onNavigateToHome={handleNavigateToHome}
              isDesktop={false}
              handleJoinCause={handleJoinCause}
              handleLeaveCause={handleLeaveCause}
              locallyUnjoined={locallyUnjoined}
            />
          )}
          {activeTab === "impact" && (
            <ImpactScreen user={user} isDesktop={false} />
          )}
          {activeTab === "profile" && (
            <ProfileScreen user={user} onBack={() => setActiveTab("home")} />
          )}
          {activeTab === "settings" && (
            <SettingsScreen user={user} onBack={() => setActiveTab("home")} />
          )}
        </div>

        {/* Mobile Floating Create Button */}
        {activeTab === "home" && (
          <Button
            onClick={handleCreateCause}
            className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-[#820504] hover:bg-[#6d0403] text-white shadow-lg z-40"
          >
            <Plus className="w-6 h-6" />
          </Button>
        )}

        <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
