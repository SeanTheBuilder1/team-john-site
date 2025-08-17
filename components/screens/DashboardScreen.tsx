import { useState, useEffect } from "react";
import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CauseCard from "@/components/cards/CauseCard";
import { useAuth } from "@/components/AuthProvider";
import api_link from "@/components/api_link";
import { toast } from "sonner";

// Sample user causes data with updated location information
// const userCauses = [
//   {
//     id: 1,
//     title: "Campus Cleanup Drive",
//     shortDescription:
//       "Join us in keeping our beloved PUP campus clean and green.",
//     description:
//       "Join us in keeping our beloved PUP campus clean and green. Let's work together for a better environment! This comprehensive cleanup initiative will cover all areas of the main campus, including classrooms, corridors, outdoor spaces, and common areas. Volunteers will be provided with all necessary cleaning supplies and equipment. We'll also be implementing a waste segregation system and setting up recycling stations throughout the campus. This is more than just cleaning - it's about creating a sustainable culture of environmental responsibility among our PUP community.",
//     category: "Environment",
//     volunteers: 12,
//     maxVolunteers: 20,
//     dateStart: "March 15, 2024",
//     dateEnd: "March 17, 2024",
//     preferredDays: "F/S/Su",
//     location: "",
//     campus: "Sta. Mesa",
//     tags: ["Cleanup", "Environment", "Campus"],
//     status: "active",
//     role: "Organizer",
//     organizerType: "organization",
//     organizer: {
//       name: "Juan Dela Cruz",
//       id: "2021-12345-MN-0",
//       course: "BS Computer Science",
//     },
//   },
//   {
//     id: 4,
//     title: "Book Donation Drive",
//     shortDescription: "Help provide books to underprivileged students.",
//     description:
//       "Help provide books to underprivileged students by donating your used textbooks and educational materials. This initiative aims to create a sustainable cycle of learning resources within our PUP community. We collect books from various subjects and distribute them to students who cannot afford new textbooks. Every donated book makes a difference in someone's educational journey.",
//     category: "Education",
//     volunteers: 8,
//     maxVolunteers: 15,
//     dateStart: "March 10, 2024",
//     dateEnd: "March 12, 2024",
//     preferredDays: "M/T/W",
//     location: "Library Building A",
//     campus: "Taguig",
//     tags: ["Books", "Education", "Donation"],
//     status: "completed",
//     role: "Organizer",
//     organizerType: "student",
//     organizer: {
//       name: "Juan Dela Cruz",
//       id: "2021-12345-MN-0",
//       course: "BS Computer Science",
//     },
//   },
// ];
//
// const joinedCauses = [
//   {
//     id: 2,
//     title: "Free Tutoring for Math",
//     shortDescription: "Help fellow students excel in mathematics.",
//     description:
//       "Help fellow students excel in mathematics by providing free tutoring sessions. Share your knowledge and make a difference in someone's academic journey. This program focuses on helping struggling students in various math subjects including Algebra, Calculus, Statistics, and Geometry. Tutors will work one-on-one or in small groups to provide personalized assistance. We believe that peer-to-peer learning creates a supportive environment where students feel comfortable asking questions and learning at their own pace. All materials and study guides will be provided.",
//     category: "Education",
//     volunteers: 8,
//     maxVolunteers: 15,
//     dateStart: "March 18, 2024",
//     dateEnd: "April 18, 2024",
//     preferredDays: "M/W/F",
//     location: "Library Study Hall",
//     campus: "Parañaque",
//     tags: ["Tutoring", "Math", "Education"],
//     status: "active",
//     role: "Volunteer",
//     organizerType: "student",
//     organizer: {
//       name: "Carlos Rodriguez",
//       id: "2019-22222-MN-0",
//       course: "BS Mathematics",
//     },
//   },
// ];

interface DashboardScreenProps {
  user: any;
  handleJoinCause: any;
  onViewCause: (cause: any) => void;
  onNavigateToHome: () => void;
  onNavigateToCreate: () => void;
  isDesktop: boolean;
  triggerUpdate: boolean;
}

interface CauseProps {
  cause_id: number;
  title: string;
  short_description: string;
  category: string;
  organizer_type: string;
  start_date: string;
  end_date: string;
  preferred_days: string;
  max_volunteers: number;
  username: string;
  volunteer_count: number;
}

export default function DashboardScreen({
  user,
  onViewCause,
  onNavigateToHome,
  onNavigateToCreate,
  isDesktop,
  handleJoinCause,
  triggerUpdate,
}: DashboardScreenProps) {
  const { refresh } = useAuth();
  const [activeTab, setActiveTab] = useState("my-causes");

  const handleViewDetails = (cause: any) => {
    onViewCause(cause);
  };
  const [userCauses, setUserCauses] = useState<CauseProps[]>([]);
  const [joinedCauses, setJoinedCauses] = useState<CauseProps[]>([]);

  useEffect(() => {
    (async () => {
      const response = await fetch(api_link + "/api/get-user-causes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
        credentials: "include",
      });
      if (response.status == 401) {
        await refresh();
        const response = await fetch(api_link + "/api/get-user-causes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
          credentials: "include",
        });
        if (response.status != 200) {
          return;
        }
        const { message: new_message, causes: new_causes } =
          await response.json();
        setUserCauses(new_causes);
        return;
      } else if (response.status != 200) {
        return;
      }
      const { message, causes } = await response.json();
      setUserCauses(causes);
    })();
    (async () => {
      const response = await fetch(api_link + "/api/get-joined-causes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
        credentials: "include",
      });
      if (response.status != 200) {
        return;
      }
      const { message, causes } = await response.json();
      setJoinedCauses(causes);
    })();
  }, [triggerUpdate]);

  if (isDesktop) {
    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold text-[#820504] mb-8">My Dashboard</h2>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 bg-gray-100 rounded-2xl p-1 h-12">
            <TabsTrigger
              value="my-causes"
              className="rounded-xl data-[state=active]:bg-[#820504] data-[state=active]:text-white font-medium"
            >
              My Causes ({userCauses.length})
            </TabsTrigger>
            <TabsTrigger
              value="joined"
              className="rounded-xl data-[state=active]:bg-[#820504] data-[state=active]:text-white font-medium"
            >
              Joined ({joinedCauses.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-causes">
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
              {userCauses.map((cause) => (
                <CauseCard
                  key={cause.cause_id}
                  cause={cause}
                  onViewDetails={() => handleViewDetails(cause)}
                  onJoinCause={() => handleJoinCause(cause.cause_id)}
                  // showDate={true}
                  isDesktop={true}
                />
              ))}
            </div>

            {userCauses.length === 0 && (
              <div className="text-center py-16">
                <Plus className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <p className="text-gray-500 mb-6 text-lg">
                  You haven't created any causes yet.
                </p>
                <Button
                  onClick={onNavigateToCreate}
                  className="bg-[#820504] hover:bg-[#6d0403] text-white rounded-2xl px-8 py-3"
                >
                  Create Your First Cause
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="joined">
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
              {joinedCauses.map((cause) => (
                <CauseCard
                  key={cause.cause_id}
                  cause={cause}
                  onViewDetails={() => handleViewDetails(cause)}
                  onJoinCause={() => handleJoinCause(cause.cause_id)}
                  onLeaveCause={() => {
                    // Simulate: remove from joined list
                    setJoinedCauses((prev) =>
                      prev.filter((c) => c.cause_id !== cause.cause_id),
                    );
                    toast.success("Cause left successfully");
                  }}
                  // showDate={true}
                  isDesktop={true}
                />
              ))}
            </div>

            {joinedCauses.length === 0 && (
              <div className="text-center py-16">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <p className="text-gray-500 mb-6 text-lg">
                  You haven't joined any causes yet.
                </p>
                <Button
                  onClick={onNavigateToHome}
                  className="bg-[#820504] hover:bg-[#6d0403] text-white rounded-2xl px-8 py-3"
                >
                  Explore Causes
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Mobile layout (existing)
  return (
    <div className="p-6 pb-20">
      <h2 className="text-2xl font-bold text-[#820504] mb-6">My Dashboard</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 rounded-full p-1">
          <TabsTrigger
            value="my-causes"
            className="rounded-full data-[state=active]:bg-[#820504] data-[state=active]:text-white"
          >
            My Causes ({userCauses.length})
          </TabsTrigger>
          <TabsTrigger
            value="joined"
            className="rounded-full data-[state=active]:bg-[#820504] data-[state=active]:text-white"
          >
            Joined ({joinedCauses.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-causes" className="space-y-4">
          {userCauses.map((cause) => (
            <CauseCard
              key={cause.cause_id}
              cause={cause}
              onViewDetails={() => handleViewDetails(cause)}
              onJoinCause={() => handleJoinCause(cause.cause_id)}
              // showDate={true}
              isDesktop={false}
            />
          ))}

          {userCauses.length === 0 && (
            <div className="text-center py-8">
              <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                You haven't created any causes yet.
              </p>
              <Button
                onClick={onNavigateToCreate}
                className="bg-[#820504] hover:bg-[#6d0403] text-white rounded-full"
              >
                Create Your First Cause
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="joined" className="space-y-4">
          {joinedCauses.map((cause) => (
            <CauseCard
              key={cause.cause_id}
              cause={cause}
              onViewDetails={() => handleViewDetails(cause)}
              onJoinCause={() => handleJoinCause(cause.cause_id)}
              onLeaveCause={() => {
                setJoinedCauses((prev) =>
                  prev.filter((c) => c.cause_id !== cause.cause_id),
                );
                toast.success("Cause left successfully");
              }}
              // showDate={true}
              isDesktop={false}
            />
          ))}

          {joinedCauses.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                You haven't joined any causes yet.
              </p>
              <Button
                onClick={onNavigateToHome}
                className="mt-4 bg-[#820504] hover:bg-[#6d0403] text-white rounded-full"
              >
                Explore Causes
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
