"use client";

import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete?: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [frontOpacity, setFrontOpacity] = useState(0); // puppy_front fade-in
  const [puppyOpacity, setPuppyOpacity] = useState(0); // puppy crossfade in
  const [exiting, setExiting] = useState(false); // slide up the whole screen

  useEffect(() => {
    const timers: Array<ReturnType<typeof setTimeout>> = [];

    // Fade in puppy_front
  timers.push(setTimeout(() => setFrontOpacity(1), 0));

    // After a moment, crossfade to puppy.svg
    timers.push(
      setTimeout(() => {
        setPuppyOpacity(1); // fade-in puppy.svg
        // fade-out puppy_front slightly after to allow overlap
        timers.push(setTimeout(() => setFrontOpacity(0), 250));
      }, 500),
    );

    // Start upward exit animation after a hold (+4s buffer)
    timers.push(
      setTimeout(() => {
        setExiting(true);
        // fire completion after the slide-up finishes (matches duration-700)
        if (onComplete) {
          timers.push(setTimeout(() => onComplete(), 750));
        }
      }, 2400 + 1000),
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  // Click anywhere to skip immediately (keeps slide-up transition)
  const handleSkip = () => {
    if (exiting) return;
    setExiting(true);
    if (onComplete) {
      setTimeout(() => onComplete(), 750);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-transform duration-700 ease-out ${
        exiting ? "-translate-y-full" : "translate-y-0"
      }`}
      onClick={handleSkip}
    >
      <div className="min-h-screen bg-gradient-to-br from-[#820504] to-[#a50606] flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="flex items-center mb-4">
              {/* Icon container with crossfade between puppy_front and puppy */}
              <div className="relative w-24 h-24 rounded-full flex items-center justify-center mr-3 overflow-hidden">
        <img
                  src="/puppy_front.svg"
                  alt="Puppy Front"
                  style={{
      opacity: frontOpacity,
      transition: "opacity 500ms ease",
                  }}
                  className="absolute inset-0 w-full h-full object-contain"
                />
                <img
                  src="/puppy.svg"
                  alt="Puppy"
                  style={{
                    opacity: puppyOpacity,
                    transition: "opacity 500ms ease",
                  }}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>
              <div className="w-32 md:w-48 flex items-center">
                <img
                  src="/text_logo.svg"
                  className="h-auto w-full object-contain transform scale-150"
                  alt="Text Logo"
                />
              </div>
            </div>
          </div>
          <p className="text-lg opacity-90">Connecting Hearts, Creating Impact</p>
        </div>
      </div>
    </div>
  );
}
