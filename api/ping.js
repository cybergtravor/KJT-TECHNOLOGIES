'use strict';
// Simple health-check endpoint — GET /api/ping → { ok: true }
module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({ ok: true, time: new Date().toISOString(), env_set: !!process.env.BREVO_API_KEY });
};
