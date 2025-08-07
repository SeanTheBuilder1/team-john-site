"use client";

import { useState } from "react";
import { ArrowLeft, Camera, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ProfileScreenProps {
  user: any;
  onBack: () => void;
}

export default function ProfileScreen({ user, onBack }: ProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    campus: user.campus || "N/A",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log("Saving profile:", formData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 lg:p-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="mr-3 text-[#820504] hover:bg-[#820504]/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl lg:text-2xl font-bold text-[#820504]">
              Profile
            </h1>
          </div>
          <Button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="bg-[#820504] hover:bg-[#6d0403] text-white rounded-xl px-4 py-2"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            {isEditing ? "Save" : "Edit"}
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 lg:p-8">
        <Card className="border-0 shadow-lg rounded-3xl">
          <CardContent className="p-8 lg:p-12">
            {/* Profile Picture Section */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <Avatar className="w-32 h-32 lg:w-40 lg:h-40 mx-auto mb-4">
                  <AvatarFallback className="bg-[#dca92c] text-white text-4xl lg:text-5xl">
                    {user.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-[#820504] hover:bg-[#6d0403] text-white p-0"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-[#820504] font-medium mb-2 block"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="text-center border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-xl text-lg font-semibold"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="campus"
                      className="text-[#820504] font-medium mb-2 block"
                    >
                      Campus
                    </Label>
                    <Select
                      value={formData.campus}
                      onValueChange={(value) =>
                        handleInputChange("campus", value)
                      }
                    >
                      <SelectTrigger className="border-gray-300 focus:border-[#820504] focus:ring-[#820504] rounded-xl">
                        <SelectValue />
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
                        <SelectItem value="General Luna">
                          General Luna
                        </SelectItem>
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
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-[#820504] mb-2">
                    {user.name}
                  </h2>
                  <p className="text-gray-600 text-lg">PUP {user.campus}</p>
                  <p className="text-gray-500">{user.course}</p>
                </div>
              )}
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 gap-6 lg:gap-8">
              <div className="text-center p-6 bg-gradient-to-br from-[#820504]/10 to-[#a50606]/10 rounded-2xl">
                <div className="text-3xl lg:text-4xl font-bold text-[#820504] mb-2">
                  2
                </div>
                <div className="text-gray-700 font-medium">
                  Causes Volunteered
                </div>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-[#dca92c]/10 to-[#c49429]/10 rounded-2xl">
                <div className="text-3xl lg:text-4xl font-bold text-[#820504] mb-2">
                  3
                </div>
                <div className="text-gray-700 font-medium">
                  Causes Organized
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-center lg:text-left">
                <div>
                  <h3 className="font-semibold text-[#820504] mb-2">
                    Student ID
                  </h3>
                  <p className="text-gray-600">{user.student_id}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#820504] mb-2">Email</h3>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
