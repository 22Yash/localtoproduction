# Curriculum: 7 modules, 28 lessons

Each lesson has 6 to 10 steps, one animated diagram, four telemetry cards, a "Good to know" tip per step, a "Real-world equivalent" tip, and a "You'll learn" checklist.

## 01. Localhost Limits
1. What localhost hides: one machine, one process, no other users
2. Blocking I/O and the event loop: one slow request freezes everyone
3. PaaS vs IaaS vs VPS: what a "Deploy" button does for you
4. The target architecture: Users, NGINX, Node cluster, Redis, MongoDB (a preview of later modules)

## 02. Linux & Cloud VPS
1. Creating a VPS and your first SSH login
2. SSH keys and disabling password login
3. Users, sudo, and permissions (stop deploying as root)
4. UFW firewall (ports 22, 80, 443) and getting your code on the server

## 03. Process Management
1. Why `node server.js` dies (crash, closed terminal, reboot)
2. PM2 basics: `start`, `logs`, `restart`, `startup`, `save`
3. PM2 cluster mode: one instance per core, sharing a single port
4. Zero-downtime reload and limits: `pm2 reload`, `max_memory_restart`, `ecosystem.config.js`

## 04. NGINX & Load Balancing
1. Reverse proxy basics
2. Upstream blocks and algorithms: round robin, least connections, `ip_hash`
3. **NGINX load balancing & failover (flagship, 6 steps)**
   1. Single node
   2. Traffic spike
   3. Three Node instances
   4. NGINX round robin
   5. Node crash and failover
   6. Health recovery
4. Static files, gzip, rate limiting, and headers (`X-Forwarded-For`, WebSocket upgrade)

## 05. Redis Caching
1. The DB melts
2. Cache-aside pattern and TTL
3. Hit rate math (`0.95 × 1ms + 0.05 × 20ms = 2ms`)
4. Invalidation, stale data, and cache stampede

## 06. Domains & TLS/HTTPS
1. DNS and A records
2. TCP vs TLS handshake
3. Certbot and auto-renewal
4. Go-live checklist (capstone: one request traced through the whole stack)

## 07. How Big Companies Do It
1. Docker: package once, run anywhere
2. Kubernetes basics: pods, replicas, self-healing
3. Cloud load balancers, auto-scaling, and CDN
4. CI/CD and monitoring

## Notes
- The sidebar footer reads `x / 28`.
- Teaching order matters. Lesson 3.3 teaches cluster mode (shared port). The flagship lesson 4.3 uses separate processes on ports 5001 to 5003 so NGINX has distinct upstreams. See `docs/TECH_ACCURACY.md`.
