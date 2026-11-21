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

## SSH and first login
- **Host key prompt**: On the first connection to a remote server, the SSH client checks `~/.ssh/known_hosts`. Since no record exists yet, SSH prompts the user to verify the remote host's cryptographic public key fingerprint (typically Ed25519 or RSA). This verification prevents Man-in-the-Middle (MITM) attacks. Users should ideally compare this fingerprint with the console fingerprint shown in the VPS provider's dashboard before typing `yes`.
- **Port 22**: Default standard IANA network port for SSH (Secure Shell).
- **Default users**: Many VPS providers provision standard images with `root` and a temporary password or pre-installed SSH key, while others (like AWS EC2, GCP, or official cloud-init images) default to an unprivileged administrative user such as `ubuntu` or `debian` with passwordless `sudo` TODO(verify).
- **Encryption**: SSH encrypts all communications (credentials, interactive shell input, and output) over an encrypted channel using symmetric ciphers (e.g. ChaCha20-Poly1305, AES-GCM) negotiated during the initial key exchange.
- **Authentication logging**: On Ubuntu LTS systems, SSH login successes and failures are written to `/var/log/auth.log` (or accessed via `journalctl -u ssh` on recent systemd-journald setups TODO(verify)).
- **Automated bot scanning**: Public IPv4 addresses are relentlessly scanned by automated internet botnets on port 22 attempting dictionary attacks against `root`. Leaving password authentication enabled on public port 22 is an immediate security liability.
- **Key pair roles**: Asymmetric cryptography generates an Ed25519 or RSA key pair. The private key (`~/.ssh/id_ed25519`) must NEVER leave the client laptop and should be encrypted with a local passphrase. The public key (`~/.ssh/id_ed25519.pub`) is safe to share publicly and append to remote servers.
- **authorized_keys**: The remote server stores authorized public keys in `~/.ssh/authorized_keys`. File permissions must be strict (`chmod 700 ~/.ssh` and `chmod 600 ~/.ssh/authorized_keys`); sshd will reject keys if the file or directory is group- or world-writable.
- **ssh-copy-id availability**: `ssh-copy-id` is a standard helper script on macOS and Linux that appends public keys with correct permissions. On Windows, `ssh-keygen` ships with OpenSSH in PowerShell, but `ssh-copy-id` is often omitted by default, requiring users to manually copy the public key string into `~/.ssh/authorized_keys` TODO(verify).
- **Testing before lockout**: Always keep an existing authenticated SSH terminal session open as a safety net, and open a second terminal window to verify key-based authentication works before turning off password login.
- **sshd_config and drop-in files**: The primary daemon configuration resides in `/etc/ssh/sshd_config`. On modern Ubuntu LTS releases, drop-in files in `/etc/ssh/sshd_config.d/` (such as `50-cloud-init.conf`) can re-enable `PasswordAuthentication yes` and override edits to the main file. Always verify the active effective configuration with `sudo sshd -T | grep -i passwordauthentication` TODO(verify).
- **Config testing**: Always run `sudo sshd -t` to validate configuration syntax before reloading the daemon. Invalid directives will fail the test, preventing a broken config from locking out future connections.
- **Service name on Ubuntu**: The SSH daemon systemd service on Ubuntu/Debian is named `ssh` (e.g. `sudo systemctl reload ssh`), whereas RHEL/CentOS systems name it `sshd` TODO(verify). Reloading the service updates configuration for new connections without terminating active sessions.

## Users, sudo and permissions
- **Least privilege and why not root**: The `root` account (UID 0) has unrestricted superuser authority over the entire Linux system. Running web applications as `root` violates least privilege: any remote code execution vulnerability, dependency compromise, or arbitrary file write in the app allows an attacker to take over the entire server. Furthermore, human typos executed as `root` can irrevocably delete operating system files or databases.
- **adduser vs useradd**: On Debian and Ubuntu systems, `adduser` is a high-level, interactive Perl wrapper around the low-level `useradd` utility. `adduser` creates the user's home directory (`/home/<username>`), copies default dotfiles from `/etc/skel`, sets up a primary group with matching name and UID/GID (typically starting at 1000 for interactive users), establishes correct permissions, and prompts to set an account password. In contrast, `useradd` requires explicit flags (`-m -s /bin/bash`) and leaves the account locked without a password unless separately configured.
- **The sudo group on Ubuntu**: Members of the `sudo` group are granted elevated administrative access defined in `/etc/sudoers` (`%sudo ALL=(ALL:ALL) ALL`). Commands run through `sudo` execute with `root` privileges while requiring the user's personal password (not the `root` password), preventing shared credentials. Furthermore, every command executed via `sudo` is logged to system journals (`/var/log/auth.log` or `journalctl`), providing an audit trail. On RHEL/CentOS systems, the administrative group is named `wheel` instead of `sudo` TODO(verify).
- **Secondary group assignment**: Adding a user to the `sudo` group requires the `-aG` flags with `usermod` (`usermod -aG sudo <username>`). The `-a` (append) flag is critical; omitting `-a` removes the user from all other supplementary groups. Group membership changes take effect on the user's next login session.
- **Authorized keys and permission bits**: SSH strictly enforces UNIX file permissions on `~/.ssh` and `~/.ssh/authorized_keys`. Directory permissions must be `700` (`drwx------` - read, write, execute for owner only) and file permissions must be `600` (`-rw-------` - read and write for owner only). If permissions permit group or other write access (e.g. `777`), the OpenSSH daemon's `StrictModes` check will silently ignore `authorized_keys` and reject key logins. Never attempt to "fix" permission errors by running `chmod 777`.
- **PermitRootLogin default**: In OpenSSH, the default value for `PermitRootLogin` on modern Ubuntu installations is `prohibit-password` (allowing public key logins for root, but disallowing password logins) TODO(verify). Explicitly setting `PermitRootLogin no` completely disables all interactive SSH access for `root`, forcing all logins to authenticate through an unprivileged user before elevating via `sudo`.
- **Keep-a-session-open rule**: Always maintain an established active SSH session while modifying user accounts, group memberships, permissions, or `/etc/ssh/sshd_config`. Test newly created credentials and SSH access from a second local terminal window before closing the administrative session. As in lesson 2.2, Ubuntu drop-in configs inside `/etc/ssh/sshd_config.d/*.conf` can override `/etc/ssh/sshd_config`, so always test syntax with `sudo sshd -t` and verify active settings with `sudo sshd -T | grep -i permitrootlogin` TODO(verify).

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
