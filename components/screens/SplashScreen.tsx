export default function SplashScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#820504] to-[#a50606] flex items-center justify-center">
      <div className="text-center text-white">
        <div className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6">
          <img src="/puppy.svg" />
        </div>
        <h1 className="text-3xl font-bold mb-2">PUP Cause Catalyst</h1>
        <p className="text-lg opacity-90">Connecting Hearts, Creating Impact</p>
      </div>
    </div>
  );
}
