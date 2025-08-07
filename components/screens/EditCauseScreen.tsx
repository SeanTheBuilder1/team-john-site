import type React from "react";

import { useState, useEffect } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/AuthProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import api_link from "@/components/api_link";

interface EditCauseScreenProps {
  cause_id: any;
  user: any;
  onBack: () => void;
}

export default function EditCauseScreen({
  onBack,
  user,
  cause_id,
}: EditCauseScreenProps) {
  const { refresh } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    detailedDescription: "",
    category: "",
    dateStart: "",
    dateEnd: "",
    preferredDays: [] as string[],
    location: "",
    campus: "",
    coordinates: null as { lat: number; lng: number } | null,
    maxVolunteers: "",
    organizerType: "",
    otherOrganizerType: "",
  });

  const [showOtherInput, setShowOtherInput] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 14.5995, lng: 120.9842 }); // Manila coordinates

  const [cause, setCause] = useState<any>(null);
  useEffect(() => {
    if (!cause_id) {
      setCause(null);
    }
    (async () => {
      const response = await fetch(api_link + "/api/get-cause-detailed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cause_id: cause_id,
        }),
        credentials: "include",
      });
      if (response.status == 401) {
        await refresh();
        const response = await fetch(api_link + "/api/get-cause-detailed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cause_id: cause_id,
          }),
          credentials: "include",
        });
        if (response.status != 200) {
          const { message: error_msg } = await response.json();
          toast.error(error_msg);
          return;
        }
        const { message: new_message, cause: new_cause } =
          await response.json();
        setCause(new_cause);
        setFormDataFromCause(new_cause);
        return;
      } else if (response.status != 200) {
        const { message: error_msg } = await response.json();
        toast.error(error_msg);
        return;
      }
      const { message, cause } = await response.json();
      setCause(cause);
      setFormDataFromCause(cause);
    })();
  }, [cause_id]);
  const processWeekDayTable = (weekday_table: string): Set<string> => {
    const result = weekday_table.toLowerCase();
    const day_set = new Set<string>();
    for (let i = 0; i < result.length; ++i) {
      if (result[i] === "m") {
        day_set.add("monday");
      } else if (result[i] === "t") {
        if (i + 1 < result.length && result[i + 1] === "h") {
          day_set.add("thursday");
          i += 1;
        } else {
          day_set.add("tuesday");
        }
      } else if (result[i] === "w") {
        day_set.add("wednesday");
      } else if (result[i] === "f") {
        day_set.add("friday");
      } else if (result[i] === "s") {
        if (i + 1 < result.length && result[i + 1] === "u") {
          day_set.add("sunday");
          i += 1;
        } else {
          day_set.add("saturday");
        }
      }
    }
    return day_set;
  };
  const setFormDataFromCause = (cause: any) => {
    const day_array = cause?.preferred_days
      ? Array.from(processWeekDayTable(cause.preferred_days))
      : [];
    const date_start = cause?.start_date
      ? new Date(cause.start_date).toISOString().substring(0, 10)
      : "";
    const date_end = cause?.end_date
      ? new Date(cause.end_date).toISOString().substring(0, 10)
      : "";
    setFormData({
      title: cause?.title ?? "",
      shortDescription: cause?.short_description ?? "",
      detailedDescription: cause?.detailed_description ?? "",
      category: cause?.category ?? "",
      dateStart: date_start,
      dateEnd: date_end,
      preferredDays: day_array,
      location: cause?.location ?? "",
      campus: cause?.campus ?? "",
      coordinates: null as { lat: number; lng: number } | null,
      maxVolunteers: cause.max_volunteers.toString() ?? "",
      organizerType: cause.organizer_type ?? "",
      otherOrganizerType: "",
    });
  };

  const dayAbbreviations: { [key: string]: string } = {
    monday: "M",
    tuesday: "T",
    wednesday: "W",
    thursday: "Th",
    friday: "F",
    saturday: "S",
    sunday: "Su",
  };

  const handleDayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredDays: prev.preferredDays.includes(day)
        ? prev.preferredDays.filter((d) => d !== day)
        : [...prev.preferredDays, day],
    }));
  };

  const getPreferredDaysDisplay = () => {
    return formData.preferredDays.map((day) => dayAbbreviations[day]).join("");
  };

  const getPreferredDaysString = () => {
    let days = "";
    if (formData.preferredDays.includes("monday")) {
      days += "M";
    }
    if (formData.preferredDays.includes("tuesday")) {
      days += "T";
    }
    if (formData.preferredDays.includes("wednesday")) {
      days += "W";
    }
    if (formData.preferredDays.includes("thursday")) {
      days += "Th";
    }
    if (formData.preferredDays.includes("friday")) {
      days += "F";
    }
    if (formData.preferredDays.includes("saturday")) {
      days += "S";
    }
    if (formData.preferredDays.includes("sunday")) {
      days += "Su";
    }
    return days;
  };

  const handleOrganizerTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      organizerType: value,
      otherOrganizerType: "",
    }));
    setShowOtherInput(value === "other");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.campus && !formData.location) {
      alert("Please select a campus or provide a specific location address.");
      return;
    }
    setIsSubmitting(true);

    const response = await fetch(api_link + "/api/edit-cause", {
      method: "POST",
      body: JSON.stringify({
        title: formData.title,
        short_description: formData.shortDescription,
        detailed_description: formData.detailedDescription,
        category: formData.category,
        organizer_type: formData.organizerType,
        start_date: formData.dateStart,
        end_date: formData.dateEnd,
        preferred_days: getPreferredDaysString(),
        max_volunteers: Number(formData.maxVolunteers),
        campus: formData.campus,
        address: formData.location,
        cause_id: cause_id,
      }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (response.status == 401) {
      await refresh();
      const new_response = await fetch(api_link + "/api/submit-cause", {
        method: "POST",
        body: JSON.stringify({
          title: formData.title,
          short_description: formData.shortDescription,
          detailed_description: formData.detailedDescription,
          category: formData.category,
          organizer_type: formData.organizerType,
          start_date: formData.dateStart,
          end_date: formData.dateEnd,
          preferred_days: getPreferredDaysString(),
          max_volunteers: Number(formData.maxVolunteers),
          campus: formData.campus,
          address: formData.location,
          cause_id: cause_id,
        }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const { message: new_message } = await new_response.json();
      setIsSubmitting(false);
      if (new_response.status == 200) {
        onBack();
      } else {
        toast.error(new_message);
      }
    }
    const { message } = await response.json();
    setIsSubmitting(false);
    if (response.status == 200) {
      onBack();
    } else {
      toast.error(message);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 lg:p-6">
        <div className="max-w-4xl mx-auto flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mr-3 text-[#820504] hover:bg-[#820504]/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl lg:text-2xl font-bold text-[#820504]">
            Edit Cause
          </h1>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="max-w-4xl mx-auto p-8">
          <Card className="border-0 shadow-lg rounded-3xl">
            <CardHeader className="p-8">
              <CardTitle className="text-2xl text-[#820504] mb-2">
                Modify the contents of your cause
              </CardTitle>
              <p className="text-gray-600 text-lg">
                Apply corrections to the details of your cause.
              </p>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <Label
                        htmlFor="title"
                        className="text-[#820504] font-semibold text-base mb-3 block"
                      >
                        Cause Title *
                      </Label>
                      <Input
                        id="title"
                        placeholder="Enter your cause title"
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        className="border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-2xl py-3 px-4 text-base"
                        required
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="shortDescription"
                        className="text-[#820504] font-semibold text-base mb-3 block"
                      >
                        Short Description *
                      </Label>
                      <Textarea
                        id="shortDescription"
                        placeholder="Brief description for the discover causes page (max 150 characters)"
                        value={formData.shortDescription}
                        onChange={(e) =>
                          handleInputChange("shortDescription", e.target.value)
                        }
                        className="border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-2xl py-3 px-4 text-base"
                        rows={2}
                        maxLength={150}
                        required
                      />
                      <div className="text-sm text-gray-500 mt-1">
                        {formData.shortDescription.length}/150 characters
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="category"
                        className="text-[#820504] font-semibold text-base mb-3 block"
                      >
                        Category *
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          handleInputChange("category", value)
                        }
                        required
                      >
                        <SelectTrigger className="border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-2xl py-3 px-4 text-base">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Environment">
                            Environment
                          </SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Animal Care">
                            Animal Care
                          </SelectItem>
                          <SelectItem value="Community Service">
                            Community Service
                          </SelectItem>
                          <SelectItem value="Health & Wellness">
                            Health & Wellness
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-[#820504] font-semibold text-base mb-3 block">
                        Organizer Type *
                      </Label>
                      <div className="flex gap-3 mb-3">
                        <Button
                          type="button"
                          variant={
                            formData.organizerType === "student"
                              ? "default"
                              : "outline"
                          }
                          onClick={() => handleOrganizerTypeChange("student")}
                          className={`flex-1 rounded-2xl py-3 ${
                            formData.organizerType === "student"
                              ? "bg-[#820504] hover:bg-[#6d0403] text-white"
                              : "border-gray-300 text-gray-700 hover:bg-gray-100 bg-gray-50"
                          }`}
                        >
                          Student
                        </Button>
                        <Button
                          type="button"
                          variant={
                            formData.organizerType === "organization"
                              ? "default"
                              : "outline"
                          }
                          onClick={() =>
                            handleOrganizerTypeChange("organization")
                          }
                          className={`flex-1 rounded-2xl py-3 ${
                            formData.organizerType === "organization"
                              ? "bg-[#820504] hover:bg-[#6d0403] text-white"
                              : "border-gray-300 text-gray-700 hover:bg-gray-100 bg-gray-50"
                          }`}
                        >
                          Organization
                        </Button>
                        <Button
                          type="button"
                          variant={
                            formData.organizerType === "other"
                              ? "default"
                              : "outline"
                          }
                          onClick={() => handleOrganizerTypeChange("other")}
                          className={`flex-1 rounded-2xl py-3 ${
                            formData.organizerType === "other"
                              ? "bg-[#820504] hover:bg-[#6d0403] text-white"
                              : "border-gray-300 text-gray-700 hover:bg-gray-100 bg-gray-50"
                          }`}
                        >
                          Other
                        </Button>
                      </div>
                      {showOtherInput && (
                        <Input
                          placeholder="Please specify your organizer type"
                          value={formData.otherOrganizerType}
                          onChange={(e) =>
                            handleInputChange(
                              "otherOrganizerType",
                              e.target.value,
                            )
                          }
                          className="border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-2xl py-3 px-4 text-base"
                          required
                        />
                      )}
                    </div>

                    <div>
                      <Label className="text-[#820504] font-semibold text-base mb-3 block">
                        Timeframe *
                      </Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="dateStart"
                            className="text-sm text-gray-600 mb-2 block"
                          >
                            Start Date
                          </Label>
                          <Input
                            id="dateStart"
                            type="date"
                            value={formData.dateStart}
                            onChange={(e) =>
                              handleInputChange("dateStart", e.target.value)
                            }
                            className="border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-2xl py-3 px-4 text-base"
                            required
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="dateEnd"
                            className="text-sm text-gray-600 mb-2 block"
                          >
                            End Date
                          </Label>
                          <Input
                            id="dateEnd"
                            type="date"
                            value={formData.dateEnd}
                            onChange={(e) =>
                              handleInputChange("dateEnd", e.target.value)
                            }
                            className="border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-2xl py-3 px-4 text-base"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-[#820504] font-semibold text-base mb-3 block">
                        Preferred Days *
                      </Label>
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        {Object.entries(dayAbbreviations).map(([day, abbr]) => (
                          <Button
                            key={day}
                            type="button"
                            variant={
                              formData.preferredDays.includes(day)
                                ? "default"
                                : "outline"
                            }
                            onClick={() => handleDayToggle(day)}
                            className={`rounded-2xl py-2 text-sm ${
                              formData.preferredDays.includes(day)
                                ? "bg-[#820504] hover:bg-[#6d0403] text-white"
                                : "border-gray-300 text-gray-700 hover:bg-gray-100 bg-gray-50"
                            }`}
                          >
                            {abbr}
                          </Button>
                        ))}
                      </div>
                      {formData.preferredDays.length > 0 && (
                        <div className="text-sm text-gray-600">
                          Selected: {getPreferredDaysString()}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label
                        htmlFor="maxVolunteers"
                        className="text-[#820504] font-semibold text-base mb-3 block"
                      >
                        Maximum Volunteers *
                      </Label>
                      <Input
                        id="maxVolunteers"
                        type="number"
                        placeholder="How many volunteers do you need?"
                        value={formData.maxVolunteers}
                        onChange={(e) =>
                          handleInputChange("maxVolunteers", e.target.value)
                        }
                        className="border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-2xl py-3 px-4 text-base"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div>
                      <Label
                        htmlFor="detailedDescription"
                        className="text-[#820504] font-semibold text-base mb-3 block"
                      >
                        Detailed Description *
                      </Label>
                      <Textarea
                        id="detailedDescription"
                        placeholder="Detailed description for the cause details page. Describe your cause and its impact. What will volunteers be doing? Why is this important?"
                        value={formData.detailedDescription}
                        onChange={(e) =>
                          handleInputChange(
                            "detailedDescription",
                            e.target.value,
                          )
                        }
                        className="border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-2xl py-3 px-4 text-base h-64"
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-[#820504] font-semibold text-base mb-3 block">
                        Location Type *
                      </Label>
                      <div className="space-y-4">
                        <div>
                          <Label
                            htmlFor="campus"
                            className="text-sm text-gray-600 mb-2 block"
                          >
                            Campus (Optional)
                          </Label>
                          <Select
                            value={formData.campus}
                            onValueChange={(value) =>
                              handleInputChange("campus", value)
                            }
                          >
                            <SelectTrigger className="border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-2xl py-3 px-4 text-base">
                              <SelectValue placeholder="Select a campus (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Sta. Mesa">
                                Sta. Mesa
                              </SelectItem>
                              <SelectItem value="Taguig">Taguig</SelectItem>
                              <SelectItem value="San Juan">San Juan</SelectItem>
                              <SelectItem value="Parañaque">
                                Parañaque
                              </SelectItem>
                              <SelectItem value="Bataan">Bataan</SelectItem>
                              <SelectItem value="Sta. Maria">
                                Sta. Maria
                              </SelectItem>
                              <SelectItem value="Pulilan">Pulilan</SelectItem>
                              <SelectItem value="Cabiao">Cabiao</SelectItem>
                              <SelectItem value="Lopez">Lopez</SelectItem>
                              <SelectItem value="Mulanay">Mulanay</SelectItem>
                              <SelectItem value="General Luna">
                                General Luna
                              </SelectItem>
                              <SelectItem value="Unisan">Unisan</SelectItem>
                              <SelectItem value="Ragay">Ragay</SelectItem>
                              <SelectItem value="Sto. Tomas">
                                Sto. Tomas
                              </SelectItem>
                              <SelectItem value="Maragondon">
                                Maragondon
                              </SelectItem>
                              <SelectItem value="Alfonso">Alfonso</SelectItem>
                              <SelectItem value="Bansud">Bansud</SelectItem>
                              <SelectItem value="Sablayan">Sablayan</SelectItem>
                              <SelectItem value="Biñan">Biñan</SelectItem>
                              <SelectItem value="San Pedro">
                                San Pedro
                              </SelectItem>
                              <SelectItem value="Sta. Rosa">
                                Sta. Rosa
                              </SelectItem>
                              <SelectItem value="Calauan">Calauan</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label
                            htmlFor="location"
                            className="text-sm text-gray-600 mb-2 block"
                          >
                            Specific Location Address (Optional)
                          </Label>
                          <Input
                            id="location"
                            placeholder="Enter specific address if different from campus"
                            value={formData.location}
                            onChange={(e) =>
                              handleInputChange("location", e.target.value)
                            }
                            className="border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-2xl py-3 px-4 text-base mb-3"
                          />

                          <div className="bg-gray-200 rounded-2xl h-64 flex items-center justify-center">
                            <div className="text-center text-gray-500">
                              <MapPin className="w-16 h-16 mx-auto mb-4" />
                              <p className="text-lg mb-2">
                                Google Maps Integration
                              </p>
                              <p className="text-sm">
                                Click on the map to pin the exact location
                              </p>
                              {formData.coordinates && (
                                <p className="text-xs mt-2 text-[#820504]">
                                  Pinned: {formData.coordinates.lat.toFixed(6)},{" "}
                                  {formData.coordinates.lng.toFixed(6)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full lg:w-auto bg-[#820504] hover:bg-[#6d0403] text-white py-4 px-12 rounded-2xl font-semibold text-lg"
                  >
                    {isSubmitting ? "Editing Cause..." : "Edit Cause"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-[#820504] font-medium">
              Cause Title *
            </Label>
            <Input
              id="title"
              placeholder="Enter your cause title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="mt-1 border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-xl"
              required
            />
          </div>

          <div>
            <Label
              htmlFor="shortDescription"
              className="text-[#820504] font-medium"
            >
              Short Description *
            </Label>
            <Textarea
              id="shortDescription"
              placeholder="Brief description for the discover causes page (max 150 characters)"
              value={formData.shortDescription}
              onChange={(e) =>
                handleInputChange("shortDescription", e.target.value)
              }
              className="mt-1 border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-xl"
              rows={2}
              maxLength={150}
              required
            />
            <div className="text-sm text-gray-500 mt-1">
              {formData.shortDescription.length}/150 characters
            </div>
          </div>

          <div>
            <Label
              htmlFor="detailedDescription"
              className="text-[#820504] font-medium"
            >
              Detailed Description *
            </Label>
            <Textarea
              id="detailedDescription"
              placeholder="Describe your cause and its impact"
              value={formData.detailedDescription}
              onChange={(e) =>
                handleInputChange("detailedDescription", e.target.value)
              }
              className="mt-1 border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-xl"
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-[#820504] font-medium">
              Category *
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
              required
            >
              <SelectTrigger className="mt-1 border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-xl">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Environment">Environment</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Animal Care">Animal Care</SelectItem>
                <SelectItem value="Community">Community Service</SelectItem>
                <SelectItem value="Health & Wellness">
                  Health & Wellness
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-[#820504] font-medium">
              Organizer Type *
            </Label>
            <div className="flex gap-3 mb-3">
              <Button
                type="button"
                variant={
                  formData.organizerType === "student" ? "default" : "outline"
                }
                onClick={() => handleOrganizerTypeChange("student")}
                className={`flex-1 rounded-xl py-2 text-sm ${
                  formData.organizerType === "student"
                    ? "bg-[#820504] hover:bg-[#6d0403] text-white"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100 bg-gray-50"
                }`}
              >
                Student
              </Button>
              <Button
                type="button"
                variant={
                  formData.organizerType === "organization"
                    ? "default"
                    : "outline"
                }
                onClick={() => handleOrganizerTypeChange("organization")}
                className={`flex-1 rounded-xl py-2 text-sm ${
                  formData.organizerType === "organization"
                    ? "bg-[#820504] hover:bg-[#6d0403] text-white"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100 bg-gray-50"
                }`}
              >
                Organization
              </Button>
              <Button
                type="button"
                variant={
                  formData.organizerType === "other" ? "default" : "outline"
                }
                onClick={() => handleOrganizerTypeChange("other")}
                className={`flex-1 rounded-xl py-2 text-sm ${
                  formData.organizerType === "other"
                    ? "bg-[#820504] hover:bg-[#6d0403] text-white"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100 bg-gray-50"
                }`}
              >
                Other
              </Button>
            </div>
            {showOtherInput && (
              <Input
                placeholder="Please specify your organizer type"
                value={formData.otherOrganizerType}
                onChange={(e) =>
                  handleInputChange("otherOrganizerType", e.target.value)
                }
                className="mt-1 border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-xl"
                required
              />
            )}
          </div>

          <div>
            <Label className="text-[#820504] font-medium">Timeframe *</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="dateStart"
                  className="text-[#820504] font-medium"
                >
                  Start Date
                </Label>
                <Input
                  id="dateStart"
                  type="date"
                  value={formData.dateStart}
                  onChange={(e) =>
                    handleInputChange("dateStart", e.target.value)
                  }
                  className="mt-1 border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-xl"
                  required
                />
              </div>
              <div>
                <Label htmlFor="dateEnd" className="text-[#820504] font-medium">
                  End Date
                </Label>
                <Input
                  id="dateEnd"
                  type="date"
                  value={formData.dateEnd}
                  onChange={(e) => handleInputChange("dateEnd", e.target.value)}
                  className="mt-1 border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-xl"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <Label className="text-[#820504] font-medium">
              Preferred Days *
            </Label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {Object.entries(dayAbbreviations).map(([day, abbr]) => (
                <Button
                  key={day}
                  type="button"
                  variant={
                    formData.preferredDays.includes(day) ? "default" : "outline"
                  }
                  onClick={() => handleDayToggle(day)}
                  className={`rounded-xl py-2 text-xs ${
                    formData.preferredDays.includes(day)
                      ? "bg-[#820504] hover:bg-[#6d0403] text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100 bg-gray-50"
                  }`}
                >
                  {abbr}
                </Button>
              ))}
            </div>
            {formData.preferredDays.length > 0 && (
              <div className="text-xs text-gray-600">
                Selected: {getPreferredDaysDisplay()}
              </div>
            )}
          </div>

          <div>
            <Label className="text-[#820504] font-medium">
              Location Type *
            </Label>
            <div className="space-y-4">
              <div>
                <Label htmlFor="campus" className="text-[#820504] font-medium">
                  Campus (Optional)
                </Label>
                <Select
                  value={formData.campus}
                  onValueChange={(value) => handleInputChange("campus", value)}
                >
                  <SelectTrigger className="mt-1 border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-xl">
                    <SelectValue placeholder="Select a campus (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sta. Mesa">Sta. Mesa</SelectItem>
                    <SelectItem value="Taguig">Taguig</SelectItem>
                    <SelectItem value="San Juan">San Juan</SelectItem>
                    <SelectItem value="Parañaque">Parañaque</SelectItem>
                    <SelectItem value="Bataan">Bataan</SelectItem>
                    <SelectItem value="Sta. Maria">Sta. Maria</SelectItem>
                    <SelectItem value="Pulilan">Pulilan</SelectItem>
                    <SelectItem value="Cabiao">Cabiao</SelectItem>
                    <SelectItem value="Lopez">Lopez</SelectItem>
                    <SelectItem value="Mulanay">Mulanay</SelectItem>
                    <SelectItem value="General Luna">General Luna</SelectItem>
                    <SelectItem value="Unisan">Unisan</SelectItem>
                    <SelectItem value="Ragay">Ragay</SelectItem>
                    <SelectItem value="Sto. Tomas">Sto. Tomas</SelectItem>
                    <SelectItem value="Maragondon">Maragondon</SelectItem>
                    <SelectItem value="Alfonso">Alfonso</SelectItem>
                    <SelectItem value="Bansud">Bansud</SelectItem>
                    <SelectItem value="Sablayan">Sablayan</SelectItem>
                    <SelectItem value="Biñan">Biñan</SelectItem>
                    <SelectItem value="San Pedro">San Pedro</SelectItem>
                    <SelectItem value="Sta. Rosa">Sta. Rosa</SelectItem>
                    <SelectItem value="Calauan">Calauan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="location"
                  className="text-[#820504] font-medium"
                >
                  Specific Location Address (Optional)
                </Label>
                <Input
                  id="location"
                  placeholder="Enter specific address if different from campus"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="mt-1 border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-xl"
                />
              </div>
            </div>
          </div>

          <div>
            <Label
              htmlFor="maxVolunteers"
              className="text-[#820504] font-medium"
            >
              Maximum Volunteers *
            </Label>
            <Input
              id="maxVolunteers"
              type="number"
              placeholder="How many volunteers do you need?"
              value={formData.maxVolunteers}
              onChange={(e) =>
                handleInputChange("maxVolunteers", e.target.value)
              }
              className="mt-1 border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-xl"
              min="1"
              required
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#820504] hover:bg-[#6d0403] text-white py-3 rounded-full font-semibold"
            >
              {isSubmitting ? "Editing Cause..." : "Edit Cause"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
