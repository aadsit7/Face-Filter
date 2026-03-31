export default function VideoPlayer({ title }) {
  return (
    <div className="space-y-2">
      <div className="relative rounded-lg overflow-hidden bg-recast-navy aspect-video flex items-center justify-center">
        {/* Play button */}
        <button className="relative z-10 w-16 h-16 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
          <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>

        {/* Overlay text */}
        <span className="absolute bottom-4 left-0 right-0 text-center text-white/70 text-sm">
          Demo video coming soon
        </span>
      </div>
      {title && (
        <p className="text-sm font-medium text-recast-navy">{title}</p>
      )}
    </div>
  );
}
