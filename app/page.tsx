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
            setCurrentScreen("onboarding");
            return;
          }
          const { message: user_info_message, user_info } =
            await user_info_response.json();
          setUser(user_info);
          setCurrentScreen("main");
          return false;
        })();
      }
    };
    checkAuth();
  }, [currentScreen, refresh, isLoading]);

  const handleOnboardingComplete = () => setCurrentScreen("auth");

  const handleAuthComplete = (userData: any) => {
    setUser(userData);
    setCurrentScreen("main");
  };

  if (currentScreen === "splash") return <SplashScreen />;
  if (currentScreen === "onboarding")
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  if (currentScreen === "auth")
    return <AuthScreen onAuthComplete={handleAuthComplete} />;

  // main application
  return <MainApp user={user} />;
}
