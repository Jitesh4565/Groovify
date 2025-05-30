import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import MusicPlayer from "@/components/MusicPlayer";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [recentTracks, setRecentTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [topArtists, setTopArtists] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const router = useRouter();

  const handlePlayTrack = async (playlistId) => {
    try {
      const res = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );
      const data = await res.json();
      const track = data.items?.[0]?.track;
      if (track?.preview_url) {
        setCurrentTrack(track);
      } else {
        alert("No preview available for this track.");
      }
    } catch (error) {
      console.error("Error fetching playlist tracks:", error);
    }
  };

  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchPlaylists = async () => {
      try {
        const res = await fetch("https://api.spotify.com/v1/me/playlists", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        const data = await res.json();
        setPlaylists(data.items || []);
      } catch (error) {
        console.error("Failed to fetch playlists:", error);
      }
    };

    const fetchRecentTracks = async () => {
      try {
        const res = await fetch(
          "https://api.spotify.com/v1/me/player/recently-played?limit=15",
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        const data = await res.json();
        setRecentTracks(data.items || []);
      } catch (error) {
        console.error("Failed to fetch recent tracks:", error);
      }
    };

    const fetchTopArtists = async () => {
      try {
        const res = await fetch("https://api.spotify.com/v1/me/top/artists?limit=5", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        const data = await res.json();
        setTopArtists(data.items || []);
      } catch (error) {
        console.error("Failed to fetch top artists:", error);
      }
    };

    const fetchNewReleases = async () => {
      try {
        const res = await fetch("https://api.spotify.com/v1/browse/new-releases?limit=10", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        const data = await res.json();
        setNewReleases(data.albums.items || []);
      } catch (error) {
        console.error("Failed to fetch new releases:", error);
      }
    };

    fetchPlaylists();
    fetchRecentTracks();
    fetchTopArtists();
    fetchNewReleases();
  }, [session]);

  if (status === "loading") return <div className="p-8 text-center">Loading your playlists...</div>;
  if (!session) {
    router.push("/");
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        {/* Sidebar */}
        <div className="w-[360px] bg-black text-white p-8 flex flex-col">
          <h1 className="font-bold text-2xl mb-4">Your Library</h1>
          <h2 className="text-lg font-semibold mb-3">Recently Played</h2>
          <div className="flex-1 overflow-y-auto pr-2">
            <ul className="space-y-3">
              {recentTracks.map((item) => (
                <li key={item.played_at} className="flex items-center space-x-3">
                  <img
                    src={item.track.album.images[0]?.url}
                    alt={item.track.name}
                    className="w-10 h-10 rounded"
                  />
                  <div>
                    <p className="text-sm font-medium">{item.track.name}</p>
                    <p className="text-xs text-gray-400">
                      {item.track.artists.map((a) => a.name).join(", ")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-base-200 p-8 overflow-y-auto h-full">
          {/* Your Playlists */}
          <h1 className="text-3xl font-bold mb-6">Your Spotify Playlists</h1>
          {playlists.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-4">Your Playlists</h2>
              <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
                {playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="relative min-w-[180px] max-w-[180px] bg-base-100 rounded shadow hover:shadow-lg transition duration-300"
                  >
                    <div className="relative">
                      <img
                        src={playlist.images[0]?.url || "/spotify-icon.svg"}
                        alt={playlist.name}
                        className="h-48 w-full object-cover rounded-t"
                      />
                     
                    </div>
                    <div className="p-2">
                      <h3 className="text-sm font-semibold truncate">{playlist.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

            {/* New Releases */}
          {newReleases.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">New Releases</h2>
              <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
                {newReleases.map((album) => (
                  <div
                    key={album.id}
                    className="min-w-[180px] max-w-[180px] bg-base-100 rounded shadow hover:shadow-lg transition duration-300"
                  >
                    <img
                      src={album.images[0]?.url || "/spotify-icon.svg"}
                      alt={album.name}
                      className="h-48 w-full object-cover rounded-t"
                    />
                    <div className="p-2">
                      <h3 className="text-sm font-semibold truncate">{album.name}</h3>
                      <p className="text-xs text-gray-500 truncate">
                        {album.artists.map((a) => a.name).join(", ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Artists */}
          {topArtists.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-4">Top Artists</h2>
              <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
                {topArtists.map((artist) => (
                  <div
                    key={artist.id}
                    className="min-w-[140px] max-w-[140px] bg-base-100 rounded shadow p-3 flex flex-col items-center text-center"
                  >
                    <img
                      src={artist.images[0]?.url || "/spotify-icon.svg"}
                      alt={artist.name}
                      className="w-24 h-24 rounded-full object-cover mb-2"
                    />
                    <p className="text-sm font-semibold">{artist.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <MusicPlayer recentTracks={recentTracks} />
    </>
  );
}
