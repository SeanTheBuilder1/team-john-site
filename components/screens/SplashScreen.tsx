export default function SplashScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#820504] to-[#a50606] flex items-center justify-center">
      <div className="text-center text-white">
        <div className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="flex items-center mb-4">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mr-3">
              <img src="/puppy.svg" />
            </div>
            <div className="w-32 md:w-48 flex items-center">
              <img
                src="/text_logo.svg"
                className="h-auto w-full object-contain transform scale-150"
              />
            </div>
          </div>
        </div>
        <p className="text-lg opacity-90">Connecting Hearts, Creating Impact</p>
      </div>
    </div>
  );
}
