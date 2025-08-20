
export default function VideoBackground() {
  return (
    <div className="absolute inset-0 h-full w-full">
      <video src="/assets/twinkle-space-bg.mp4" autoPlay muted loop />
    </div>
  );
}