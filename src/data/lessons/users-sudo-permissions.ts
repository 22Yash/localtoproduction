import { Lesson } from '../../types/course';

export const usersSudoPermissionsLesson: Lesson = {
  id: 'users-sudo-permissions',
  moduleId: '02-linux-cloud-vps',
  order: 3,
  title: 'Users, sudo, and permissions',
  subtitle: 'Creating a non-root deploy user, granting sudo privileges, and disabling root SSH logins.',
  minutes: 10,
  difficulty: 'Beginner',
  whyItMatters: 'Running everything as root turns any typo or application vulnerability into a total server compromise.',
  realWorldEquivalent: 'At scale, access comes from central identity systems and role-based permissions, and humans rarely log in to servers at all',
  steps: [
    // Step 1: Why not root
    {
      id: 'step-1-why-not-root',
      shortLabel: 'Why not root',
      title: 'Why Not Root: The Danger of Unlimited Privilege',
      category: 'CONFIG',
      explanation: [
        'When you first provision a Linux VPS, you log in as root—the unrestricted superuser account. Root can delete operating system directories, terminate core system daemons, overwrite network configurations, and inspect any private file on the machine.',
        'Running applications as root is dangerous. If your Node.js server has a remote code execution bug, vulnerable dependency, or arbitrary file-write flaw, an attacker immediately inherits root privileges and achieves a complete server takeover.',
      ],
      goodToKnow: 'The principle of least privilege states that users and processes should hold only the bare minimum permissions necessary to perform their work. Production web services should never run as root.',
      nodes: [
        {
          id: 'laptop',
          kind: 'custom',
          label: 'Your laptop',
          sublabel: 'client terminal',
          position: { x: 1.3, y: 1.5 },
          status: 'active',
          badge: 'root session',
        },
        {
          id: 'vps',
          kind: 'custom',
          label: 'Ubuntu VPS',
          sublabel: '203.0.113.10:22',
          position: { x: 5.0, y: 1.5 },
          status: 'active',
          badge: 'logged in as root',
        },
      ],
      flows: [
        { id: 'f-laptop-vps', from: 'laptop', to: 'vps', type: 'request', active: true, sequence: 1 },
        { id: 'f-vps-laptop', from: 'vps', to: 'laptop', type: 'response', active: true, sequence: 1 },
      ],
      telemetry: [
        { id: 'logged-in-as', label: 'LOGGED IN AS', value: 'root', icon: 'Shield' },
        { id: 'root-ssh', label: 'ROOT SSH LOGIN', value: 'allowed', icon: 'AlertTriangle' },
        { id: 'sudo-users', label: 'SUDO USERS', value: '0', numeric: 0, icon: 'Server' },
        { id: 'hack-impact', label: 'IF APP IS HACKED', value: 'full server', icon: 'AlertTriangle' },
      ],
      terminal: {
        title: 'ssh: root@203.0.113.10',
        lines: [
          { kind: 'command', text: 'whoami' },
          { kind: 'output', text: 'root' },
          { kind: 'command', text: 'id' },
          { kind: 'output', text: 'uid=0(root) gid=0(root) groups=0(root)' },
          { kind: 'comment', text: '# One typo as root can wipe the server, and app bugs become full takeover' },
          { kind: 'output', text: 'root@vps-prod-01:~#', highlight: true },
        ],
      },
      learned: 'Least Privilege: Understanding why running applications as root creates extreme security risks.',
    },

    // Step 2: Create a deploy user
    {
      id: 'step-2-create-deploy-user',
      shortLabel: 'Create deploy user',
      title: 'Create a Deploy User: adduser on Ubuntu',
      category: 'CONFIG',
      explanation: [
        'Instead of root, we create a dedicated standard user named deploy to manage files and run our backend applications. On Ubuntu and Debian, we use the adduser command, an interactive wrapper around low-level useradd.',
        'adduser creates a dedicated home directory at /home/deploy, copies shell configuration templates from /etc/skel, sets up a matching primary group named deploy, and prompts for a secure account password.',
      ],
      goodToKnow: 'Set a strong password for deploy, because sudo will ask for it whenever you run elevated commands—even if you always log in over SSH using a cryptographic key.',
      nodes: [
        {
          id: 'laptop',
          kind: 'custom',
          label: 'Your laptop',
          sublabel: 'client terminal',
          position: { x: 1.3, y: 1.5 },
          status: 'active',
          badge: 'root session',
        },
        {
          id: 'vps',
          kind: 'custom',
          label: 'Ubuntu VPS',
          sublabel: '203.0.113.10:22',
          position: { x: 5.0, y: 1.5 },
          status: 'active',
          badge: 'user: deploy',
        },
      ],
      flows: [
        { id: 'f-laptop-vps', from: 'laptop', to: 'vps', type: 'request', active: true, sequence: 1 },
        { id: 'f-vps-laptop', from: 'vps', to: 'laptop', type: 'response', active: true, sequence: 1 },
      ],
      telemetry: [
        { id: 'logged-in-as', label: 'LOGGED IN AS', value: 'root', icon: 'Shield' },
        { id: 'root-ssh', label: 'ROOT SSH LOGIN', value: 'allowed', icon: 'AlertTriangle' },
        { id: 'sudo-users', label: 'SUDO USERS', value: '0', numeric: 0, icon: 'Server' },
        { id: 'hack-impact', label: 'IF APP IS HACKED', value: 'full server', icon: 'AlertTriangle' },
      ],
      terminal: {
        title: 'ssh: root@203.0.113.10',
        lines: [
          { kind: 'command', text: 'adduser deploy' },
          { kind: 'output', text: "Adding user `deploy' ..." },
          { kind: 'output', text: "Adding new group `deploy' (1000) ..." },
          { kind: 'output', text: "Adding new user `deploy' (1000) with group `deploy' ..." },
          { kind: 'output', text: "Creating home directory `/home/deploy' ..." },
          { kind: 'output', text: "Copying files from `/etc/skel' ..." },
          { kind: 'output', text: 'New password: ••••••••' },
          { kind: 'output', text: 'Retype new password: ••••••••' },
          { kind: 'output', text: 'passwd: password updated successfully' },
          { kind: 'comment', text: '# Created unprivileged user deploy (UID 1000) with dedicated home directory' },
        ],
      },
      learned: 'User Creation: Using adduser on Debian/Ubuntu to provision a dedicated non-root user.',
    },

    // Step 3: Give it sudo
    {
      id: 'step-3-give-it-sudo',
      shortLabel: 'Give it sudo',
      title: 'Give It Sudo: Controlled Administrative Escalation',
      category: 'CONFIG',
      explanation: [
        'A deploy user needs to install software packages, update NGINX configurations, and restart system services. Rather than remaining logged in as root, we grant administrative elevation by adding deploy to the sudo group via usermod -aG sudo deploy.',
        'The sudo utility allows authorized users to execute specific commands as root on demand. Crucially, sudo requires the user\'s personal password and logs every elevated invocation to system journals, creating an audit trail.',
      ],
      goodToKnow: 'The -a (append) flag in usermod -aG is vital: omitting -a would remove deploy from all other secondary groups instead of appending sudo.',
      nodes: [
        {
          id: 'laptop',
          kind: 'custom',
          label: 'Your laptop',
          sublabel: 'client terminal',
          position: { x: 1.3, y: 1.5 },
          status: 'active',
          badge: 'root session',
        },
        {
          id: 'vps',
          kind: 'custom',
          label: 'Ubuntu VPS',
          sublabel: '203.0.113.10:22',
          position: { x: 5.0, y: 1.5 },
          status: 'active',
          badge: 'sudoer added',
        },
      ],
      flows: [
        { id: 'f-laptop-vps', from: 'laptop', to: 'vps', type: 'request', active: true, sequence: 1 },
        { id: 'f-vps-laptop', from: 'vps', to: 'laptop', type: 'response', active: true, sequence: 1 },
      ],
      telemetry: [
        { id: 'logged-in-as', label: 'LOGGED IN AS', value: 'root', icon: 'Shield' },
        { id: 'root-ssh', label: 'ROOT SSH LOGIN', value: 'allowed', icon: 'AlertTriangle' },
        { id: 'sudo-users', label: 'SUDO USERS', value: '1', numeric: 1, icon: 'Server' },
        { id: 'hack-impact', label: 'IF APP IS HACKED', value: 'full server', icon: 'AlertTriangle' },
      ],
      terminal: {
        title: 'ssh: root@203.0.113.10',
        lines: [
          { kind: 'command', text: 'usermod -aG sudo deploy' },
          { kind: 'command', text: 'id deploy' },
          { kind: 'output', text: 'uid=1000(deploy) gid=1000(deploy) groups=1000(deploy),27(sudo)' },
          { kind: 'comment', text: '# deploy is now in group 27(sudo); elevated commands run with "sudo <cmd>"' },
          { kind: 'output', text: 'root@vps-prod-01:~#', highlight: true },
        ],
      },
      learned: 'Sudo Privileges: Adding deploy to group 27(sudo) for audited command-level root escalation.',
    },

    // Step 4: Let the new user log in with your key
    {
      id: 'step-4-key-login-deploy',
      shortLabel: 'Key login for deploy',
      title: 'Key Login for Deploy: Copying Authorized Keys',
      category: 'CONFIG',
      explanation: [
        'We copy our existing SSH public key into deploy\'s home directory so we can authenticate as deploy with our laptop\'s private key. Running rsync with --archive and --chown=deploy:deploy copies ~/.ssh while assigning ownership directly to deploy.',
        'Before touching daemon configurations or ending our root session, we open a second terminal window on our laptop and run ssh deploy@203.0.113.10. Keeping the root session open acts as a safety lifeline if anything was misconfigured.',
      ],
      goodToKnow: 'Always test connecting as the new user from a second terminal window before logging out of root. If permissions or keys are misconfigured, your active root session allows you to fix mistakes immediately.',
      nodes: [
        {
          id: 'laptop',
          kind: 'custom',
          label: 'Your laptop',
          sublabel: 'terminal #2',
          position: { x: 1.3, y: 1.5 },
          status: 'active',
          badge: 'window #2 check',
        },
        {
          id: 'vps',
          kind: 'custom',
          label: 'Ubuntu VPS',
          sublabel: '203.0.113.10:22',
          position: { x: 5.0, y: 1.5 },
          status: 'active',
          badge: 'deploy key active',
        },
      ],
      flows: [
        { id: 'f-laptop-vps', from: 'laptop', to: 'vps', type: 'request', active: true, sequence: 1 },
        { id: 'f-vps-laptop', from: 'vps', to: 'laptop', type: 'response', active: true, sequence: 1 },
      ],
      telemetry: [
        { id: 'logged-in-as', label: 'LOGGED IN AS', value: 'deploy', icon: 'Shield' },
        { id: 'root-ssh', label: 'ROOT SSH LOGIN', value: 'allowed', icon: 'AlertTriangle' },
        { id: 'sudo-users', label: 'SUDO USERS', value: '1', numeric: 1, icon: 'Server' },
        { id: 'hack-impact', label: 'IF APP IS HACKED', value: 'full server', icon: 'AlertTriangle' },
      ],
      terminal: {
        title: 'ssh: root@203.0.113.10 -> laptop terminal #2',
        lines: [
          { kind: 'command', text: 'rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy' },
          { kind: 'comment', text: '# Copied authorized_keys and assigned ownership to deploy:deploy' },
          { kind: 'comment', text: '# Keep root window open! In laptop window #2, test logging in as deploy:' },
          { kind: 'command', text: 'ssh deploy@203.0.113.10' },
          { kind: 'output', text: 'Welcome to Ubuntu 24.04 LTS (GNU/Linux 6.8.0-31-generic x86_64)' },
          { kind: 'output', text: 'deploy@vps-prod-01:~$ whoami', highlight: true },
          { kind: 'output', text: 'deploy' },
        ],
      },
      learned: 'Key Migration & Verification: Copying ~/.ssh to deploy and testing login in a second terminal.',
    },

    // Step 5: Permissions 101
    {
      id: 'step-5-permissions-101',
      shortLabel: 'Permissions 101',
      title: 'Permissions 101: UNIX File Modes and Strict SSH Security',
      category: 'TECHNIQUE',
      explanation: [
        'UNIX permissions control who can read (r=4), write (w=2), or execute (x=1) files across three scopes: owner, group, and others. For example, chmod 700 on ~/.ssh gives the owner full access (7=4+2+1) and forbids all access to group (0) and others (0).',
        'SSH strictly enforces these permissions. The ~/.ssh directory must be 700 (drwx------) and ~/.ssh/authorized_keys must be 600 (-rw-------). If either file allows group or other users to write, OpenSSH rejects key authentication to prevent tampering.',
      ],
      goodToKnow: 'Never attempt to "fix" permission errors by running chmod 777. Granting universal write access destroys server isolation, allows other processes to overwrite keys, and causes sshd to reject your connection.',
      nodes: [
        {
          id: 'laptop',
          kind: 'custom',
          label: 'Your laptop',
          sublabel: 'deploy client',
          position: { x: 1.3, y: 1.5 },
          status: 'active',
          badge: 'deploy session',
        },
        {
          id: 'vps',
          kind: 'custom',
          label: 'Ubuntu VPS',
          sublabel: '203.0.113.10:22',
          position: { x: 5.0, y: 1.5 },
          status: 'active',
          badge: '700/600 verified',
        },
      ],
      flows: [
        { id: 'f-laptop-vps', from: 'laptop', to: 'vps', type: 'request', active: true, sequence: 1 },
        { id: 'f-vps-laptop', from: 'vps', to: 'laptop', type: 'response', active: true, sequence: 1 },
      ],
      telemetry: [
        { id: 'logged-in-as', label: 'LOGGED IN AS', value: 'deploy', icon: 'Shield' },
        { id: 'root-ssh', label: 'ROOT SSH LOGIN', value: 'allowed', icon: 'AlertTriangle' },
        { id: 'sudo-users', label: 'SUDO USERS', value: '1', numeric: 1, icon: 'Server' },
        { id: 'hack-impact', label: 'IF APP IS HACKED', value: 'limited', icon: 'AlertTriangle' },
      ],
      terminal: {
        title: 'ssh: deploy@203.0.113.10',
        lines: [
          { kind: 'command', text: 'ls -la /home/deploy/.ssh' },
          { kind: 'output', text: 'total 12' },
          { kind: 'output', text: 'drwx------ 2 deploy deploy 4096 Nov 21 16:15 .' },
          { kind: 'output', text: 'drwxr-xr-x 3 deploy deploy 4096 Nov 21 16:10 ..' },
          { kind: 'output', text: '-rw------- 1 deploy deploy  106 Nov 21 16:15 authorized_keys' },
          { kind: 'command', text: 'chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys' },
          { kind: 'comment', text: '# Permissions: owner=rwx(7), group=---(0), others=---(0). StrictModes satisfied.' },
        ],
      },
      learned: 'UNIX Permissions: Understanding rwx owner/group/other bits and enforcing 700/600 on SSH files.',
    },

    // Step 6: Turn off root login over SSH
    {
      id: 'step-6-turn-off-root-ssh',
      shortLabel: 'Disable root SSH',
      title: 'Turn Off Root Login Over SSH: Closing the Direct Door',
      category: 'CONFIG',
      explanation: [
        'By default, OpenSSH allows root key logins (PermitRootLogin prohibit-password). To fully harden the server, we edit /etc/ssh/sshd_config and set PermitRootLogin no, completely blocking anyone from connecting as root over the network.',
        'This locks down the server so nobody can target root directly over the internet. In lesson 2.4, we configure the UFW firewall and clone our Git repository onto the server, and in Module 3, we run our Node.js application process under the deploy user rather than root.',
      ],
      goodToKnow: 'Remember that drop-in files in /etc/ssh/sshd_config.d/*.conf can override your edits. Always verify the active setting with sudo sshd -T | grep -i permitrootlogin. In Module 3, our Node apps run as deploy, not root.',
      nodes: [
        {
          id: 'laptop',
          kind: 'custom',
          label: 'Your laptop',
          sublabel: 'deploy client',
          position: { x: 1.3, y: 1.5 },
          status: 'active',
          badge: 'deploy client',
        },
        {
          id: 'vps',
          kind: 'custom',
          label: 'Ubuntu VPS',
          sublabel: '203.0.113.10:22',
          position: { x: 5.0, y: 1.5 },
          status: 'active',
          badge: 'PermitRootLogin no',
        },
      ],
      flows: [
        { id: 'f-laptop-vps', from: 'laptop', to: 'vps', type: 'request', active: true, sequence: 1 },
        { id: 'f-vps-laptop', from: 'vps', to: 'laptop', type: 'response', active: true, sequence: 1 },
      ],
      telemetry: [
        { id: 'logged-in-as', label: 'LOGGED IN AS', value: 'deploy', icon: 'Shield' },
        { id: 'root-ssh', label: 'ROOT SSH LOGIN', value: 'disabled', icon: 'AlertTriangle' },
        { id: 'sudo-users', label: 'SUDO USERS', value: '1', numeric: 1, icon: 'Server' },
        { id: 'hack-impact', label: 'IF APP IS HACKED', value: 'limited', icon: 'AlertTriangle' },
      ],
      terminal: {
        title: 'deploy@vps-prod-01 -> laptop test',
        lines: [
          { kind: 'command', text: 'sudo nano /etc/ssh/sshd_config' },
          { kind: 'comment', text: '# Set: PermitRootLogin no' },
          { kind: 'command', text: 'sudo sshd -t && sudo systemctl reload ssh' },
          { kind: 'command', text: 'sudo sshd -T | grep -i permitrootlogin' },
          { kind: 'output', text: 'permitrootlogin no', highlight: true },
          { kind: 'comment', text: '# Test from laptop: direct root login is now blocked' },
          { kind: 'command', text: 'ssh root@203.0.113.10' },
          { kind: 'output', text: 'root@203.0.113.10: Permission denied (publickey).' },
        ],
      },
      learned: 'Root Lockout: Setting PermitRootLogin no in sshd_config and verifying that all SSH access requires deploy.',
    },
  ],
};
