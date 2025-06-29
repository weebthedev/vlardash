import { useEffect, useState, useRef } from 'react';
import { fetchUser, fetchGuilds, refreshGuilds } from '../lib/api';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import Head from 'next/head';

const LogoutIcon = () => (
  <svg
    className="w-5 h-5 inline-block mr-2"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </svg>
);

const RefreshIcon = ({ spinning }: { spinning: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 50 50"
    xmlns="http://www.w3.org/2000/svg"
    className={`${spinning ? 'animate-spin' : ''} inline-block mr-2 text-white`}
    fill="currentColor"
  >
    <path d="M25 38c-7.2 0-13-5.8-13-13 0-3.2 1.2-6.2 3.3-8.6l1.5 1.3C15 19.7 14 22.3 14 25c0 6.1 4.9 11 11 11 1.6 0 3.1-.3 4.6-1l.8 1.8c-1.7.8-3.5 1.2-5.4 1.2z" />
    <path d="M34.7 33.7l-1.5-1.3c1.8-2 2.8-4.6 2.8-7.3 0-6.1-4.9-11-11-11-1.6 0-3.1.3-4.6 1l-.8-1.8c1.7-.8 3.5-1.2 5.4-1.2 7.2 0 13 5.8 13 13 0 3.1-1.2 6.2-3.3 8.6z" />
    <path d="M18 24h-2v-6h-6v-2h8z" />
    <path d="M40 34h-8v-8h2v6h6z" />
  </svg>
);

export default function Dashboard() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [guilds, setGuilds] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUser()
      .then(setUser)
      .catch(() => router.push('/'));

    fetchGuilds()
      .then(setGuilds)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    window.addEventListener('mousedown', handleOutside);
    return () => window.removeEventListener('mousedown', handleOutside);
  }, []);

  const refreshGuildsHandler = async () => {
    setSpinning(true);
    try {
      const updatedGuilds = await refreshGuilds();
      setGuilds(updatedGuilds);
    } catch (err) {
      console.error('Failed to refresh guilds');
    }
    setTimeout(() => setSpinning(false), 1000); // visible spin
  };

  if (!user) return null;

  return (
    <>
      <Head>
        <title>Horizon | Dashboard</title>
      </Head>
      <main className="min-h-screen bg-background text-white">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 w-full z-50 bg-surface border-b border-border px-6 py-4 flex items-center justify-between shadow-sm">
          <h1 className="text-xl font-bold">Dashboard</h1>

          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="text-base font-semibold">{user.username}</span>
              <img
                src={
                  user.avatar
                    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                    : 'https://cdn.discordapp.com/embed/avatars/0.png'
                }
                alt="Avatar"
                className="w-10 h-10 rounded-full"
              />
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#333] border border-border rounded-md shadow-lg z-10 overflow-hidden">
                <a
                  href="http://localhost:3002/auth/logout"
                  className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-red-700 hover:text-white transition rounded-b-md"
                >
                  <LogoutIcon />
                  Sign Out
                </a>
              </div>
            )}
          </div>
        </nav>

        {/* Content */}
        <div className="pt-24 px-4 sm:px-6">
          <div className="border-b border-gray-700 pb-2 mb-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Your Admin Servers</h3>
              <p className="text-sm text-gray-400">
                Only servers where you have administrative access are shown.
              </p>
            </div>
            <button
              onClick={refreshGuildsHandler}
              className="flex items-center px-4 py-2 bg-accent text-white rounded-md hover:bg-[#505050] transition"
            >
              <RefreshIcon spinning={spinning} />
              <span className="text-base font-semibold">Refresh</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {guilds.map((g) => (
              <Link
                key={g.id}
                href={`/manage/${g.id}`}
                className="group flex flex-col items-center justify-center bg-[#2e2e2e] hover:bg-[#3a3a3a] transition-colors border border-[#444] rounded-xl py-8 px-4 cursor-pointer text-center"
              >
                <img
                  src={
                    g.icon
                      ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`
                      : 'https://cdn.discordapp.com/embed/avatars/0.png'
                  }
                  alt={`${g.name} icon`}
                  className="w-20 h-20 rounded-full mb-4"
                />
                <p className="text-lg font-medium truncate w-full">{g.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
