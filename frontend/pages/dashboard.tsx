import { useEffect, useState } from 'react';
import { fetchUser, fetchGuilds, refreshGuilds } from '../lib/api';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import Head from 'next/head';
import { LogOut, RefreshCw, Server } from 'lucide-react';
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
import { Card, CardContent } from '@/components/ui/card';

export default function Dashboard() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [guilds, setGuilds] = useState<any[]>([]);
  const [spinning, setSpinning] = useState(false);

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

  if (!user) return null;

  return (
    <>
      <Head>
        <title>Vlar | Dashboard</title>
      </Head>
      <main className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Navbar */}
        <nav className="sticky top-0 left-0 w-full z-50 border-b border-border px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between shadow-sm bg-background/80 backdrop-blur-lg">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link href="/" className="text-lg sm:text-xl font-bold text-primary tracking-tight hover:text-primary/80 transition-colors">
              Vlar
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={refreshGuildsHandler}
              variant="ghost"
              size="icon"
              className="hover:bg-accent/60 "
            >
              <RefreshCw className={`h-5 w-5 ${spinning ? 'animate-spin' : ''}`} />
            </Button>
            <div className="flex items-center space-x-2">
              <span className="text-sm sm:text-base font-semibold hidden sm:block">{user.username}</span>
              <span className="text-sm font-semibold sm:hidden">{user.username.slice(0, 8)}{user.username.length > 8 ? '...' : ''}</span>
              <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
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
            </div>
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              <a
                href="http://localhost:3002/auth/logout"
                className="flex items-center"
              >
                <LogOut className="w-4 h-4 mr-1 sm:mr-2" />              </a>
            </Button>
          </div>
        </nav>

        {/* Content */}
        <div className="flex flex-1 flex-col items-center justify-center pt-8 sm:pt-20 px-4 sm:px-6 pb-8 sm:pb-16">
          <div className="flex flex-col items-center mb-6 sm:mb-10 w-full max-w-5xl">
        <div className="flex items-center mb-2 sm:mb-3">
          <Server className="w-6 h-6 text-primary mr-2" />
          <h2 className="text-xl sm:text-3xl font-bold text-center text-primary">Select a server</h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground text-center px-2">
          Only servers where you have administrative access are shown.
        </p>
          </div>

          <div className="w-full flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 w-full max-w-5xl">
          {guilds.map((g) => {
            const iconUrl = g.icon
          ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`
          : 'https://cdn.discordapp.com/embed/avatars/0.png';
            return (
          <Link href={`/manage/${g.id}`} key={g.id}>
            <Card className="relative flex flex-col items-center justify-between bg-card border border-border p-4 sm:p-8 hover:shadow-xl hover:border-primary/60 hover:bg-accent/40 transition-all cursor-pointer text-center overflow-hidden group">
              {/* Blurred background icon */}
              <div
            className="absolute inset-0 flex items-center justify-center z-0"
            aria-hidden="true"
              >
            <img
              src={iconUrl}
              alt=""
              className="w-24 h-24 sm:w-32 sm:h-32 object-cover blur-2xl opacity-30 scale-125 group-hover:opacity-50 transition"
            />
              </div>
              {/* Foreground avatar */}
              <div className="relative z-10 flex flex-col items-center w-full">
            <Avatar className="w-16 h-16 sm:w-20 sm:h-20 mb-3 sm:mb-4 border-background shadow-lg group-hover:border-primary transition">
              <AvatarImage
                src={iconUrl}
                alt={`${g.name} icon`}
              />
              <AvatarFallback className="text-sm sm:text-base">{g.name[0]}</AvatarFallback>
            </Avatar>
            <p className="text-base sm:text-lg font-semibold truncate w-full text-foreground group-hover:text-primary transition">{g.name}</p>
              </div>
            </Card>
          </Link>
            );
          })}
          {guilds.length === 0 && (
            <Card className="col-span-full flex flex-col items-center justify-center p-6 sm:p-10 bg-muted border border-border">
          <span className="text-3xl sm:text-4xl mb-2">😕</span>
          <p className="text-base sm:text-lg text-muted-foreground text-center px-2">No servers found. Try refreshing or check your permissions.</p>
            </Card>
          )}
        </div>
          </div>
        </div>
      </main>
    </>
  );
}
