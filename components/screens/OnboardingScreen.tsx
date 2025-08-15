"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, Target, ChevronRight } from "lucide-react";

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({
  onComplete,
}: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: () => <img src="/puppy.svg" />,
      title: "Unleash Your Bayanihan Spirit!",
      description:
        "For PUPians, By PUPians — Your Ideas, Our Impact. Join hands with fellow students, faculty, and residents to create meaningful change in our community.",
    },
    {
      icon: Users,
      title: "Connect with Fellow PUPians",
      description:
        "Find like-minded individuals who share your passion for making a difference. Build lasting connections through meaningful causes.",
    },
    {
      icon: Target,
      title: "Create Real Impact",
      description:
        "Turn your ideas into action. Start your own cause or join existing ones to create positive change in your community.",
    },
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const skip = () => {
    onComplete();
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#820504] to-[#a50606] flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center text-white max-w-sm">
          <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8">
            <Icon className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-4">{slide.title}</h1>
          <p className="text-lg opacity-90 leading-relaxed">
            {slide.description}
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-center mb-6">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full mx-1 ${index === currentSlide ? "bg-white" : "bg-white/30"}`}
            />
          ))}
        </div>

        <div className="flex gap-4">
          <Button
            variant="ghost"
            onClick={skip}
            className="text-white hover:bg-white/20 flex-1"
          >
            Skip
          </Button>
          <Button
            onClick={nextSlide}
            className="bg-[#dca92c] hover:bg-[#c49429] text-[#820504] font-semibold flex-1"
          >
            {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
