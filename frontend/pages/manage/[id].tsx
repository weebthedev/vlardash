import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { fetchUser, fetchGuilds, fetchGuildDetails } from '../../lib/api';
import SettingsManager from '../../components/SettingsManager';
import { Shield, Hash, Folder } from 'lucide-react';
import { Config } from '../../config/config';

export default function ManageGuildPage() {
  const router = useRouter();
  const { id } = router.query;

  const [user, setUser] = useState<any>(null);
  const [guild, setGuild] = useState<any>(null);
  const [guildDetails, setGuildDetails] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(0);

  const [originalValues, setOriginalValues] = useState<Record<string, any>>({});
  const [currentValues, setCurrentValues] = useState<Record<string, any>>({});

  const unsaved = JSON.stringify(originalValues) !== JSON.stringify(currentValues);

  const config = Config;
  // const config = [
  //   {
  //     name: 'General',
  //     options: [
  //       { key: 'welcomeMessage', label: 'Welcome Message', type: 'text' },
  //       { key: 'logChannel', label: 'Log Channel', type: 'channel', allowed: ["Text"] },
  //     ],
  //   },
  //   {
  //     name: 'Moderation',
  //     options: [
  //       { key: 'autoBan', label: 'Auto Ban', type: 'toggle' },
  //       { key: 'modRole', label: 'Moderator Role', type: 'role' },
  //       { key: 'banThreshold', label: 'Ban Threshold', type: 'number' },
  //     ],
  //   },
  // ];

  useEffect(() => {
    if (!id) return;

    fetchUser()
      .then(setUser)
      .catch(() => router.push('/'));

    fetchGuilds().then((guilds) => {
      const g = guilds.find((g: any) => g.id === id);
      if (!g) return router.push('/dashboard');
      setGuild(g);
    }).catch(() => router.push("/"));

    fetchGuildDetails(id as string).then((details) => {
      setGuildDetails(details);

      const initialValues: Record<string, any> = {};

      config.forEach((tab) => {
        tab.options.forEach((opt) => {
          const defaultVal = opt.type === 'toggle' ? false : '';
          initialValues[opt.key] = details.settings?.[opt.key] ?? defaultVal;
        });
      });

      setOriginalValues(initialValues);
      setCurrentValues(initialValues);
    }).catch(() => router.push("/invite"));
  }, [id]);

  if (!user || !guild || !guildDetails) return null;

  const handleSettingChange = (key: string, value: any) => {
    setCurrentValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setCurrentValues(originalValues);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:3002/api/guilds/${id}/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(currentValues),
      });

      if (!res.ok) {
        throw new Error('Failed to save settings');
      }

      const updated = await res.json();
      setOriginalValues(updated);
      setCurrentValues(updated);
    } catch (err) {
      console.error(err);
      alert('Failed to save settings.');
    }
  };

  return (
    <>
      <Head>
        <title>{guild.name} | {[config[activeTab].name]}</title>
      </Head>
      <main className="min-h-screen bg-background text-white">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border px-6 py-4 flex items-center justify-between shadow-sm">
          <h1 className="text-xl font-bold truncate flex items-center gap-3">
            <img
              src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
              alt="Guild Icon"
              className="w-8 h-8 rounded-full"
            />
            {guild.name}
          </h1>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-gray-700 text-white px-3 py-1.5 rounded-md hover:bg-gray-600 transition"
            >
              ← Back to Servers
            </button>

            <div className="flex items-center gap-2">
              <span className="text-base font-semibold">{user.username}</span>
              <img
                src={
                  user.avatar
                    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                    : 'https://placehold.co/40x40'
                }
                alt="Avatar"
                className="w-10 h-10 rounded-full"
              />
            </div>
          </div>
        </nav>

        <div className="pt-20 flex min-h-screen">
          <aside className="w-64 bg-[#202020] border-r border-border border-t h-[calc(100vh-64px)] fixed top-16 left-0 flex flex-col">
            <nav className="p-4 space-y-2 flex-grow">
              {config.map((tab, i) => (
                <button
                  key={tab.name}
                  className={`w-full text-left px-3 py-2 rounded-md transition font-medium ${
                    activeTab === i
                      ? 'bg-[#383838] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-[#2e2e2e]'
                  }`}
                  onClick={() => setActiveTab(i)}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
            <div className="h-4" />
          </aside>

          <section className="ml-64 flex-1 px-4 pb-32 relative">
            <div className="py-6">
              <SettingsManager
                config={[config[activeTab]]}
                guildId={id as string}
                roles={guildDetails.roles}
                channels={guildDetails.channels}
                onChange={(key, value) => handleSettingChange(key, value)}
                values={currentValues}
              />
            </div>

            <div
              className={`fixed bottom-6 left-[270px] right-6 bg-[#2b2b2b] border border-[#444] rounded-lg px-6 py-4 flex items-center justify-between shadow-lg transition-all duration-300 ease-in-out transform ${
                unsaved ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
              }`}
              style={{ willChange: 'transform, opacity' }}
            >
              <span className="text-sm text-gray-300">You have unsaved settings</span>
              <div className="space-x-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-1.5 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition"
                >
                  Reset
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-500 transition"
                >
                  Save
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}