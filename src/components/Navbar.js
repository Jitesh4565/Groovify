import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
export default function Navbar() {
  const { data: session } = useSession();

  return (
    <div className="navbar bg-black shadow-sm text-white px-4">
      {/* Left - Logo */}
      <div className="flex-none">
        <img src="/spotify-white.png" alt="Spotify-logo" className="w-10 h-10" />
      </div>

      {/* Center - Search */}
      <div className="flex-1 justify-center flex">
        <input
          type="text"
          placeholder="What do you want to Play?"
          className="input w-full max-w-xs"
          style={{ backgroundColor: "#282828", color: "white", borderColor: "#555" }}
        />
      </div>

      {/* Right - Profile */}
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Profile"
                src={
                  session?.user?.image ||
                  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                }
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content rounded-box z-50 mt-3 w-52 p-2 shadow"
            style={{ backgroundColor: "#282828", color: "white" }}
          >
            <li>
              <a className="justify-between">
                {session?.user?.name || "Profile"}
              </a>
            </li>
            <li><button onClick={() => signOut()}>Logout</button></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
