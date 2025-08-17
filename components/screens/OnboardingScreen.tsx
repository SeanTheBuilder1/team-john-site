"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Target, ChevronRight } from "lucide-react";

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({
  onComplete,
}: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      // accept props so className and sizing passed when rendered will apply
      icon: (props: any) => <img src="/puppy.svg" alt="puppy" {...props} />,
      title: "For PUPians, By PUPians",
      description:
        "Your Ideas, Our Impact. Bayanihan with fellow students, faculty, and residents of PUP campuses to create meaningful change in our community.",
    },
    {
  // use the provided handshake svg; accepts props so sizing matches the puppy icon
  icon: (props: any) => <img src="/handshake.svg" alt="handshake" {...props} />,
      title: "Connect with PUPians",
      description:
        "Find like-minded individuals and organizations who share your passion for making a difference. Any campus from Sta. Mesa to San Pedro!",
    },
    {
      // use the puzzle svg and accept props so sizing matches the other image icons
      icon: (props: any) => <img src="/puzzle.svg" alt="puzzle" {...props} />,
      title: "Create Real Impact",
      description:
        "Turn your ideas into action. Start and organize your own cause or join existing ones to be a catalyst for change in our university.",
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
    // Skip onboarding entirely and go to Auth screen
    onComplete();
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#820504] to-[#a50606] flex flex-col">
  {/* small skip button in the top-right */}
  <div className="absolute top-4 right-4 z-50 pointer-events-auto">
        <Button
          variant="ghost"
          onClick={skip}
          className="text-white hover:bg-white/10 text-sm px-3 py-1 rounded"
        >
          Skip
        </Button>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 relative">
        {/* absolute icon so it doesn't move with text changes */}
  <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full flex items-center justify-center overflow-hidden pointer-events-none">
          <Icon className={`w-32 h-32 text-white object-contain origin-center transform ${currentSlide === 1 ? 'scale-[2.5]' : currentSlide === 2 ? 'scale-[2]' : ''}`} />
        </div>
  <div className="text-center text-white max-w-sm mt-28 sm:mt-32">
          <h1 className="text-2xl font-bold mb-2">{slide.title}</h1>
          {/* Render the first and third slide descriptions as two smaller paragraphs */}
          {currentSlide === 0 ? (
            <>
              <p className="text-base opacity-90 leading-relaxed">Your Ideas, Our Impact.</p>
              <p className="text-base opacity-90 leading-relaxed mt-2">
                Bayanihan with fellow students, faculty, and residents of PUP campuses to create meaningful change in our community.
              </p>
            </>
          ) : currentSlide === 2 ? (
            <>
              <p className="text-base opacity-90 leading-relaxed">Turn your ideas into action.</p>
              <p className="text-base opacity-90 leading-relaxed mt-2">
                Start and organize your own cause or join existing ones to be a catalyst for change in our university.
              </p>
            </>
          ) : (
            <p className="text-lg opacity-90 leading-relaxed">{slide.description}</p>
          )}
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
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="text-white hover:bg-white/20 flex-1 disabled:opacity-50"
          >
            Previous
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
