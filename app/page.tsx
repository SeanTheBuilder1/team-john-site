"use client";

import { useEffect, useState } from "react";

import SplashScreen from "@/components/screens/SplashScreen";
import OnboardingScreen from "@/components/screens/OnboardingScreen";
import AuthScreen from "@/components/screens/AuthScreen";
import MainApp from "@/components/MainApp";
import { useAuth } from "@/components/AuthProvider";
import api_link from "@/components/api_link";

export default function PUPCauseCatalyst() {
  const { refresh, isLoading } = useAuth();
  // "splash" ➜ "onboarding" ➜ "auth" ➜ "main"
  const [currentScreen, setCurrentScreen] = useState<
    "splash" | "onboarding" | "auth" | "main"
  >("splash");

  // Ensure splash screen animation completes before switching
  const [splashDone, setSplashDone] = useState(false);
  const [pendingScreen, setPendingScreen] = useState<
    "onboarding" | "main" | null
  >(null);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (currentScreen === "splash") {
        if (isLoading) {
          return;
        }
        (async () => {
          const user_info_response = await fetch(
            api_link + "/api/get-user-info",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({}),
              credentials: "include",
            },
          );
          if (user_info_response.status != 200) {
            // Don't switch yet; wait until splash animation completes
            setPendingScreen("onboarding");
            return;
          }
          const { message: user_info_message, user_info } =
            await user_info_response.json();
          setUser(user_info);
          // Don't switch yet; wait until splash animation completes
          setPendingScreen("main");
          return false;
        })();
      }
    };
    checkAuth();
  }, [currentScreen, refresh, isLoading]);

  // Switch from splash only after the animation completed
  useEffect(() => {
    if (currentScreen === "splash" && splashDone && pendingScreen) {
      setCurrentScreen(pendingScreen);
    }
  }, [splashDone, pendingScreen, currentScreen]);

  const handleOnboardingComplete = () => setCurrentScreen("auth");

  const handleAuthComplete = (userData: any) => {
    setUser(userData);
    setCurrentScreen("main");
  };

  // While in splash, render the next screen underneath and overlay splash on top.
  if (currentScreen === "splash") {
    // Decide which screen should be shown next based on auth probe
    const next = pendingScreen ?? "onboarding";
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-[#820504] to-[#a50606]">
        <div className="relative z-0">
          {next === "onboarding" && (
            <OnboardingScreen onComplete={handleOnboardingComplete} />
          )}
          {next === "main" && <MainApp user={user} />}
        </div>
        <div className="absolute inset-0 z-50">
          <SplashScreen onComplete={() => setSplashDone(true)} />
        </div>
      </div>
    );
  }

  if (currentScreen === "onboarding")
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  if (currentScreen === "auth")
    return <AuthScreen onAuthComplete={handleAuthComplete} />;

  // main application
  return <MainApp user={user} />;
}
