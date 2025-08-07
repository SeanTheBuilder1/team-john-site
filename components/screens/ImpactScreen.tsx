import { Award, Target, Star, Trophy, MapPin, Users, Lock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ImpactScreenProps {
  user: any
  isDesktop: boolean
}

export default function ImpactScreen({ user, isDesktop }: ImpactScreenProps) {
  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first cause",
      icon: Award,
      unlocked: true,
      progress: 100,
      requirement: "1 cause completed",
    },
    {
      id: 2,
      title: "Community Helper",
      description: "Complete 5 causes",
      icon: Trophy,
      unlocked: true,
      progress: 100,
      requirement: "5 causes completed",
    },
    {
      id: 3,
      title: "Dedicated Volunteer",
      description: "Complete 10 causes",
      icon: Star,
      unlocked: false,
      progress: 50,
      requirement: "5/10 causes completed",
    },
    {
      id: 4,
      title: "Cause Champion",
      description: "Complete 25 causes",
      icon: Trophy,
      unlocked: false,
      progress: 20,
      requirement: "5/25 causes completed",
    },
    {
      id: 5,
      title: "Sta. Mesa Explorer",
      description: "Complete 3 causes in Sta. Mesa campus",
      icon: MapPin,
      unlocked: true,
      progress: 100,
      requirement: "3 causes in Sta. Mesa",
    },
    {
      id: 6,
      title: "Taguig Pioneer",
      description: "Complete 3 causes in Taguig campus",
      icon: MapPin,
      unlocked: false,
      progress: 33,
      requirement: "1/3 causes in Taguig",
    },
    {
      id: 7,
      title: "Multi-Campus Volunteer",
      description: "Complete causes in 5 different campuses",
      icon: MapPin,
      unlocked: false,
      progress: 40,
      requirement: "2/5 campuses visited",
    },
    {
      id: 8,
      title: "Campus Connector",
      description: "Complete causes in all PUP campuses",
      icon: MapPin,
      unlocked: false,
      progress: 9,
      requirement: "2/22 campuses visited",
    },
    {
      id: 9,
      title: "Sta. Mesa Specialist",
      description: "Complete 10 causes in Sta. Mesa campus",
      icon: Users,
      unlocked: false,
      progress: 30,
      requirement: "3/10 causes in Sta. Mesa",
    },
    {
      id: 10,
      title: "Environmental Guardian",
      description: "Complete 5 environmental causes",
      icon: Award,
      unlocked: false,
      progress: 60,
      requirement: "3/5 environmental causes",
    },
  ]

  if (isDesktop) {
    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold text-[#820504] mb-8">Your Impact</h2>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-md rounded-3xl bg-gradient-to-br from-[#820504] to-[#a50606] text-white">
            <CardContent className="p-6 text-center">
              <Award className="w-12 h-12 mx-auto mb-4" />
              <div className="text-3xl font-bold mb-2">5</div>
              <div className="text-sm opacity-90">Causes Completed</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md rounded-3xl bg-gradient-to-br from-[#dca92c] to-[#c49429] text-white">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 mx-auto mb-4" />
              <div className="text-3xl font-bold mb-2">2</div>
              <div className="text-sm opacity-90">Causes Volunteered</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md rounded-3xl bg-gradient-to-br from-[#fede0d] to-[#e6c50c] text-[#820504]">
            <CardContent className="p-6 text-center">
              <Trophy className="w-12 h-12 mx-auto mb-4" />
              <div className="text-3xl font-bold mb-2">3</div>
              <div className="text-sm opacity-90">Causes Organized</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-md rounded-3xl">
            <CardHeader>
              <CardTitle className="text-[#820504] flex items-center text-xl">
                <Target className="w-6 h-6 mr-3" />
                Monthly Goal Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-base mb-3">
                    <span>Causes Joined</span>
                    <span className="font-semibold">2/3 causes</span>
                  </div>
                  <Progress value={67} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between text-base mb-3">
                    <span>Causes Completed</span>
                    <span className="font-semibold">1/2 causes</span>
                  </div>
                  <Progress value={50} className="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md rounded-3xl">
            <CardHeader>
              <CardTitle className="text-[#820504] text-xl">Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
                {achievements.slice(0, 6).map((achievement) => {
                  const Icon = achievement.icon
                  return (
                    <div
                      key={achievement.id}
                      className={`flex items-center p-4 rounded-2xl ${
                        achievement.unlocked
                          ? "bg-gradient-to-r from-[#fede0d]/20 to-[#dca92c]/20 border border-[#dca92c]/30"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                          achievement.unlocked ? "bg-[#dca92c] text-white" : "bg-gray-300 text-gray-500"
                        }`}
                      >
                        {achievement.unlocked ? <Icon className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                      </div>
                      <div className="flex-1">
                        <div
                          className={`font-semibold text-lg ${
                            achievement.unlocked ? "text-[#820504]" : "text-gray-500"
                          }`}
                        >
                          {achievement.title}
                        </div>
                        <div className="text-gray-600 text-sm mb-2">{achievement.description}</div>
                        {!achievement.unlocked && (
                          <div className="space-y-1">
                            <div className="text-xs text-gray-500">{achievement.requirement}</div>
                            <Progress value={achievement.progress} className="h-2" />
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Achievements Section */}
        <Card className="border-0 shadow-md rounded-3xl mt-8">
          <CardHeader>
            <CardTitle className="text-[#820504] text-2xl">All Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {achievements.map((achievement) => {
                const Icon = achievement.icon
                return (
                  <div
                    key={achievement.id}
                    className={`flex items-center p-4 rounded-2xl ${
                      achievement.unlocked
                        ? "bg-gradient-to-r from-[#fede0d]/20 to-[#dca92c]/20 border border-[#dca92c]/30"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                        achievement.unlocked ? "bg-[#dca92c] text-white" : "bg-gray-300 text-gray-500"
                      }`}
                    >
                      {achievement.unlocked ? <Icon className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold ${achievement.unlocked ? "text-[#820504]" : "text-gray-500"}`}>
                        {achievement.title}
                      </div>
                      <div className="text-gray-600 text-sm mb-2">{achievement.description}</div>
                      {!achievement.unlocked && (
                        <div className="space-y-1">
                          <div className="text-xs text-gray-500">{achievement.requirement}</div>
                          <Progress value={achievement.progress} className="h-2" />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Mobile layout
  return (
    <div className="p-6 pb-20">
      <h2 className="text-2xl font-bold text-[#820504] mb-6">Your Impact</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="border-0 shadow-md rounded-2xl bg-gradient-to-br from-[#820504] to-[#a50606] text-white">
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">5</div>
            <div className="text-sm opacity-90">Causes Completed</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-2xl bg-gradient-to-br from-[#dca92c] to-[#c49429] text-white">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">2</div>
            <div className="text-sm opacity-90">Causes Volunteered</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-2xl bg-gradient-to-br from-[#fede0d] to-[#e6c50c] text-[#820504] col-span-2">
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm opacity-90">Causes Organized</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-md rounded-2xl mb-6">
        <CardHeader>
          <CardTitle className="text-[#820504] flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Monthly Goal Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Causes Joined</span>
                <span>2/3 causes</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Causes Completed</span>
                <span>1/2 causes</span>
              </div>
              <Progress value={50} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-[#820504]">Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {achievements.map((achievement) => {
              const Icon = achievement.icon
              return (
                <div
                  key={achievement.id}
                  className={`flex items-center p-3 rounded-xl ${
                    achievement.unlocked
                      ? "bg-gradient-to-r from-[#fede0d]/20 to-[#dca92c]/20 border border-[#dca92c]/30"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      achievement.unlocked ? "bg-[#dca92c] text-white" : "bg-gray-300 text-gray-500"
                    }`}
                  >
                    {achievement.unlocked ? <Icon className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium ${achievement.unlocked ? "text-[#820504]" : "text-gray-500"}`}>
                      {achievement.title}
                    </div>
                    <div className="text-sm text-gray-600 mb-1">{achievement.description}</div>
                    {!achievement.unlocked && (
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">{achievement.requirement}</div>
                        <Progress value={achievement.progress} className="h-1.5" />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
