import { Lesson } from '../../types/course';

export const localhostHidesLesson: Lesson = {
  id: 'localhost-hides',
  moduleId: '01-localhost-limits',
  order: 1,
  title: 'What localhost hides',
  subtitle: 'One machine, one process, no other users.',
  minutes: 8,
  difficulty: 'Beginner',
  whyItMatters: 'Localhost creates a false sense of security by masking the networking, persistence, and reliability challenges that occur in real production.',
  realWorldEquivalent: 'Companies develop on laptops but run staging and production on managed servers or cloud infrastructure',
  steps: [
    // Step 1: Your laptop
    {
      id: 'step-1-your-laptop',
      shortLabel: 'Your laptop',
      title: 'Your Laptop: You Are the Only User on Loopback',
      category: 'ARCHITECTURE',
      explanation: [
        'When you run "npm run dev" or "node server.js", your application binds to localhost port 3000. You open your browser, hit http://localhost:3000, and everything loads instantly.',
        'Because your browser and server share the same machine, requests never touch a network card, Wi-Fi router, or external wire. You are the only person who can access this application.',
      ],
      goodToKnow: 'localhost is a domain alias that resolves to 127.0.0.1 (IPv4) or ::1 (IPv6). Packets sent to loopback are short-circuited entirely inside the operating system kernel.',
      nodes: [
        {
          id: 'you',
          kind: 'users',
          label: 'You',
          position: { x: 1, y: 1.8 },
          status: 'active',
          badge: 'browser',
        },
        {
          id: 'laptop',
          kind: 'node',
          label: 'Your laptop',
          sublabel: 'localhost:3000',
          position: { x: 5, y: 2.8 },
          status: 'active',
          badge: 'loopback',
        },
      ],
      flows: [
        { id: 'f-you-laptop', from: 'you', to: 'laptop', type: 'request', active: true, sequence: 1 },
        { id: 'f-laptop-you', from: 'laptop', to: 'you', type: 'response', active: true, sequence: 1 },
      ],
      telemetry: [
        { id: 'reachable', label: 'REACHABLE BY', value: '1 person', numeric: 1, icon: 'Activity' },
        { id: 'latency', label: 'LATENCY', value: '8 ms', numeric: 8, icon: 'Gauge' },
        { id: 'errors', label: 'ERRORS', value: '0%', numeric: 0, icon: 'AlertTriangle' },
        { id: 'uptime', label: 'UPTIME', value: '100%', numeric: 100, icon: 'Clock' },
      ],
      crowd: { users: 1 },
      learned: 'How localhost and loopback networking isolate your app to your own machine.',
    },

    // Step 2: A friend tries your link
    {
      id: 'step-2-friend-tries-link',
      shortLabel: 'Friend tries link',
      title: 'A Friend Tries Your Link: Loopback Rejects Outside Traffic',
      category: 'ARCHITECTURE',
      explanation: [
        'You share http://localhost:3000 with a friend so they can test your new feature. They paste it into their browser, but it fails immediately with "Connection Refused".',
        'On their machine, "localhost" points to their own loopback adapter—where your server is not running. Localhost means "this machine only", making it completely inaccessible to anyone else.',
      ],
      goodToKnow: 'A server listening on 127.0.0.1 instructs the OS to reject packets from external network interfaces. Even if someone knows your IP, a loopback socket cannot be reached from outside.',
      nodes: [
        {
          id: 'you',
          kind: 'users',
          label: 'You',
          position: { x: 1, y: 1.8 },
          status: 'active',
          badge: 'browser',
        },
        {
          id: 'friend',
          kind: 'users',
          label: 'Your friend',
          position: { x: 1, y: 3.8 },
          status: 'active',
          badge: 'connection refused',
        },
        {
          id: 'laptop',
          kind: 'node',
          label: 'Your laptop',
          sublabel: 'localhost:3000',
          position: { x: 5, y: 2.8 },
          status: 'active',
          badge: '127.0.0.1 only',
        },
      ],
      flows: [
        { id: 'f-you-laptop', from: 'you', to: 'laptop', type: 'request', active: true, sequence: 1 },
        { id: 'f-laptop-you', from: 'laptop', to: 'you', type: 'response', active: true, sequence: 1 },
        { id: 'f-friend-laptop', from: 'friend', to: 'laptop', type: 'blocked', active: true },
      ],
      telemetry: [
        { id: 'reachable', label: 'REACHABLE BY', value: '1 person', numeric: 1, icon: 'Activity' },
        { id: 'latency', label: 'LATENCY', value: '8 ms', numeric: 8, icon: 'Gauge' },
        { id: 'errors', label: 'ERRORS', value: 'connection refused', icon: 'AlertTriangle' },
        { id: 'uptime', label: 'UPTIME', value: '100%', numeric: 100, icon: 'Clock' },
      ],
      crowd: { users: 1 },
      learned: 'Why localhost links fail on any device other than your own computer.',
    },

    // Step 3: Even your Wi-Fi address does not help
    {
      id: 'step-3-no-public-ip',
      shortLabel: 'No public IP',
      title: 'Even Wi-Fi IPs Fail: Home Routers and NAT Block Incoming Requests',
      category: 'ARCHITECTURE',
      explanation: [
        'You find your Wi-Fi IP address (such as 192.168.1.42) and send that instead. If your friend is on another network, like their own home Wi-Fi or cellular data, it still fails.',
        'Your laptop sits behind a home router performing Network Address Translation (NAT). Addresses in the 192.168 range are private (RFC 1918) and cannot be routed across the public internet.',
      ],
      goodToKnow: 'Your home router shares a single public IP among all household devices using NAT. Without a dedicated public IP or port forwarding, external internet traffic has no path to your laptop.',
      nodes: [
        {
          id: 'you',
          kind: 'users',
          label: 'You',
          position: { x: 1, y: 1.8 },
          status: 'active',
          badge: '192.168.1.42',
        },
        {
          id: 'friend',
          kind: 'users',
          label: 'Your friend',
          position: { x: 1, y: 3.8 },
          status: 'active',
          badge: 'no public IP',
        },
        {
          id: 'laptop',
          kind: 'node',
          label: 'Your laptop',
          sublabel: 'localhost:3000',
          position: { x: 5, y: 2.8 },
          status: 'active',
          badge: 'behind NAT',
        },
      ],
      flows: [
        { id: 'f-you-laptop', from: 'you', to: 'laptop', type: 'request', active: true, sequence: 1 },
        { id: 'f-laptop-you', from: 'laptop', to: 'you', type: 'response', active: true, sequence: 1 },
        { id: 'f-friend-laptop', from: 'friend', to: 'laptop', type: 'blocked', active: true },
      ],
      telemetry: [
        { id: 'reachable', label: 'REACHABLE BY', value: '1 person', numeric: 1, icon: 'Activity' },
        { id: 'latency', label: 'LATENCY', value: '8 ms', numeric: 8, icon: 'Gauge' },
        { id: 'errors', label: 'ERRORS', value: 'unreachable', icon: 'AlertTriangle' },
        { id: 'uptime', label: 'UPTIME', value: '100%', numeric: 100, icon: 'Clock' },
      ],
      crowd: { users: 1 },
      learned: 'How private IP ranges (RFC 1918) and NAT prevent external access to your home machine.',
    },

    // Step 4: The laptop sleeps
    {
      id: 'step-4-laptop-sleeps',
      shortLabel: 'Laptop sleeps',
      title: 'The Laptop Sleeps: Developer Hardware Is Not an Always-On Server',
      category: 'FAILOVER',
      explanation: [
        'You shut your laptop lid or leave your desk. The operating system enters sleep mode, immediately halting the CPU, suspending RAM, and cutting off all network interfaces.',
        'A personal computer is not an always-on server. Production servers run in climate-controlled data centers with dual power grids and battery backups, engineered for uninterrupted 24/7 uptime.',
      ],
      goodToKnow: 'Consumer operating systems prioritize power saving and battery health by sleeping idle processes. Production Linux servers disable sleep states to ensure zero interruption.',
      nodes: [
        {
          id: 'you',
          kind: 'users',
          label: 'You',
          position: { x: 1, y: 1.8 },
          status: 'active',
          badge: 'browser',
        },
        {
          id: 'laptop',
          kind: 'node',
          label: 'Your laptop',
          sublabel: 'localhost:3000',
          position: { x: 5, y: 2.8 },
          status: 'crashed',
          badge: 'asleep',
        },
      ],
      flows: [
        { id: 'f-you-laptop', from: 'you', to: 'laptop', type: 'request', active: false },
      ],
      telemetry: [
        { id: 'reachable', label: 'REACHABLE BY', value: '0 users', numeric: 0, icon: 'Activity' },
        { id: 'latency', label: 'LATENCY', value: 'timeout', icon: 'Gauge' },
        { id: 'errors', label: 'ERRORS', value: '100%', numeric: 100, icon: 'AlertTriangle' },
        { id: 'uptime', label: 'UPTIME', value: '0%', numeric: 0, icon: 'Clock' },
      ],
      crowd: { users: 1 },
      learned: 'Why production requires always-on server infrastructure rather than personal developer devices.',
    },

    // Step 5: One machine, one process
    {
      id: 'step-5-one-machine',
      shortLabel: 'One machine',
      title: 'One Machine, One Process: The Fragility of a Single Point of Failure',
      category: 'ARCHITECTURE',
      explanation: [
        'Even if your laptop were somehow accessible online, running a production workload on a single machine with a single Node.js process creates a catastrophic Single Point of Failure (SPOF).',
        'With 200 concurrent users hitting one unmonitored Node process, memory surges and the CPU pins at 96%. If an unhandled error triggers, the process crashes and every single user is disconnected.',
      ],
      goodToKnow: 'A Single Point of Failure (SPOF) is any component whose breakdown brings down the entire application. Without clustering or redundancy, one crash means complete downtime.',
      nodes: [
        {
          id: 'users',
          kind: 'users',
          label: 'Users',
          position: { x: 1, y: 2.8 },
          status: 'active',
          badge: '200 online',
        },
        {
          id: 'laptop',
          kind: 'node',
          label: 'Your laptop',
          sublabel: 'port 3000',
          position: { x: 5, y: 2.8 },
          status: 'overloaded',
          badge: 'CPU 96%',
        },
      ],
      flows: [
        { id: 'f-users-laptop', from: 'users', to: 'laptop', type: 'request', active: true, sequence: 1 },
        { id: 'f-laptop-users', from: 'laptop', to: 'users', type: 'response', active: true, sequence: 1 },
      ],
      telemetry: [
        { id: 'reachable', label: 'REACHABLE BY', value: '200 users', numeric: 200, icon: 'Activity' },
        { id: 'latency', label: 'LATENCY', value: '3,420 ms', numeric: 3420, icon: 'Gauge' },
        { id: 'errors', label: 'ERRORS', value: '28.4%', numeric: 28.4, icon: 'AlertTriangle' },
        { id: 'uptime', label: 'UPTIME', value: 'degraded', icon: 'Clock' },
      ],
      crowd: { users: 200 },
      learned: 'How a single process architecture creates a catastrophic Single Point of Failure (SPOF).',
    },

    // Step 6: What production needs
    {
      id: 'step-6-production-needs',
      shortLabel: 'Production needs',
      title: 'What Production Needs: The Five Pillars of Real Deployment',
      category: 'ARCHITECTURE',
      explanation: [
        'Real production infrastructure requires five core pillars: a static Public IP, an always-on host, a process manager (PM2), a reverse proxy (NGINX), and HTTPS encryption.',
        'In the upcoming modules, we will build each layer on real Linux infrastructure: setting up a cloud VPS, securing SSH and firewalls, managing clustered Node processes, and configuring NGINX.',
      ],
      goodToKnow: 'Production readiness is not about pushing code to a mysterious black-box. Learning the underlying Linux and networking layers gives you complete control and the ability to diagnose real production incidents.',
      nodes: [
        {
          id: 'users',
          kind: 'users',
          label: 'Users',
          position: { x: 1, y: 2.8 },
          status: 'active',
          badge: 'global internet',
        },
        {
          id: 'laptop',
          kind: 'node',
          label: 'Production Server',
          sublabel: 'target arch',
          position: { x: 5, y: 2.8 },
          status: 'active',
          badge: 'ready',
        },
      ],
      flows: [
        { id: 'f-users-laptop', from: 'users', to: 'laptop', type: 'request', active: true, sequence: 1 },
        { id: 'f-laptop-users', from: 'laptop', to: 'users', type: 'response', active: true, sequence: 1 },
      ],
      telemetry: [
        { id: 'reachable', label: 'REACHABLE BY', value: 'Public web', icon: 'Activity' },
        { id: 'latency', label: 'LATENCY', value: '24 ms', numeric: 24, icon: 'Gauge' },
        { id: 'errors', label: 'ERRORS', value: '0.0%', numeric: 0, icon: 'AlertTriangle' },
        { id: 'uptime', label: 'UPTIME', value: '99.9%', numeric: 99.9, icon: 'Clock' },
      ],
      crowd: { users: 200 },
      learned: 'The 5 production requirements: public IP, always-on host, process manager, reverse proxy, and HTTPS.',
    },
  ],
};
