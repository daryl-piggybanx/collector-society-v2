"use client"

type PipeProps = {
  x: number
  gapY: number
  width: number
  gapHeight: number
  gameHeight: number
}

export default function Pipe({ x, gapY, width, gapHeight, gameHeight }: PipeProps) {
  return (
    <>
      {/* Top pipe */}
      <div
        className="absolute bg-green-600 border-2 border-green-700 shadow-lg transition-transform duration-75 ease-linear"
        style={{
          left: x,
          top: 0,
          width: width,
          height: gapY,
        }}
      >
        {/* Pipe cap */}
        <div
          className="absolute bottom-0 bg-green-500 border-2 border-green-700"
          style={{
            left: -4,
            width: width + 8,
            height: 20,
          }}
        />
        {/* Pipe body pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-green-500 to-green-600" />
      </div>

      {/* Bottom pipe */}
      <div
        className="absolute bg-green-600 border-2 border-green-700 shadow-lg transition-transform duration-75 ease-linear"
        style={{
          left: x,
          top: gapY + gapHeight,
          width: width,
          height: gameHeight - (gapY + gapHeight) - 50, // Account for ground
        }}
      >
        {/* Pipe cap */}
        <div
          className="absolute top-0 bg-green-500 border-2 border-green-700"
          style={{
            left: -4,
            width: width + 8,
            height: 20,
          }}
        />
        {/* Pipe body pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-green-500 to-green-600" />
      </div>
    </>
  )
}
