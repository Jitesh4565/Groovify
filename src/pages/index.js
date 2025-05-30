import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card w-96 bg-base-100 shadow-xl p-6">
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-xl font-bold">Welcome to Groovify 🎶</h2>
          <button
            onClick={() => signIn("spotify",{callbackUrl:"/dashboard"})}
            className="btn btn-success w-full text-white"
          >
            Login with Spotify
          </button>
        </div>
      </div>
     
    </div>
  );
}