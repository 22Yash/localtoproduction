import { Lesson } from '../../types/course';

export const vpsFirstSshLesson: Lesson = {
  id: 'vps-first-ssh',
  moduleId: '02-linux-cloud-vps',
  order: 1,
  title: 'Creating a VPS and your first SSH login',
  subtitle: 'Spinning up an Ubuntu LTS server, connecting via SSH, and verifying host keys.',
  minutes: 10,
  difficulty: 'Beginner',
  whyItMatters: 'A cloud VPS gives you an isolated, publicly routable Linux environment, but understanding SSH and host keys is vital to avoid man-in-the-middle attacks and security compromises.',
  realWorldEquivalent: 'Companies rarely log in by hand; they use automation, SSH key management or bastion hosts',
  steps: [
    // Step 1: Rent a server
    {
      id: 'step-1-rent-server',
      shortLabel: 'Rent a server',
      title: 'Rent a Server: Provisioning an Ubuntu LTS Cloud VPS',
      category: 'ARCHITECTURE',
      explanation: [
        'You choose a cloud VPS provider, pick a data center region close to your users, select an Ubuntu LTS image, and choose a size (e.g. 1 vCPU, 1 GB RAM). Ubuntu LTS receives five years of security maintenance, making it the standard baseline for production servers.',
        'The cloud provider allocates virtual hardware and assigns a dedicated public IPv4 address (here, documentation IP 203.0.113.10). While booting, cloud-init initializes network interfaces and generates the server\'s initial SSH host keys.',
      ],
      goodToKnow: 'Ubuntu LTS (Long Term Support) releases provide a stable, predictable foundation. Cloud providers automatically run cloud-init on first boot to configure networking and generate cryptographic host keys.',
      nodes: [
        {
          id: 'laptop',
          kind: 'custom',
          label: 'Your laptop',
          sublabel: 'client terminal',
          position: { x: 1.3, y: 1.5 },
          status: 'active',
          badge: 'client',
        },
        {
          id: 'vps',
          kind: 'custom',
          label: 'Ubuntu VPS',
          sublabel: '203.0.113.10',
          position: { x: 5.0, y: 1.5 },
          status: 'recovering',
          badge: 'creating',
        },
      ],
      flows: [],
      telemetry: [
        { id: 'status', label: 'STATUS', value: 'creating', icon: 'Activity' },
        { id: 'ip', label: 'PUBLIC IP', value: '203.0.113.10', icon: 'Server' },
        { id: 'ssh', label: 'SSH', value: 'initializing', icon: 'Shield' },
        { id: 'failed', label: 'FAILED LOGINS', value: '0', numeric: 0, icon: 'AlertTriangle' },
      ],
      terminal: {
        title: 'provider dashboard',
        lines: [
          { kind: 'comment', text: '# provider dashboard: server status is running (IPv4: 203.0.113.10)' },
        ],
      },
      learned: 'Module 2.1: Renting an Ubuntu LTS cloud VPS and receiving a public IPv4 address.',
    },

    // Step 2: First connection
    {
      id: 'step-2-first-connection',
      shortLabel: 'First connection',
      title: 'First Connection: SSH Handshake and Host Key Verification',
      category: 'CONFIG',
      explanation: [
        'From your laptop terminal, you connect using "ssh root@203.0.113.10". Because your laptop has never connected to this IP before, SSH prompts you to verify the remote host\'s cryptographic key fingerprint.',
        'This prompt prevents Man-in-the-Middle (MITM) attacks. You should compare the displayed fingerprint with the console fingerprint shown in your provider\'s management dashboard before typing "yes".',
      ],
      goodToKnow: 'Typing "yes" saves the server public key into ~/.ssh/known_hosts. If someone later intercepts your traffic or changes the server key, SSH alerts you with a loud "REMOTE HOST IDENTIFICATION HAS CHANGED" warning.',
      nodes: [
        {
          id: 'laptop',
          kind: 'custom',
          label: 'Your laptop',
          sublabel: 'SSH client',
          position: { x: 1.3, y: 1.5 },
          status: 'active',
          badge: 'verifying',
        },
        {
          id: 'vps',
          kind: 'custom',
          label: 'Ubuntu VPS',
          sublabel: '203.0.113.10:22',
          position: { x: 5.0, y: 1.5 },
          status: 'active',
          badge: 'host key check',
        },
      ],
      flows: [
        { id: 'f-laptop-vps', from: 'laptop', to: 'vps', type: 'request', active: true, sequence: 1 },
      ],
      telemetry: [
        { id: 'status', label: 'STATUS', value: 'running', icon: 'Activity' },
        { id: 'ip', label: 'PUBLIC IP', value: '203.0.113.10', icon: 'Server' },
        { id: 'ssh', label: 'SSH', value: 'host key check', icon: 'Shield' },
        { id: 'failed', label: 'FAILED LOGINS', value: '0', numeric: 0, icon: 'AlertTriangle' },
      ],
      terminal: {
        title: 'terminal: laptop',
        lines: [
          { kind: 'command', text: 'ssh root@203.0.113.10' },
          { kind: 'comment', text: '# Client initiates TCP connection to remote port 22' },
          { kind: 'output', text: "The authenticity of host '203.0.113.10 (203.0.113.10)' can't be established." },
          { kind: 'output', text: 'ED25519 key fingerprint is SHA256:eX4mpL3+D0cum3nt4t10n+H0stK3yF1ng3rpr1nt+001.' },
          { kind: 'output', text: 'Are you sure you want to continue connecting (yes/no/[fingerprint])? yes', highlight: true },
          { kind: 'output', text: "Warning: Permanently added '203.0.113.10' (ED25519) to the list of known hosts." },
        ],
      },
      learned: 'Host Key Verification: Comparing fingerprints to prevent Man-in-the-Middle attacks.',
    },

    // Step 3: Logged in
    {
      id: 'step-3-logged-in',
      shortLabel: 'Logged in',
      title: 'Logged In: Password Authentication and the Remote Shell',
      category: 'TECHNIQUE',
      explanation: [
        'After trusting the host key, SSH prompts for the user password. When typing a password in a UNIX terminal, no characters or asterisks appear—this is an intentional security design to prevent shoulder surfing.',
        'Once authenticated, the server presents its Message of the Day (MOTD) banner and opens an interactive shell prompt: "root@vps:~#". You now have complete administrative control over this cloud machine.',
      ],
      goodToKnow: 'In UNIX shell prompts, "$" denotes an unprivileged user, while "#" denotes the root superuser. Root has unrestricted power to modify system files, install software, and reconfigure networking.',
      nodes: [
        {
          id: 'laptop',
          kind: 'custom',
          label: 'Your laptop',
          sublabel: 'SSH client',
          position: { x: 1.3, y: 1.5 },
          status: 'active',
          badge: 'connected',
        },
        {
          id: 'vps',
          kind: 'custom',
          label: 'Ubuntu VPS',
          sublabel: '203.0.113.10:22',
          position: { x: 5.0, y: 1.5 },
          status: 'active',
          badge: 'authenticated',
        },
      ],
      flows: [
        { id: 'f-laptop-vps', from: 'laptop', to: 'vps', type: 'request', active: true, sequence: 1 },
        { id: 'f-vps-laptop', from: 'vps', to: 'laptop', type: 'response', active: true, sequence: 1 },
      ],
      telemetry: [
        { id: 'status', label: 'STATUS', value: 'running', icon: 'Activity' },
        { id: 'ip', label: 'PUBLIC IP', value: '203.0.113.10', icon: 'Server' },
        { id: 'ssh', label: 'SSH', value: 'password', icon: 'Shield' },
        { id: 'failed', label: 'FAILED LOGINS', value: '0', numeric: 0, icon: 'AlertTriangle' },
      ],
      terminal: {
        title: 'ssh: root@203.0.113.10',
        lines: [
          { kind: 'output', text: "root@203.0.113.10's password: [placeholder]" },
          { kind: 'output', text: 'Welcome to Ubuntu LTS (GNU/Linux 6.8.0-generic x86_64)' },
          { kind: 'comment', text: '# System status at login time' },
          { kind: 'output', text: '  System load:  0.08               Processes:             102' },
          { kind: 'output', text: '  Usage of /:   14.2% of 24.5GB    IPv4 address for eth0: 203.0.113.10' },
          { kind: 'output', text: '  Memory usage: 18%                Swap usage:            0%' },
          { kind: 'output', text: 'root@vps:~#', highlight: true },
        ],
      },
      learned: 'Remote Shell: Logging in over SSH and recognizing the root shell prompt.',
    },

    // Step 4: What just happened
    {
      id: 'step-4-what-happened',
      shortLabel: 'What happened',
      title: 'What Just Happened: Encrypted Tunnels and Remote Execution',
      category: 'ARCHITECTURE',
      explanation: [
        'Every keystroke you type is encrypted by your local SSH client, transmitted across the internet on TCP port 22, decrypted by the VPS kernel, and executed by the server\'s bash process.',
        'Running "whoami", "pwd", and "hostname" proves execution context: your identity is "root", your current working directory is "/root", and the host is "vps-prod-01"—completely separate from your laptop.',
      ],
      goodToKnow: 'SSH (Secure Shell) replaces legacy telnet and rlogin protocols, which transmitted passwords and terminal sessions in clear text. SSH uses end-to-end symmetric encryption to guarantee privacy and integrity.',
      nodes: [
        {
          id: 'laptop',
          kind: 'custom',
          label: 'Your laptop',
          sublabel: 'local terminal',
          position: { x: 1.3, y: 1.5 },
          status: 'active',
          badge: 'encrypted',
        },
        {
          id: 'vps',
          kind: 'custom',
          label: 'Ubuntu VPS',
          sublabel: 'remote kernel',
          position: { x: 5.0, y: 1.5 },
          status: 'active',
          badge: 'root shell',
        },
      ],
      flows: [
        { id: 'f-laptop-vps', from: 'laptop', to: 'vps', type: 'request', active: true, sequence: 1 },
        { id: 'f-vps-laptop', from: 'vps', to: 'laptop', type: 'response', active: true, sequence: 1 },
      ],
      telemetry: [
        { id: 'status', label: 'STATUS', value: 'running', icon: 'Activity' },
        { id: 'ip', label: 'PUBLIC IP', value: '203.0.113.10', icon: 'Server' },
        { id: 'ssh', label: 'SSH', value: 'encrypted (p22)', icon: 'Shield' },
        { id: 'failed', label: 'FAILED LOGINS', value: '0', numeric: 0, icon: 'AlertTriangle' },
      ],
      terminal: {
        title: 'ssh: root@203.0.113.10',
        lines: [
          { kind: 'command', text: 'whoami' },
          { kind: 'output', text: 'root' },
          { kind: 'command', text: 'pwd' },
          { kind: 'output', text: '/root' },
          { kind: 'command', text: 'hostname' },
          { kind: 'output', text: 'vps-prod-01' },
          { kind: 'comment', text: '# Commands execute on the remote machine, not your local laptop' },
          { kind: 'output', text: 'root@vps-prod-01:~#', highlight: true },
        ],
      },
      learned: 'Encrypted Tunnel: How SSH encrypts port 22 traffic and executes commands remotely.',
    },

    // Step 5: Look around
    {
      id: 'step-5-look-around',
      shortLabel: 'Look around',
      title: 'Look Around: Inspecting Server Hardware (CPU, RAM, Disk)',
      category: 'CONFIG',
      explanation: [
        'Before installing Node or deploying apps, inspect the rented hardware. "nproc" displays available CPU cores, "free -h" reveals memory and swap buffers, and "df -h /" checks root SSD storage.',
        'Our entry VPS provides 1 vCPU, ~1 GB RAM, and ~25 GB disk. When hosting Node.js and database services on 1 GB of memory, monitoring RAM usage is critical to prevent Out-Of-Memory (OOM) kernel kills.',
      ],
      goodToKnow: 'In "free -h", focus on the "available" column rather than "free". Linux caches disk reads in otherwise idle RAM; this cached memory is instantly released when running applications need it.',
      nodes: [
        {
          id: 'laptop',
          kind: 'custom',
          label: 'Your laptop',
          sublabel: 'local terminal',
          position: { x: 1.3, y: 1.5 },
          status: 'active',
          badge: 'inspecting',
        },
        {
          id: 'vps',
          kind: 'custom',
          label: 'Ubuntu VPS',
          sublabel: '1 core · 1GB · 25GB',
          position: { x: 5.0, y: 1.5 },
          status: 'active',
          badge: '1 vCPU',
        },
      ],
      flows: [
        { id: 'f-laptop-vps', from: 'laptop', to: 'vps', type: 'request', active: true, sequence: 1 },
        { id: 'f-vps-laptop', from: 'vps', to: 'laptop', type: 'response', active: true, sequence: 1 },
      ],
      telemetry: [
        { id: 'status', label: 'STATUS', value: 'running', icon: 'Activity' },
        { id: 'ip', label: 'PUBLIC IP', value: '203.0.113.10', icon: 'Server' },
        { id: 'ssh', label: 'SSH', value: 'active session', icon: 'Shield' },
        { id: 'failed', label: 'FAILED LOGINS', value: '0', numeric: 0, icon: 'AlertTriangle' },
      ],
      terminal: {
        title: 'ssh: root@vps-prod-01',
        lines: [
          { kind: 'command', text: 'nproc' },
          { kind: 'output', text: '1' },
          { kind: 'command', text: 'free -h' },
          { kind: 'output', text: '               total        used        free      shared  buff/cache   available' },
          { kind: 'output', text: 'Mem:           961Mi       182Mi       430Mi       1.0Mi       348Mi       779Mi' },
          { kind: 'output', text: 'Swap:             0B          0B          0B' },
          { kind: 'command', text: 'df -h /' },
          { kind: 'output', text: 'Filesystem      Size  Used Avail Use% Mounted on' },
          { kind: 'output', text: '/dev/vda1        25G  3.5G   21G  15% /' },
          { kind: 'output', text: 'root@vps-prod-01:~#', highlight: true },
        ],
      },
      learned: 'Hardware Inspection: Checking CPU cores, memory buffers, and disk capacity with nproc, free, and df.',
    },

    // Step 6: Why this first login is risky
    {
      id: 'step-6-risky-login',
      shortLabel: 'Risks & scanners',
      title: 'Why This First Login Is Risky: Port 22 Internet Scanners',
      category: 'FAILOVER',
      explanation: [
        'The moment a VPS connects to the public internet, automated botnets begin probing port 22 with dictionary attacks. Inspecting the authentication log with "sudo tail -n 4 /var/log/auth.log" reveals dozens of failed attempts.',
        'Relying on password authentication for "root" is an enormous security liability. In Lesson 2.2, we eliminate this vulnerability by generating Ed25519 SSH keys and disabling password login entirely.',
      ],
      goodToKnow: 'Automated scanners probe public IPv4 ranges 24/7 trying common passwords against the "root" account. Disabling PasswordAuthentication in /etc/ssh/sshd_config neutralizes almost all automated brute-force attacks.',
      nodes: [
        {
          id: 'laptop',
          kind: 'custom',
          label: 'Your laptop',
          sublabel: 'authorized client',
          position: { x: 1.3, y: 1.5 },
          status: 'active',
          badge: 'authorized',
        },
        {
          id: 'bots',
          kind: 'custom',
          label: 'Internet bots',
          sublabel: '198.51.100.x (scanners)',
          position: { x: 3.3, y: 2.0 },
          status: 'overloaded',
          badge: 'failed logins',
        },
        {
          id: 'vps',
          kind: 'custom',
          label: 'Ubuntu VPS',
          sublabel: '203.0.113.10:22',
          position: { x: 5.0, y: 1.5 },
          status: 'active',
          badge: 'targeted',
        },
      ],
      flows: [
        { id: 'f-laptop-vps', from: 'laptop', to: 'vps', type: 'request', active: true, sequence: 1 },
        { id: 'f-vps-laptop', from: 'vps', to: 'laptop', type: 'response', active: true, sequence: 1 },
        { id: 'f-bots-vps', from: 'bots', to: 'vps', type: 'request', active: true, sequence: 2 },
      ],
      telemetry: [
        { id: 'status', label: 'STATUS', value: 'running', icon: 'Activity' },
        { id: 'ip', label: 'PUBLIC IP', value: '203.0.113.10', icon: 'Server' },
        { id: 'ssh', label: 'SSH', value: 'password (risky)', icon: 'Shield' },
        { id: 'failed', label: 'FAILED LOGINS', value: '1,842', numeric: 1842, icon: 'AlertTriangle' },
      ],
      terminal: {
        title: 'ssh: root@vps-prod-01',
        lines: [
          { kind: 'command', text: 'sudo tail -n 4 /var/log/auth.log' },
          { kind: 'output', text: 'Failed password for root from 198.51.100.42 port 48212 ssh2' },
          { kind: 'output', text: 'Failed password for root from 198.51.100.89 port 53104 ssh2' },
          { kind: 'output', text: 'Failed password for invalid user admin from 198.51.100.12 port 39120 ssh2' },
          { kind: 'output', text: 'Failed password for root from 198.51.100.77 port 41088 ssh2' },
          { kind: 'comment', text: '# Automated scanners relentlessly attack public port 22 looking for weak passwords' },
          { kind: 'output', text: 'root@vps-prod-01:~#', highlight: true },
        ],
      },
      learned: 'Security Hardening: Why password logins on port 22 attract bot attacks, setting up SSH keys in 2.2.',
    },
  ],
};
