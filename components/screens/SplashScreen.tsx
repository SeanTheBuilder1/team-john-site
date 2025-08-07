import { Heart } from "lucide-react"

export default function SplashScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#820504] to-[#a50606] flex items-center justify-center">
      <div className="text-center text-white">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-12 h-12 text-[#820504]" />
        </div>
        <h1 className="text-3xl font-bold mb-2">PUP Cause Catalyst</h1>
        <p className="text-lg opacity-90">Connecting Hearts, Creating Impact</p>
      </div>
    </div>
  )
}
