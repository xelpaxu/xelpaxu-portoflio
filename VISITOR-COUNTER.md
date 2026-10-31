# Portfolio visitor counter

The GitHub section includes portfolio visits and visitors active within the last minute.
These are site sessions, not GitHub profile views or verified unique people.

- One visit is counted per anonymous 30-minute session. Heartbeats and reloads within that session do not add visits.
- Visible tabs send a heartbeat every 20 seconds; hidden tabs pause.
- An anonymous, HttpOnly cookie identifies the session, with session storage to keep initial requests idempotent. No IP addresses or names are stored.
- Development uses `.data/visits.json`, which survives server restarts and is ignored by Git.

## Production

Provision an Upstash Redis database and set these server-only environment variables in your host:

```
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-server-token
```

Redis updates the total and active sessions atomically across server instances.
Without a configured store, production displays “Live count unavailable” instead of an invented count.
The counter starts at zero in a new store and does not recover historic visits.

## GitHub profile badge views

After deploying and configuring Redis, add this to `xelpaxu/xelpaxu`'s profile `README.md`, replacing `YOUR-DOMAIN` with the deployed hostname:

```markdown
![Profile badge views](https://YOUR-DOMAIN/api/github/profile-views/badge)
```

The badge increments a separate counter. Portfolio heartbeats only read this value;
the tracking image is never embedded in the portfolio, so site visitors don't inflate it.
This tracks badge requests starting when you add the badge, not historical views or unique people.
GitHub's image proxy caches images, so the value is approximate and can update with a delay.
It is not a real-time count of everyone viewing the GitHub profile. The UI refreshes the available value every 20 seconds.
No profile README is modified automatically by this implementation.
