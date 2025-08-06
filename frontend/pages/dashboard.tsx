import { useEffect, useState } from 'react';
import { fetchUser, fetchGuilds, refreshGuilds } from '../lib/api';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import Head from 'next/head';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

// Import shadcn select components
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

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
    className={`${spinning ? 'animate-spin' : ''} inline-block mr-2`}
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
  const [spinning, setSpinning] = useState(false);
  const [selectedGuildId, setSelectedGuildId] = useState<string>("");

  useEffect(() => {
    fetchUser()
      .then(setUser)
      .catch(() => router.push('/'));

    fetchGuilds()
      .then(setGuilds)
      .catch(() => {});
  }, []);

  const refreshGuildsHandler = async () => {
    setSpinning(true);
    try {
      const updatedGuilds = await refreshGuilds();
      setGuilds(updatedGuilds);
    } catch (err) {
      console.error('Failed to refresh guilds');
    }
    setTimeout(() => setSpinning(false), 1000);
  };

  const handleSelectChange = (id: string) => {
    setSelectedGuildId(id);
    if (id) {
      router.push(`/manage/${id}`);
    }
  };

  if (!user) return null;

  return (
    <>
      <Head>
        <title>Vlar | Dashboard</title>
      </Head>
      <main className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Navbar */}
        <nav className="sticky top-0 left-0 w-full z-50 border-b border-border px-6 py-4 flex items-center justify-end shadow-sm bg-background">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 px-2 py-1">
                <span className="text-base font-semibold">{user.username}</span>
                <Avatar>
                  <AvatarImage
                    src={
                      user.avatar
                        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                        : 'https://cdn.discordapp.com/embed/avatars/0.png'
                    }
                    alt="Avatar"
                  />
                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <a
                  href="http://localhost:3002/auth/logout"
                  className="flex items-center text-red-500 hover:bg-red-700 hover:text-white transition"
                >
                  <LogoutIcon />
                  Sign Out
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Content */}
        <div className="flex flex-1 flex-col items-center justify-center pt-12 px-4 sm:px-6">
          <div className="flex flex-col items-center mb-8 w-full">
            <h2 className="text-2xl font-bold mb-2 text-center">Select a Server</h2>
            <Button
              onClick={refreshGuildsHandler}
              className="flex items-center mb-2"
              variant="secondary"
            >
              <RefreshIcon spinning={spinning} />
              <span className="text-base font-semibold">Refresh</span>
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Only servers where you have administrative access are shown.
            </p>
          </div>

          <div className="w-full flex justify-center">
            <Select
              value={selectedGuildId}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="-- Select a server --" />
              </SelectTrigger>
              <SelectContent>
                {guilds.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage
                          src={
                            g.icon
                              ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`
                              : 'https://cdn.discordapp.com/embed/avatars/0.png'
                          }
                          alt="Server Icon"
                        />
                        <AvatarFallback>{g.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <span>{g.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Show icons next to names */}
          <div className="w-full max-w-md mt-2">
            {selectedGuildId && (
              <div className="flex items-center gap-3 mt-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={
                      guilds.find(g => g.id === selectedGuildId)?.icon
                        ? `https://cdn.discordapp.com/icons/${selectedGuildId}/${guilds.find(g => g.id === selectedGuildId)?.icon}.png`
                        : 'https://cdn.discordapp.com/embed/avatars/0.png'
                    }
                    alt="Server Icon"
                  />
                  <AvatarFallback>
                    {guilds.find(g => g.id === selectedGuildId)?.name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-lg font-medium">
                  {guilds.find(g => g.id === selectedGuildId)?.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
