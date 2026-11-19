# Technical accuracy notes

Check this file before writing lesson text. These are the facts most likely to be taught wrongly.

## Localhost, loopback and NAT
- `localhost` resolves to the loopback interface (`127.0.0.1` in IPv4, `::1` in IPv6). Packets sent to loopback stay entirely within the operating system kernel and never traverse physical network interfaces (Ethernet or Wi-Fi).
- A process listening explicitly on `127.0.0.1` or `localhost` rejects any external connection, even from devices on the exact same Wi-Fi network.
- Binding to `0.0.0.0` (all interfaces / `INADDR_ANY`) allows devices on the same local area network (LAN) to connect using the host's private LAN IP (e.g. `192.168.1.x:3000`), provided local OS firewalls (e.g. Windows Defender, macOS firewall) allow incoming traffic.
- Private IPv4 address blocks (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) are non-routable over the public internet per RFC 1918.
- Home and office routers use Network Address Translation (NAT) to map many internal private IPs to a single public IP. Inbound requests from the public internet cannot reach an internal device without explicit port forwarding or an established outbound tunnel (e.g. ngrok, Cloudflare Tunnel).
- Developer laptops are not servers: consumer operating systems suspend execution on lid close or inactivity, Wi-Fi connections drop and change IPs dynamically, and consumer hardware lacks redundant power, cooling, or uptime guarantees.
- A single Node.js process on a single machine is a Single Point of Failure (SPOF): an uncaught exception, memory leak, or machine sleep drops all connected clients immediately.

## Event loop and blocking
- **Single-threaded JavaScript execution**: Node.js executes application JavaScript code on a single thread (the call stack). It does not execute JavaScript statements across multiple CPU cores simultaneously within a single process.
- **Non-blocking I/O**: Asynchronous operations (network sockets, database queries, file system calls via libuv thread pool) run in the background. While waiting for I/O to complete, the event loop continues cycling and processing other incoming events and requests. "One thread" does not mean "one thing at a time".
- **CPU blocking**: Synchronous compute-intensive code (e.g. giant JSON serialization/parsing, regex catastrophic backtracking, synchronous cryptography, complex sorting loops) hogs the call stack. While synchronous code executes, the event loop is completely frozen and cannot pick up new connections or fire ready callbacks, stalling all other users.
- **Solutions for heavy tasks**:
  - Offload CPU-bound computation to worker threads (`worker_threads`) or dedicated background worker services/queues (e.g. Redis + BullMQ).
  - Use streaming or chunked asynchronous APIs instead of giant synchronous operations.
  - Scale to multiple processes using Node's `cluster` module or process managers like PM2 to utilize multi-core CPUs.

## PaaS, IaaS and VPS
- **PaaS (Platform as a Service)** (e.g. Render, Vercel, Railway, Heroku):
  - Developer supplies code or a repository link.
  - The platform manages the build pipeline, OS patching, runtime environment, load balancing, automatic HTTPS certificates, reverse proxy routing, log aggregation, and vertical/horizontal scaling.
  - Trade-off: High developer velocity and minimal maintenance, but lower architectural control, potential vendor lock-in, and significantly higher cost at scale (CPU, RAM, bandwidth markups).
- **IaaS (Infrastructure as a Service)** (e.g. AWS EC2, Google Compute Engine, Azure VMs):
  - Provider provisions raw virtualized compute (VMs), VPC networking, block storage, and security groups.
  - The developer/organization manages the OS installation, kernel updates, security patching, runtime setup (Node, Python), process supervisors, web servers, and application deployments.
  - Trade-off: Maximum architectural flexibility and ecosystem integration, but requires dedicated DevOps skills and complex pricing/configuration.
- **VPS (Virtual Private Server)** (e.g. DigitalOcean, Hetzner, Linode/Akamai):
  - A sliced virtual machine running on shared host hardware with full `root` access.
  - Typically offers simple, predictable, fixed monthly billing (e.g. ~$4–$6/month for entry tiers TODO(verify)).
  - Trade-off: Cost-effective and straightforward for learning and small-to-medium production workloads, but requires the developer to manage Linux administration, security, backups, and failover manually.
- **Category overlap**:
  - The boundaries between VPS and IaaS are blurry and not strict; many modern VPS providers offer block storage, private networking, firewalls, and managed databases, while IaaS providers offer lightweight VPS-like tiers (e.g. AWS Lightsail TODO(verify)).
  - Production architectures commonly blend these paradigms: using PaaS for frontend/edge workloads and managed databases, with VPS or cloud VMs for backend compute.

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
