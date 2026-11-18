# Technical accuracy notes

Check this file before writing lesson text. These are the facts most likely to be taught wrongly.

## PM2: cluster mode vs separate processes
- **Cluster mode** (`pm2 start server.js -i max`) runs several instances that **share one port**. Node's cluster module distributes connections. You cannot give each instance its own port in this mode.
- To get **separate ports** (5001, 5002, 5003), run separate processes in **fork mode** with different `PORT` environment variables. NGINX `upstream` then lists three servers.
- Teach lesson 3.3 as cluster mode. Teach the flagship lesson 4.3 as three separate processes, and say so explicitly so learners are not confused.
- Persist across reboots with `pm2 startup` then `pm2 save`.
- `pm2 reload` gives zero-downtime restarts in cluster mode. In fork mode it behaves like a restart.

## NGINX health checks and failover
- Open-source NGINX has **passive** health checks only: `max_fails` and `fail_timeout` on the `server` line in an `upstream` block. A server is marked unavailable after failures, then retried after `fail_timeout`.
- **Active** health checks (probing a health endpoint on a schedule) are **NGINX Plus**, which is commercial. Do not present them as available in the free version.
- Failover to the next server on error is controlled by `proxy_next_upstream`.
- "Health recovery" in the flagship lesson is therefore passive: after `fail_timeout`, NGINX tries the server again and, if it succeeds, it rejoins the pool.

## Load balancing algorithms
- Default is **round robin**. `least_conn` sends to the server with the fewest active connections. `ip_hash` pins a client IP to a server. Round robin can be weighted with `weight=`.
- Round robin is deterministic: request 1 goes to server 1, request 2 to server 2, and so on. Animations must reflect this.

## Redis caching
- Pattern taught is **cache-aside**: read cache, on miss read DB, then write to cache with a TTL.
- On POST/PUT/DELETE, **invalidate** (delete) the affected keys, or update them. Explain the stale-data risk if you do not.
- Cache stampede: many requests miss at once after a hot key expires. Mention mitigations (locking, jittered TTLs).
- Hit rate math: average read time = `hit_rate × cache_time + (1 − hit_rate) × db_time`. Example: `0.95 × 1 + 0.05 × 20 = 1.95`, shown as about 2 ms. Use the same rounding everywhere.

## Linux and security
- Stop using `root` for deployment. Create a non-root user with `sudo`.
- Prefer SSH keys, then disable password login (`PasswordAuthentication no`). Warn to keep a second session open while changing SSH config.
- UFW: allow `OpenSSH` (22) **before** enabling the firewall, then allow 80 and 443. Enabling UFW without allowing SSH locks you out.

## TLS and DNS
- An **A record** maps a hostname to an IPv4 address. DNS changes can take time to propagate because of TTLs.
- HTTPS = TCP handshake first, then TLS handshake, then the HTTP request.
- Certbot with NGINX issues Let's Encrypt certificates, which are valid for a limited time. Renewal runs from a systemd timer or cron. Teach "auto-renewal" and how to test it with `certbot renew --dry-run`.

## Honesty about scale
- A single VPS with NGINX in front is still a **single point of failure**. State this plainly.
- Big companies usually use Docker and Kubernetes, managed load balancers, managed Redis and databases, CDNs, CI/CD, and monitoring. Module 7 covers this.

## Telemetry numbers
- Numbers such as `180 ms → 12 ms` are **illustrative simulation values**, not measured benchmarks.
