const express = require('express');
const axios = require('axios');
const router = express.Router();
const ensureAuth = require('../utils/ensureAuth');

const ADMIN_PERMISSION = 0x8;

router.get('/user', ensureAuth, (req, res) => {
  res.json(req.user);
});

router.get('/guilds', ensureAuth, (req, res) => {
  const adminGuilds = req.user.guilds.filter(guild => {
    const permissions = Number(guild.permissions);
    return (permissions & ADMIN_PERMISSION) === ADMIN_PERMISSION;
  });

  res.json(adminGuilds);
});

router.get('/guilds/:id', ensureAuth, async (req, res) => {
  const guildId = req.params.id;

  try {
    const guild = req.user.guilds.find(g => g.id === guildId);
    if (!guild) return res.status(403).json({ error: 'No access to guild' });

    const response = await axios.get(`https://discord.com/api/v10/guilds/${guildId}`, {
      headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` },
    });

    const [rolesRes, channelsRes] = await Promise.all([
      axios.get(`https://discord.com/api/v10/guilds/${guildId}/roles`, {
        headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` },
      }),
      axios.get(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
        headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` },
      }),
    ]);

    res.json({
      id: guildId,
      name: response.data.name,
      icon: response.data.icon,
      roles: rolesRes.data,
      channels: channelsRes.data//.filter(c => c.type === 0),
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch guild info' });
  }
});

router.get("/guilds/:id/settings", ensureAuth, async (req, res) => {
  res.json({ autoBan: true });
});

router.post("/guilds/:id/settings", ensureAuth, async (req, res) => {
  res.status(200).json(req.body); // dont remove
});

router.get('/refresh', ensureAuth, async (req, res) => {
  try {
    const response = await axios.get('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${req.user.accessToken}`,
      },
    });

    const guilds = response.data.filter(guild => {
      const permissions = Number(guild.permissions);
      return (permissions & ADMIN_PERMISSION) === ADMIN_PERMISSION;
    });

    req.user.guilds = guilds;

    res.json(guilds);
  } catch (err) {
    console.error('Error refreshing guilds:', err);
    res.status(500).json({ error: 'Failed to refresh guilds' });
  }
});

module.exports = router;
