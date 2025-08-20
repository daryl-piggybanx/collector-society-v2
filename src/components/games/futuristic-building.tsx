"use client"

type FuturisticBuildingProps = {
  x: number
  gapY: number
  width: number
  gapHeight: number
  gameHeight: number
}

export default function FuturisticBuilding({ x, gapY, width, gapHeight, gameHeight }: FuturisticBuildingProps) {
  const buildingId = Math.floor(x / 100) // Create variation based on position
  const variant = buildingId % 3 // 3 different building styles

  return (
    <>
      {/* Top building */}
      <div
        className="absolute transition-transform duration-75 ease-linear"
        style={{
          left: x,
          top: 0,
          width: width,
          height: gapY,
        }}
      >
        {/* Main building structure */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-red-600 to-red-800 border-l-2 border-r-2 border-red-900">
          {/* Building floors */}
          {Array.from({ length: Math.floor(gapY / 25) }).map((_, i) => (
            <div key={i} className="absolute left-0 right-0 border-b border-red-800/50" style={{ top: i * 25 }}>
              {/* Floor windows */}
              <div className="flex justify-between items-center px-2 py-1">
                <div
                  className={`w-2 h-2 rounded-sm ${Math.random() > 0.5 ? "bg-cyan-400" : "bg-yellow-400"} opacity-80`}
                />
                <div className={`w-1 h-3 bg-red-500`} />
                <div
                  className={`w-2 h-2 rounded-sm ${Math.random() > 0.5 ? "bg-cyan-400" : "bg-yellow-400"} opacity-80`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Building top/roof */}
        <div
          className="absolute bottom-0 bg-gradient-to-t from-red-700 to-red-400 border-t-2 border-red-700"
          style={{
            left: 0,
            width: width,
            height: variant === 0 ? 20 : variant === 1 ? 16 : 24,
          }}
        >
          {/* Rooftop details */}
          {variant === 0 && (
            <>
              {/* Communication array */}
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-gray-300" />
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-1 bg-gray-400" />
              {/* Rooftop edge lighting */}
              <div className="absolute top-0 left-1 right-1 h-0.5 bg-cyan-400 opacity-60" />
            </>
          )}
          {variant === 1 && (
            <>
              {/* Landing platform - flush with building */}
              <div className="absolute top-2 left-2 right-2 h-2 bg-red-300 border border-red-600" />
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-yellow-400 opacity-60" />
            </>
          )}
          {variant === 2 && (
            <>
              {/* Multiple antennas */}
              <div className="absolute top-1 left-4 w-0.5 h-3 bg-gray-300" />
              <div className="absolute right-4 top-1 w-0.5 h-3 bg-gray-300" />
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-5 bg-gray-400" />
              {/* Rooftop perimeter */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-red-400 border-b border-red-600" />
            </>
          )}

          {/* Status lights - positioned within building width */}
          <div className="absolute bottom-1 left-4 w-1 h-1 bg-green-400 rounded-full animate-pulse" />
          <div className="absolute bottom-1 right-4 w-1 h-1 bg-red-400 rounded-full animate-pulse" />
        </div>

        {/* Side architectural details */}
        <div className="absolute left-0 top-4 w-1 h-8 bg-red-800" />
        <div className="absolute right-0 top-4 w-1 h-8 bg-red-800" />
      </div>

      {/* Bottom building */}
      <div
        className="absolute transition-transform duration-75 ease-linear"
        style={{
          left: x,
          top: gapY + gapHeight,
          width: width,
          height: gameHeight - (gapY + gapHeight) - 50,
        }}
      >
        {/* Main building structure */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-red-600 to-red-800 border-l-2 border-r-2 border-red-900">
          {/* Building floors */}
          {Array.from({ length: Math.floor((gameHeight - (gapY + gapHeight) - 50) / 25) }).map((_, i) => (
            <div key={i} className="absolute left-0 right-0 border-b border-red-800/50" style={{ top: i * 25 + 20 }}>
              {/* Floor windows */}
              <div className="flex justify-between items-center px-2 py-1">
                <div
                  className={`w-2 h-2 rounded-sm ${Math.random() > 0.5 ? "bg-cyan-400" : "bg-yellow-400"} opacity-80`}
                />
                <div className={`w-1 h-3 bg-red-500`} />
                <div
                  className={`w-2 h-2 rounded-sm ${Math.random() > 0.5 ? "bg-cyan-400" : "bg-yellow-400"} opacity-80`}
                />
              </div>
            </div>
          ))}
        </div> 

        {/* Building base/foundation */}
        <div
          className="absolute top-0 bg-gradient-to-b from-red-400 to-red-500 border-b-2 border-red-700"
          style={{
            left: 0,
            width: width,
            height: variant === 0 ? 20 : variant === 1 ? 16 : 24,
          }}
        >
          {/* Foundation details */}
          {variant === 0 && (
            <>
              {/* Support pillars - within building */}
              <div className="absolute bottom-1 left-4 w-1 h-4 bg-red-600" />
              <div className="absolute bottom-1 right-4 w-1 h-4 bg-red-600" />
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 opacity-60" />
            </>
          )}
          {variant === 1 && (
            <>
              {/* Entry platform - flush with building */}
              <div className="absolute bottom-2 left-2 right-2 h-2 bg-red-300 border border-red-600" />
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400 opacity-60" />
            </>
          )}
          {variant === 2 && (
            <>
              {/* Industrial base - within building bounds */}
              <div className="absolute bottom-1 left-2 right-2 h-3 bg-red-600 border border-red-800" />
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-yellow-400" />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-400 border-t border-red-600" />
            </>
          )}

          {/* Status lights - positioned within building width */}
          <div className="absolute top-1 left-4 w-1 h-1 bg-green-400 rounded-full animate-pulse" />
          <div className="absolute top-1 right-4 w-1 h-1 bg-red-400 rounded-full animate-pulse" />
        </div>

        {/* Side architectural details */}
        <div className="absolute left-0 bottom-4 w-1 h-8 bg-red-800" />
        <div className="absolute right-0 bottom-4 w-1 h-8 bg-red-800" />
      </div>
    </>
  )
}
