"use client";

import { useState } from "react";
import { Users, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CauseCardProps {
  cause: any;
  onViewDetails: () => void;
  onJoinCause: () => void;
  onLeaveCause?: () => void;
  showDate?: boolean;
  isDesktop?: boolean;
}

export default function CauseCard({
  cause,
  onViewDetails,
  onJoinCause,
  onLeaveCause,
  showDate = true,
  isDesktop = false,
}: CauseCardProps) {
  const [leaveOpen, setLeaveOpen] = useState(false);
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startFormatted = start.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const endFormatted = end.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    if (startDate === endDate) {
      return startFormatted;
    }

    return `${startFormatted} to ${endFormatted}`;
  };

  const getLocationDisplay = () => {
    if (cause.campus && cause.location) {
      return `${cause.campus} - ${cause.location}`;
    } else if (cause.campus) {
      return `PUP ${cause.campus}`;
    } else if (cause.location) {
      return cause.location;
    }
    return "Location TBD";
  };

  if (isDesktop) {
    return (
      <div>
        {!showDate && (
          <div className="text-sm font-medium text-[#820504] mb-3 px-2">
            {cause.date}
          </div>
        )}
        <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-0 rounded-3xl overflow-hidden h-full flex flex-col cursor-pointer group">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start mb-2">
              <CardTitle className="text-xl font-bold text-[#820504] leading-tight group-hover:text-[#6d0403] transition-colors">
                {cause.title}
              </CardTitle>
              <Badge
                variant="secondary"
                className="bg-[#fede0d]/20 text-[#820504] border-0 px-3 py-1"
              >
                {cause.category}
              </Badge>
            </div>
            <div className="text-sm font-medium text-gray-700 mb-3">
              Organized by{" "}
              <span className="text-[#820504]">{cause.username}</span>
            </div>
            <CardDescription className="text-gray-600 leading-relaxed line-clamp-3">
              {cause.short_description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 flex-1 flex flex-col">
            <div className="flex flex-wrap gap-2 mb-4">
              {
                //cause.tags.slice(0, 3).map((tag: string, index: number) => (
                // <Badge key={index} variant="outline" className="text-xs border-[#dca92c] text-[#dca92c] px-2 py-1">
                // {tag}
                // </Badge>
                //))
              }
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center text-xs text-gray-600">
                <Users className="w-3 h-3 mr-2 text-[#820504] flex-shrink-0" />
                <span>
                  {cause.volunteer_count}/{cause.max_volunteers} volunteers
                </span>
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <MapPin className="w-3 h-3 mr-2 text-[#820504] flex-shrink-0" />
                <span className="truncate">{getLocationDisplay()}</span>
              </div>
              {showDate && (
                <div className="flex items-center text-xs text-gray-600 col-span-2">
                  <Clock className="w-3 h-3 mr-2 text-[#820504] flex-shrink-0" />
                  <span className="text-xs">
                    {formatDateRange(cause.start_date, cause.end_date)}
                  </span>
                </div>
              )}
              <div className="flex items-center text-xs text-gray-600 col-span-2">
                <Users className="w-3 h-3 mr-2 text-[#820504] flex-shrink-0" />
                <span>Days available: {cause.preferred_days}</span>
              </div>
            </div>

            <Progress
              value={(cause.volunteer_count / cause.max_volunteers) * 100}
              className="mb-6 h-2"
            />

            <div className="flex gap-3 mt-auto">
              <Button
                onClick={
                  cause.user_is_joined
                    ? () => setLeaveOpen(true)
                    : onJoinCause
                }
                className={`flex-1 rounded-full font-medium ${
                  cause.user_is_joined
                    ? "bg-gray-500 hover:bg-red-600 text-white"
                    : "bg-[#820504] hover:bg-[#6d0403] text-white"
                }`}
                title={cause.user_is_joined ? "Leave cause" : "Join cause"}
              >
                {cause.user_is_joined ? "Cause Joined" : "Join Cause"}
              </Button>
              <Button
                onClick={onViewDetails}
                variant="outline"
                className="px-6 border-[#820504] text-[#820504] hover:bg-[#820504] hover:text-white rounded-2xl bg-transparent"
              >
                View Details
              </Button>
            </div>

            {/* Leave confirmation dialog */}
            <AlertDialog open={leaveOpen} onOpenChange={setLeaveOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Leave this cause?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to leave "{cause.title}"? You may lose your spot if the cause fills up.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => {
                      setLeaveOpen(false);
                      onLeaveCause?.();
                    }}
                  >
                    Leave Cause
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mobile layout
  return (
    <div>
      {showDate && (
        <div className="text-sm font-medium text-[#820504] mb-2 px-2">
          {cause.date}
        </div>
      )}
      <Card className="shadow-md hover:shadow-lg transition-shadow border-0 rounded-2xl overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-lg font-bold text-[#820504] leading-tight">
              {cause.title}
            </CardTitle>
            <Badge
              variant="secondary"
              className="bg-[#fede0d]/20 text-[#820504] border-0"
            >
              {cause.category}
            </Badge>
          </div>
          <div className="text-xs font-medium text-gray-700 mb-2">
            Organized by{" "}
            <span className="text-[#820504]">{cause.username}</span>
          </div>
          <CardDescription className="text-sm text-gray-600 leading-relaxed">
            {cause.short_description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1 mb-3">
            {
              //cause.tags.map((tag: string, index: number) => (
              // <Badge
              //   key={index}
              //   variant="outline"
              //   className="text-xs border-[#dca92c] text-[#dca92c]"
              // >
              //   {tag}
              // </Badge>
              // ))
            }
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="flex items-center text-xs text-gray-600">
              <Users className="w-3 h-3 mr-2 text-[#820504] flex-shrink-0" />
              <span>
                {cause.volunteer_count}/{cause.max_volunteers} volunteers
              </span>
            </div>
            <div className="flex items-center text-xs text-gray-600">
              <MapPin className="w-3 h-3 mr-2 text-[#820504] flex-shrink-0" />
              <span className="truncate">{getLocationDisplay()}</span>
            </div>
            {showDate && (
              <div className="flex items-center text-xs text-gray-600 col-span-2">
                <Clock className="w-3 h-3 mr-2 text-[#820504] flex-shrink-0" />
                <span className="text-xs">
                  {formatDateRange(cause.start_date, cause.end_date)}
                </span>
              </div>
            )}
            <div className="flex items-center text-xs text-gray-600 col-span-2">
              <Users className="w-3 h-3 mr-2 text-[#820504] flex-shrink-0" />
              <span>Days available: {cause.preferred_days}</span>
            </div>
          </div>

          <Progress
            value={(cause.volunteer_count / cause.max_volunteers) * 100}
            className="mb-4 h-2"
          />

          <div className="flex gap-2">
            <Button
              onClick={
                cause.user_is_joined ? () => setLeaveOpen(true) : onJoinCause
              }
              className={`flex-1 rounded-full font-medium ${
                cause.user_is_joined
                  ? "bg-gray-500 hover:bg-red-600 text-white"
                  : "bg-[#820504] hover:bg-[#6d0403] text-white"
              }`}
              title={cause.user_is_joined ? "Leave cause" : "Join cause"}
            >
              {cause.user_is_joined ? "Cause Joined" : "Join Cause"}
            </Button>
            <Button
              onClick={onViewDetails}
              variant="outline"
              className="px-4 border-[#820504] text-[#820504] hover:bg-[#820504] hover:text-white rounded-full bg-transparent"
            >
              View Details
            </Button>
          </div>
          {/* Leave confirmation dialog (mobile) */}
          <AlertDialog open={leaveOpen} onOpenChange={setLeaveOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Leave this cause?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to leave "{cause.title}"?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => {
                    setLeaveOpen(false);
                    onLeaveCause?.();
                  }}
                >
                  Leave Cause
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
