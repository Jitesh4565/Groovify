import { useRef, useState, useEffect } from "react";

export default function MusicPlayer({ recentTracks = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const currentTrack = recentTracks?.[currentIndex]?.track;

  useEffect(() => {
    if (!currentTrack?.preview_url) {
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
    }
  }, [currentTrack]);

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack?.preview_url) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) =>
      prev + 1 < recentTracks.length ? prev + 1 : 0
    );
  };

  const playPrev = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) =>
      prev - 1 >= 0 ? prev - 1 : recentTracks.length - 1
    );
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black text-white px-4 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-4">
        <img
          src={currentTrack.album.images[0]?.url}
          alt={currentTrack.name}
          className="w-12 h-12 rounded"
        />
        <div>
          <p className="font-semibold text-sm">{currentTrack.name}</p>
          <p className="text-xs text-gray-400">
            {currentTrack.artists.map((a) => a.name).join(", ")}
          </p>
        </div>
      </div>

      <div className="flex-1 flex justify-center items-center space-x-6">
        <button onClick={playPrev}><span className="material-symbols-outlined text-white text-3xl">skip_previous</span></button>
        <button onClick={togglePlay}>{isPlaying ?<span className="material-symbols-outlined text-white text-3xl">pause</span> :<span className="material-symbols-outlined text-white text-3xl">play_arrow</span>}</button>
        <button onClick={playNext}><span className="material-symbols-outlined text-white text-3xl">skip_next</span></button>
        <audio ref={audioRef} src={currentTrack.preview_url} autoPlay />
      </div>
    </div>
  );
}
