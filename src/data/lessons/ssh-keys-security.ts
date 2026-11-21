import { Lesson } from '../../types/course';

export const sshKeysSecurityLesson: Lesson = {
  id: 'ssh-keys-security',
  moduleId: '02-linux-cloud-vps',
  order: 2,
  title: 'SSH keys and disabling password login',
  subtitle: 'Generating an Ed25519 key pair, installing your public key, and closing password authentication.',
  minutes: 10,
  difficulty: 'Beginner',
  whyItMatters: 'Passwords can be guessed by automated bots, while an SSH key cannot realistically be guessed.',
  realWorldEquivalent: 'Teams manage SSH keys centrally or use short-lived certificates and bastion hosts instead of long-lived keys on every laptop',
  steps: [
    // Step 1: Generate key pair
    {
      id: 'step-1-generate-key',
      shortLabel: 'Generate key pair',
      title: 'Generate an Ed25519 Key Pair on Your Laptop',
      category: 'CONFIG',
      explanation: [
        'Instead of remembering and transmitting secret passwords across the network, SSH key authentication uses asymmetric cryptography. You run ssh-keygen on your local machine to create a matched pair of cryptographic keys: a private key that never leaves your laptop, and a public key that you install on servers.',
        'We choose Ed25519 because it is faster, shorter, and more secure than legacy RSA keys. The private key (id_ed25519) must be guarded like a master physical key and optionally encrypted with a local passphrase, while the public key (id_ed25519.pub) is safe to publish anywhere.',
      ],
      goodToKnow: 'Your private key (~/.ssh/id_ed25519) must never be uploaded, emailed, or committed to Git. Only the public key (~/.ssh/id_ed25519.pub) is shared with remote servers.',
      nodes: [
        {
          id: 'laptop',
          kind: 'custom',
          label: 'Your laptop',
          sublabel: 'client (~/.ssh)',
          position: { x: 1.3, y: 1.5 },
          status: 'active',
          badge: 'private key stays here',
        },
        {
          id: 'vps',
          kind: 'custom',
          label: 'Ubuntu VPS',
          sublabel: '203.0.113.10:22',
          position: { x: 5.0, y: 1.5 },
          status: 'active',
          badge: 'password login on',
        },
      ],
      flows: [],
      telemetry: [
        { id: 'login-method', label: 'LOGIN METHOD', value: 'password', icon: 'Shield' },
        { id: 'password-login', label: 'PASSWORD LOGIN', value: 'on', icon: 'AlertTriangle' },
        { id: 'public-keys', label: 'PUBLIC KEYS', value: '0', numeric: 0, icon: 'Server' },
        { id: 'guessable-login', label: 'GUESSABLE LOGIN', value: 'yes', icon: 'AlertTriangle' },
      ],
      terminal: {
        title: 'laptop: ~/.ssh',
        lines: [
          { kind: 'command', text: 'ssh-keygen -t ed25519 -C "you@laptop"' },
          { kind: 'output', text: 'Generating public/private ed25519 key pair.' },
          { kind: 'output', text: 'Enter file in which to save the key (/home/you/.ssh/id_ed25519):' },
          { kind: 'output', text: 'Enter passphrase (empty for no passphrase):' },
          { kind: 'output', text: 'Your identification has been saved in /home/you/.ssh/id_ed25519' },
          { kind: 'output', text: 'Your public key has been saved in /home/you/.ssh/id_ed25519.pub' },
          { kind: 'output', text: 'The key fingerprint is: SHA256:SAMPLE-FINGERPRINT-NOT-A-REAL-KEY-PLACEHOLDER you@laptop' },
          { kind: 'comment', text: '# The private key (id_ed25519) never leaves your laptop; only .pub will be shared' },
        ],
      },
      learned: 'Key Generation: Generating an Ed25519 key pair on your laptop with ssh-keygen.',
    },

    // Step 2: Copy public key
    {
      id: 'step-2-copy-public-key',
      shortLabel: 'Copy public key',
      title: 'Copy the Public Key to the Remote Server',
      category: 'CONFIG',
      explanation: [
        'To authorize your laptop, you transfer your public key to the server using ssh-copy-id. The tool connects using your existing password one last time and automatically appends your public key to ~/.ssh/authorized_keys on the remote server.',
        'SSH enforces strict filesystem permissions on the remote server: ~/.ssh must be mode 700 (read/write/execute for owner only) and authorized_keys must be mode 600. If these files are writable by other users or groups, sshd will refuse to read them for security.',
      ],
      goodToKnow: 'On macOS and Linux, ssh-copy-id sets the exact permissions automatically. Windows PowerShell lacks ssh-copy-id by default; Windows developers can copy id_ed25519.pub content and append it manually to ~/.ssh/authorized_keys on the server TODO(verify).',
      nodes: [
        {
          id: 'laptop',
          kind: 'custom',
          label: 'Your laptop',
          sublabel: 'id_ed25519.pub',
          position: { x: 1.3, y: 1.5 },
          status: 'active',
          badge: 'public key copied',
        },
        {
          id: 'vps',
          kind: 'custom',
          label: 'Ubuntu VPS',
          sublabel: '203.0.113.10:22',
          position: { x: 5.0, y: 1.5 },
          status: 'active',
          badge: 'authorized_keys',
        },
      ],
      flows: [
        { id: 'f-laptop-vps', from: 'laptop', to: 'vps', type: 'request', active: true, sequence: 1 },
      ],
      telemetry: [
        { id: 'login-method', label: 'LOGIN METHOD', value: 'password', icon: 'Shield' },
        { id: 'password-login', label: 'PASSWORD LOGIN', value: 'on', icon: 'AlertTriangle' },
        { id: 'public-keys', label: 'PUBLIC KEYS', value: '1', numeric: 1, icon: 'Server' },
        { id: 'guessable-login', label: 'GUESSABLE LOGIN', value: 'yes', icon: 'AlertTriangle' },
      ],
      terminal: {
        title: 'laptop: ~/.ssh',
        lines: [
          { kind: 'command', text: 'ssh-copy-id root@203.0.113.10' },
          { kind: 'output', text: '/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s)' },
          { kind: 'output', text: "root@203.0.113.10's password: ••••••••" },
          { kind: 'output', text: 'Number of key(s) added: 1' },
          { kind: 'output', text: 'Now try logging into the machine, with:   "ssh \'root@203.0.113.10\'"' },
          { kind: 'comment', text: '# Appends id_ed25519.pub to ~/.ssh/authorized_keys on the server with 600 permissions' },
        ],
      },
      learned: 'Public Key Deployment: Using ssh-copy-id to append authorized keys with strict 600 permissions.',
    },

    // Step 3: Connect with key
    {
      id: 'step-3-connect-with-key',
      shortLabel: 'Connect with key',
      title: 'Connect with Your Key: Challenge-Response Authentication',
      category: 'TECHNIQUE',
      explanation: [
        'You connect again with ssh root@203.0.113.10. This time, no server password prompt appears. Under the hood, SSH executes a cryptographic challenge-response exchange that authenticates you in milliseconds without sending any secrets over the wire.',
        'The server generates a random challenge and encrypts it with your registered public key. Only your private key on your laptop can decrypt and sign that challenge. Once the server verifies the signature, access is granted immediately.',
      ],
      goodToKnow: 'In challenge-response authentication, your private key never travels across the network. Even if an attacker records every single packet between your laptop and the server, they learn nothing about your private key.',
      nodes: [
        {
          id: 'laptop',
          kind: 'custom',
          label: 'Your laptop',
          sublabel: 'private key',
          position: { x: 1.3, y: 1.5 },
          status: 'active',
          badge: 'holding private key',
        },
        {
          id: 'vps',
          kind: 'custom',
          label: 'Ubuntu VPS',
          sublabel: '203.0.113.10:22',
          position: { x: 5.0, y: 1.5 },
          status: 'active',
          badge: 'challenge verified',
        },
      ],
      flows: [
        { id: 'f-laptop-vps', from: 'laptop', to: 'vps', type: 'request', active: true, sequence: 1 },
        { id: 'f-vps-laptop', from: 'vps', to: 'laptop', type: 'response', active: true, sequence: 1 },
      ],
      telemetry: [
        { id: 'login-method', label: 'LOGIN METHOD', value: 'Ed25519 key', icon: 'Shield' },
        { id: 'password-login', label: 'PASSWORD LOGIN', value: 'on', icon: 'AlertTriangle' },
        { id: 'public-keys', label: 'PUBLIC KEYS', value: '1', numeric: 1, icon: 'Server' },
        { id: 'guessable-login', label: 'GUESSABLE LOGIN', value: 'yes', icon: 'AlertTriangle' },
      ],
      terminal: {
        title: 'ssh: root@203.0.113.10',
        lines: [
          { kind: 'command', text: 'ssh root@203.0.113.10' },
          { kind: 'output', text: 'Authenticated with partial success: publickey.' },
          { kind: 'output', text: 'Welcome to Ubuntu 24.04 LTS (GNU/Linux 6.8.0-31-generic x86_64)' },
          { kind: 'comment', text: '# Connected instantly via challenge-response without transmitting any password' },
          { kind: 'output', text: 'root@vps-prod-01:~#', highlight: true },
        ],
      },
      learned: 'Challenge-Response: How SSH asymmetric keys authenticate identity without revealing secrets.',
    },

    // Step 4: Test before lock
    {
      id: 'step-4-test-before-lock',
      shortLabel: 'Test before locking',
      title: 'Test Before Locking the Door: Keeping a Lifeline',
      category: 'CONFIG',
      explanation: [
        'Before changing SSH daemon configurations or disabling passwords, follow this golden rule of systems administration: keep your current working SSH session open and open a second terminal window on your laptop to test connecting again.',
        'If your SSH key had a syntax error, wrong permissions, or sshd fails to reload, an existing active connection remains open and allows you to fix mistakes. If you disconnect first and lock yourself out, your only recourse is your cloud provider\'s emergency web console.',
      ],
      goodToKnow: 'Reloading the SSH daemon does not terminate existing established connections. As long as your first window stays open, you have an active root shell to inspect logs and revert errors.',
      nodes: [
        {
          id: 'laptop',
          kind: 'custom',
          label: 'Your laptop',
          sublabel: 'terminal #2',
          position: { x: 1.3, y: 1.5 },
          status: 'active',
          badge: '2nd terminal check',
        },
        {
          id: 'vps',
          kind: 'custom',
          label: 'Ubuntu VPS',
          sublabel: '203.0.113.10:22',
          position: { x: 5.0, y: 1.5 },
          status: 'active',
          badge: 'active sessions: 2',
        },
      ],
      flows: [
        { id: 'f-laptop-vps', from: 'laptop', to: 'vps', type: 'request', active: true, sequence: 1 },
        { id: 'f-vps-laptop', from: 'vps', to: 'laptop', type: 'response', active: true, sequence: 1 },
      ],
      telemetry: [
        { id: 'login-method', label: 'LOGIN METHOD', value: 'Ed25519 key', icon: 'Shield' },
        { id: 'password-login', label: 'PASSWORD LOGIN', value: 'on', icon: 'AlertTriangle' },
        { id: 'public-keys', label: 'PUBLIC KEYS', value: '1', numeric: 1, icon: 'Server' },
        { id: 'guessable-login', label: 'GUESSABLE LOGIN', value: 'yes', icon: 'AlertTriangle' },
      ],
      terminal: {
        title: 'laptop: terminal #2 (safety test)',
        lines: [
          { kind: 'comment', text: '# Keep Window #1 open with root shell! In a new terminal window #2:' },
          { kind: 'command', text: 'ssh -i ~/.ssh/id_ed25519 root@203.0.113.10' },
          { kind: 'output', text: 'Welcome to Ubuntu 24.04 LTS (GNU/Linux 6.8.0-31-generic x86_64)' },
          { kind: 'output', text: 'root@vps-prod-01:~# who', highlight: true },
          { kind: 'output', text: 'root     pts/0        Nov 21 16:00 (198.51.100.2)' },
          { kind: 'output', text: 'root     pts/1        Nov 21 16:05 (198.51.100.2)' },
          { kind: 'comment', text: '# Confirmed: second session logged in via key. It is safe to proceed.' },
        ],
      },
      learned: 'Lockout Prevention: Testing new logins in a second window before modifying daemon configuration.',
    },

    // Step 5: Disable password login
    {
      id: 'step-5-disable-password-auth',
      shortLabel: 'Disable password login',
      title: 'Disable Password Authentication in sshd_config',
      category: 'CONFIG',
      explanation: [
        'Now that key authentication is verified, we lock the door against brute-force attacks. We edit /etc/ssh/sshd_config and set PasswordAuthentication no. Before restarting the service, we always test the configuration with sudo sshd -t.',
        'If sshd -t returns clean with zero errors, we reload the daemon with sudo systemctl reload ssh. Note that on Ubuntu and Debian, the service is named ssh, whereas on RHEL and CentOS it is named sshd.',
      ],
      goodToKnow: 'Ubuntu drop-in configuration files inside /etc/ssh/sshd_config.d/*.conf (such as 50-cloud-init.conf) can override main configuration directives. Always check the actual running configuration with sudo sshd -T | grep -i passwordauthentication TODO(verify).',
      nodes: [
        {
          id: 'laptop',
          kind: 'custom',
          label: 'Your laptop',
          sublabel: 'admin client',
          position: { x: 1.3, y: 1.5 },
          status: 'active',
          badge: 'sshd reloaded',
        },
        {
          id: 'vps',
          kind: 'custom',
          label: 'Ubuntu VPS',
          sublabel: '203.0.113.10:22',
          position: { x: 5.0, y: 1.5 },
          status: 'active',
          badge: 'PasswordAuth no',
        },
      ],
      flows: [
        { id: 'f-laptop-vps', from: 'laptop', to: 'vps', type: 'request', active: true, sequence: 1 },
        { id: 'f-vps-laptop', from: 'vps', to: 'laptop', type: 'response', active: true, sequence: 1 },
      ],
      telemetry: [
        { id: 'login-method', label: 'LOGIN METHOD', value: 'Ed25519 key', icon: 'Shield' },
        { id: 'password-login', label: 'PASSWORD LOGIN', value: 'off', icon: 'AlertTriangle' },
        { id: 'public-keys', label: 'PUBLIC KEYS', value: '1', numeric: 1, icon: 'Server' },
        { id: 'guessable-login', label: 'GUESSABLE LOGIN', value: 'no', icon: 'AlertTriangle' },
      ],
      terminal: {
        title: 'ssh: root@vps-prod-01',
        lines: [
          { kind: 'command', text: 'sudo nano /etc/ssh/sshd_config' },
          { kind: 'comment', text: '# Set: PasswordAuthentication no and KbdInteractiveAuthentication no' },
          { kind: 'command', text: 'sudo sshd -t' },
          { kind: 'comment', text: '# Syntax check passed: zero output indicates valid configuration' },
          { kind: 'command', text: 'sudo systemctl reload ssh' },
          { kind: 'command', text: 'sudo sshd -T | grep -i passwordauthentication' },
          { kind: 'output', text: 'passwordauthentication no', highlight: true },
        ],
      },
      learned: 'Hardening sshd: Disabling password authentication, testing syntax with sshd -t, and reloading.',
    },

    // Step 6: Bots locked out
    {
      id: 'step-6-bots-locked-out',
      shortLabel: 'Bots locked out',
      title: 'Bots Locked Out: Eliminating the Password Attack Surface',
      category: 'CONFIG',
      explanation: [
        'With password authentication disabled, the SSH daemon will not even prompt for a password. When automated internet botnets scan port 22 and attempt to guess credentials, the server rejects their connection immediately with "Permission denied (publickey)".',
        'This single configuration change eliminates the entire threat surface of dictionary and brute-force password attacks. In the next lesson, we take server hardening one step further by creating a dedicated non-root user with sudo privileges and locking the root account.',
      ],
      goodToKnow: 'Even though bot connections fail instantly, scanners will still generate network noise on port 22. In lesson 2.4, we configure UFW firewalls to limit exposure and keep our server clean.',
      nodes: [
        {
          id: 'laptop',
          kind: 'custom',
          label: 'Your laptop',
          sublabel: 'client (key auth)',
          position: { x: 1.3, y: 1.5 },
          status: 'active',
          badge: 'key authorized',
        },
        {
          id: 'bots',
          kind: 'custom',
          label: 'Internet bots',
          sublabel: '198.51.100.x (scanners)',
          position: { x: 3.3, y: 2.0 },
          status: 'overloaded',
          badge: 'rejected',
        },
        {
          id: 'vps',
          kind: 'custom',
          label: 'Ubuntu VPS',
          sublabel: '203.0.113.10:22',
          position: { x: 5.0, y: 1.5 },
          status: 'active',
          badge: 'password login off',
        },
      ],
      flows: [
        { id: 'f-laptop-vps', from: 'laptop', to: 'vps', type: 'request', active: true, sequence: 1 },
        { id: 'f-vps-laptop', from: 'vps', to: 'laptop', type: 'response', active: true, sequence: 1 },
        { id: 'f-bots-vps', from: 'bots', to: 'vps', type: 'request', active: true, sequence: 2 },
      ],
      telemetry: [
        { id: 'login-method', label: 'LOGIN METHOD', value: 'Ed25519 key', icon: 'Shield' },
        { id: 'password-login', label: 'PASSWORD LOGIN', value: 'off', icon: 'AlertTriangle' },
        { id: 'public-keys', label: 'PUBLIC KEYS', value: '1', numeric: 1, icon: 'Server' },
        { id: 'guessable-login', label: 'GUESSABLE LOGIN', value: 'no', icon: 'AlertTriangle' },
      ],
      terminal: {
        title: 'attacker test: ssh with password attempt',
        lines: [
          { kind: 'command', text: 'ssh -o PubkeyAuthentication=no root@203.0.113.10' },
          { kind: 'output', text: 'root@203.0.113.10: Permission denied (publickey).' },
          { kind: 'comment', text: '# The daemon rejects password authentication immediately without prompting for input' },
          { kind: 'output', text: 'Connection to 203.0.113.10 closed by remote host.', highlight: true },
        ],
      },
      learned: 'Attack Surface Elimination: How disabling password authentication drops automated dictionary attacks.',
    },
  ],
};
