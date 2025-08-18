import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import CauseCard from "@/components/cards/CauseCard";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/components/AuthProvider";
import api_link from "@/components/api_link";

// Sample data with updated location information
const causes = [
  {
    id: 1,
    title: "Campus Cleanup Drive",
    shortDescription:
      "Join us in keeping our beloved PUP campus clean and green. Let's work together for a better environment!",
    description:
      "Join us in keeping our beloved PUP campus clean and green. Let's work together for a better environment! This comprehensive cleanup initiative will cover all areas of the main campus, including classrooms, corridors, outdoor spaces, and common areas. Volunteers will be provided with all necessary cleaning supplies and equipment. We'll also be implementing a waste segregation system and setting up recycling stations throughout the campus. This is more than just cleaning - it's about creating a sustainable culture of environmental responsibility among our PUP community.",
    category: "Environment",
    volunteers: 12,
    maxVolunteers: 20,
    dateStart: "March 15, 2024",
    dateEnd: "March 17, 2024",
    preferredDays: "F/S/Su",
    location: "",
    campus: "Sta. Mesa",
    tags: ["#Cleanup", "#Environment", "#Campus"],
    status: "active",
    organizerType: "organization",
    organizer: {
      name: "Environmental Club",
      id: "ORG-002",
      course: "Student Organization",
    },
    progressUpdates: [
      {
        id: 1,
        date: "March 10, 2024",
        update:
          "Cleaning supplies have been secured! We're ready for the big day.",
        author: "Environmental Club",
      },
    ],
    comments: [
      {
        id: 1,
        author: "Juan Dela Cruz",
        date: "March 12, 2024",
        comment: "Count me in! This is exactly what our campus needs.",
        replies: [
          {
            id: 2,
            author: "Environmental Club",
            date: "March 12, 2024",
            comment:
              "Thank you for joining! We really appreciate your support.",
          },
        ],
      },
    ],
    joinedUsers: [
      { name: "Juan Dela Cruz", course: "BS Computer Science" },
      { name: "Ana Reyes", course: "BS Biology" },
      { name: "Carlos Rodriguez", course: "BS Mathematics" },
      { name: "Lisa Chen", course: "BS Veterinary Medicine" },
      { name: "Miguel Torres", course: "BS Engineering" },
      { name: "Sofia Gonzalez", course: "BS Psychology" },
      { name: "David Kim", course: "BS Information Technology" },
      { name: "Elena Morales", course: "BS Nursing" },
    ],
  },
  {
    id: 2,
    title: "Free Tutoring for Math",
    shortDescription:
      "Help fellow students excel in mathematics. Share your knowledge and make a difference in someone's academic journey.",
    description:
      "Help fellow students excel in mathematics by providing free tutoring sessions. Share your knowledge and make a difference in someone's academic journey. This program focuses on helping struggling students in various math subjects including Algebra, Calculus, Statistics, and Geometry. Tutors will work one-on-one or in small groups to provide personalized assistance. We believe that peer-to-peer learning creates a supportive environment where students feel comfortable asking questions and learning at their own pace. All materials and study guides will be provided.",
    category: "Education",
    volunteers: 8,
    maxVolunteers: 15,
    dateStart: "March 18, 2024",
    dateEnd: "April 18, 2024",
    preferredDays: "M/W/F",
    location: "Library Study Hall",
    campus: "Taguig",
    tags: ["#Tutoring", "#Math", "#Education"],
    status: "active",
    organizerType: "student",
    organizer: {
      name: "Carlos Rodriguez",
      id: "2019-22222-MN-0",
      course: "BS Mathematics",
    },
    progressUpdates: [],
    comments: [],
    joinedUsers: [
      { name: "Ana Reyes", course: "BS Biology" },
      { name: "Miguel Torres", course: "BS Engineering" },
    ],
  },
  {
    id: 3,
    title: "Stray Cat Feeding Program",
    shortDescription:
      "Show compassion to our furry friends around campus. Help us provide food and care for stray cats.",
    description:
      "Show compassion to our furry friends around campus by joining our comprehensive stray cat feeding program. Help us provide food and care for stray cats while also working towards long-term solutions for their welfare. This program involves daily feeding schedules, basic health monitoring, and coordination with local veterinarians for medical care when needed. We also work on creating safe shelter spaces and collaborate with animal welfare organizations for potential adoption programs. Volunteers will be trained on proper animal handling and feeding procedures.",
    category: "Animal Care",
    volunteers: 15,
    maxVolunteers: 25,
    dateStart: "March 20, 2024",
    dateEnd: "June 20, 2024",
    preferredDays: "M/T/W/Th/F",
    location: "Campus Grounds and nearby areas",
    campus: "Parañaque",
    tags: ["#AnimalCare", "#Feeding", "#Compassion"],
    status: "active",
    organizerType: "student",
    organizer: {
      name: "Lisa Chen",
      id: "2021-33333-MN-0",
      course: "BS Veterinary Medicine",
    },
    progressUpdates: [],
    comments: [],
    joinedUsers: [
      { name: "Sofia Gonzalez", course: "BS Psychology" },
      { name: "David Kim", course: "BS Information Technology" },
      { name: "Elena Morales", course: "BS Nursing" },
    ],
  },
  {
    id: 4,
    title: "Mental Health Awareness Workshop",
    shortDescription:
      "Join us for an important discussion about mental health awareness and support systems for students.",
    description:
      "Join us for an important and comprehensive discussion about mental health awareness and support systems specifically designed for students. This workshop series will cover topics such as stress management, anxiety coping strategies, depression awareness, and building resilience. We'll have licensed mental health professionals leading sessions, interactive activities, and peer support groups. The program also includes training for students to become mental health advocates in their respective colleges. All sessions are confidential and designed to create a safe, supportive environment for learning and sharing.",
    category: "Health",
    volunteers: 6,
    maxVolunteers: 30,
    dateStart: "March 22, 2024",
    dateEnd: "March 24, 2024",
    preferredDays: "F/S/Su",
    location: "",
    campus: "Bataan",
    tags: ["#MentalHealth", "#Workshop", "#Awareness"],
    status: "active",
    organizerType: "other",
    organizer: {
      name: "Dr. Patricia Reyes",
      id: "FACULTY-001",
      course: "Psychology Department Faculty",
    },
    progressUpdates: [],
    comments: [],
    joinedUsers: [],
  },
  {
    id: 5,
    title: "Blood Donation Drive",
    shortDescription:
      "Help save lives by donating blood. Every donation can help save up to three lives.",
    description:
      "Help save lives by participating in our comprehensive blood donation drive. Every donation can help save up to three lives, making this one of the most impactful ways to contribute to your community. This drive is organized in partnership with the Philippine Red Cross and follows all safety protocols and medical standards. We'll have medical professionals on-site to ensure donor safety and comfort. The event includes pre-donation screening, the donation process, and post-donation care with refreshments. We also provide educational materials about blood donation and its importance in emergency medical care.",
    category: "Health",
    volunteers: 20,
    maxVolunteers: 50,
    dateStart: "March 25, 2024",
    dateEnd: "March 25, 2024",
    preferredDays: "M",
    location: "Gymnasium Building A",
    campus: "Sta. Mesa",
    tags: ["#BloodDonation", "#Health", "#SaveLives"],
    status: "active",
    organizerType: "organization",
    organizer: {
      name: "Red Cross PUP Chapter",
      id: "ORG-001",
      course: "Student Organization",
    },
    progressUpdates: [],
    comments: [],
    joinedUsers: [],
  },
  {
    id: 6,
    title: "Tree Planting Initiative",
    shortDescription:
      "Help make our campus greener by planting trees around the university grounds.",
    description:
      "Help make our campus greener and more sustainable by participating in our comprehensive tree planting initiative around the university grounds. This environmental project aims to plant over 100 native trees across various areas of the campus to improve air quality, provide shade, and enhance the overall campus environment. Volunteers will learn about different tree species, proper planting techniques, and ongoing tree care. We'll also be creating a campus tree map and establishing a maintenance schedule to ensure the long-term success of our planted trees. This initiative is part of our larger sustainability program.",
    category: "Environment",
    volunteers: 18,
    maxVolunteers: 40,
    dateStart: "March 28, 2024",
    dateEnd: "March 30, 2024",
    preferredDays: "Th/F/S",
    location: "",
    campus: "Biñan",
    tags: ["#TreePlanting", "#Environment", "#Green"],
    status: "active",
    organizerType: "organization",
    organizer: {
      name: "Environmental Club",
      id: "ORG-002",
      course: "Student Organization",
    },
    progressUpdates: [],
    comments: [],
    joinedUsers: [],
  },
];

interface HomeScreenProps {
  user: any;
  onViewCause: (cause: any) => void;
  isDesktop: boolean;
  handleJoinCause: any;
  handleLeaveCause: any;
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
  created_at: string;
}

export default function HomeScreen({
  user,
  onViewCause,
  isDesktop,
  handleJoinCause,
  handleLeaveCause,
  triggerUpdate,
}: HomeScreenProps) {
  const { refresh } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [activeCauses, setActiveCauses] = useState<CauseProps[]>([]);

  useEffect(() => {
    (async () => {
      const response = await fetch(api_link + "/api/get-active-causes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
        credentials: "include",
      });
      if (response.status == 401) {
        await refresh();
        const new_response = await fetch(api_link + "/api/get-active-causes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
          credentials: "include",
        });
        if (new_response.status != 200) {
          return;
        }
        const { message: new_message, causes: new_causes } =
          await new_response.json();
        setActiveCauses(new_causes);
        return;
      } else if (response.status != 200) {
        return;
      }
      const { message, causes } = await response.json();
      setActiveCauses(causes);
    })();
  }, [triggerUpdate]);

  const sortedAndFilteredCauses = activeCauses
    .filter((cause) => {
      const matchesSearch =
        cause.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cause.short_description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        cause.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cause.username.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "most-volunteers":
          return b.volunteer_count - a.volunteer_count;
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  if (isDesktop) {
    return (
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#820504] mb-2">
            Kamusta, {user.name.split(" ")[0]}?
          </h1>
          <p className="text-gray-600 text-lg">
            Sayo nagsisimula ang pagbabago!
          </p>
        </div>

        {/* Search and Sort */}
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search causes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 rounded-2xl border-gray-300 focus:border-[#820504] focus:ring-[#820504] text-base"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48 rounded-2xl border-[#820504] text-[#820504] py-3">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="most-volunteers">Most Volunteers</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Causes Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#820504]">Active Causes</h2>
          <Badge
            variant="secondary"
            className="bg-[#fede0d]/20 text-[#820504] px-4 py-2 text-sm"
          >
            {sortedAndFilteredCauses.length} active
          </Badge>
        </div>

        {/* Desktop Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
          {sortedAndFilteredCauses.map((cause) => (
            <CauseCard
              key={cause.cause_id}
              cause={cause}
              onViewDetails={() => onViewCause(cause)}
              onJoinCause={() => handleJoinCause(cause.cause_id)}
              onLeaveCause={() => handleLeaveCause(cause.cause_id)}
              isDesktop={true}
            />
          ))}
        </div>

        {sortedAndFilteredCauses.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No causes found matching your criteria.
            </p>
          </div>
        )}
      </div>
    );
  }

  // Mobile Layout (existing)
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#820504] mb-2">
          Kamusta, {user.name.split(" ")[0]}?
        </h1>
        <p className="text-gray-600">Sayo nagsisimula ang pagbabago!</p>
      </div>

      {/* Search and Sort */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search causes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-full border-gray-300 focus:border-[#820504] focus:ring-[#820504]"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40 rounded-full border-[#820504] text-[#820504]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="most-volunteers">Most Volunteers</SelectItem>
            <SelectItem value="category">Category</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Causes Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#820504]">Active Causes</h2>
        <Badge variant="secondary" className="bg-[#fede0d]/20 text-[#820504]">
          {sortedAndFilteredCauses.length} active
        </Badge>
      </div>

      {/* Mobile List Layout */}
      <div className="space-y-4">
        {sortedAndFilteredCauses.map((cause) => (
          <CauseCard
            key={cause.cause_id}
            cause={cause}
            onViewDetails={() => onViewCause(cause)}
            onJoinCause={() => handleJoinCause(cause.cause_id)}
            onLeaveCause={() => handleLeaveCause(cause.cause_id)}
            isDesktop={false}
          />
        ))}
      </div>

      {sortedAndFilteredCauses.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No causes found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
