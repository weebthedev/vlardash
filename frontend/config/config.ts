export const API_URL = "http://localhost:3002";

export const InviteURL = "https://discord.com/oauth2/authorize?client_id=1345020244145475688&scope=bot+applications.commands";

export const Config = [
    {
      name: 'General',
      options: [
        { key: 'welcomeMessage', label: 'Welcome Message', type: 'text' },
        { key: 'logChannel', label: 'Log Channel', type: 'channel', allowed: ["Text"] },
      ],
    },
    {
      name: 'Moderation',
      options: [
        { key: 'autoBan', label: 'Auto Ban', type: 'toggle' },
        { key: 'modRole', label: 'Moderator Role', type: 'role' },
        { key: 'banThreshold', label: 'Ban Threshold', type: 'number' },
      ],
    },
  ];