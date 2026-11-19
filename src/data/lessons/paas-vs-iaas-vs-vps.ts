import { Lesson } from '../../types/course';

export const paasVsIaasVsVpsLesson: Lesson = {
  id: 'paas-vs-iaas-vs-vps',
  moduleId: '01-localhost-limits',
  order: 3,
  title: 'PaaS vs IaaS vs VPS',
  subtitle: 'What a "Deploy" button actually does for you.',
  minutes: 8,
  difficulty: 'Beginner',
  whyItMatters: 'Clicking "Deploy" hides critical networking, process management, and scaling layers that every production engineer must understand to debug real incidents.',
  realWorldEquivalent: 'Companies usually mix these: managed platforms for simple services, cloud VMs or Kubernetes for the rest',
  steps: [
    // Step 1: You click "Deploy"
    {
      id: 'step-1-click-deploy',
      shortLabel: 'Click "Deploy"',
      title: 'You Click "Deploy": Handing Code to a Managed Platform',
      category: 'ARCHITECTURE',
      explanation: [
        'When deploying to a Platform as a Service (PaaS) like Render, Vercel, or Railway, you connect your Git repository and click "Deploy". Within minutes, your application is live on the public internet with a working URL.',
        'You never configure a Linux server, touch an SSH terminal, or install Node.js manually. The platform handles the build container, provisions runtime dependencies, and routes incoming traffic automatically.',
      ],
      goodToKnow: 'PaaS platforms optimize for developer velocity. You provide application code, and the platform abstracts away all server administration, OS configuration, and low-level networking.',
      nodes: [
        {
          id: 'users',
          kind: 'users',
          label: 'Users',
          position: { x: 1, y: 3 },
          status: 'active',
          badge: '200 online',
        },
        {
          id: 'paas',
          kind: 'custom',
          label: 'PaaS platform',
          sublabel: 'e.g. Render, Vercel, Railway',
          position: { x: 5, y: 3 },
          status: 'active',
          badge: 'they run it',
        },
      ],
      flows: [
        { id: 'f-u-paas', from: 'users', to: 'paas', type: 'request', active: true, sequence: 1 },
        { id: 'f-paas-u', from: 'paas', to: 'users', type: 'response', active: true, sequence: 1 },
      ],
      telemetry: [
        { id: 'manage', label: 'YOU MANAGE', value: 'code only', icon: 'Shield' },
        { id: 'setup', label: 'SETUP TIME', value: 'minutes', icon: 'Clock' },
        { id: 'control', label: 'CONTROL', value: 'low', icon: 'Gauge' },
        { id: 'cost', label: 'COST AT SCALE', value: 'higher', icon: 'Zap' },
      ],
      crowd: { users: 200 },
      learned: 'How PaaS platforms abstract infrastructure behind a single deployment button.',
    },

    // Step 2: What the button hides
    {
      id: 'step-2-what-it-hides',
      shortLabel: 'What it hides',
      title: 'What the Button Hides: The Seven Jobs Done Behind the Scenes',
      category: 'ARCHITECTURE',
      explanation: [
        'The simple "Deploy" button quietly performs seven critical production jobs: compiling your build, applying OS security patches, provisioning TLS/HTTPS certificates, routing HTTP traffic, managing restarts, and collecting logs.',
        'When things work, this automation feels magical. But when requests time out, memory limits trigger silent restarts, or bandwidth bills escalate, you cannot fix what you do not understand.',
      ],
      goodToKnow: 'Every PaaS is running standard Linux, reverse proxies like NGINX or Envoy, and process supervisors underneath. Learning these building blocks removes the mystery when troubleshooting failures.',
      nodes: [
        {
          id: 'users',
          kind: 'users',
          label: 'Users',
          position: { x: 1, y: 3 },
          status: 'active',
          badge: '200 online',
        },
        {
          id: 'paas',
          kind: 'custom',
          label: 'PaaS platform',
          sublabel: 'e.g. Render, Vercel, Railway',
          position: { x: 5, y: 3 },
          status: 'active',
          badge: 'they run it',
        },
      ],
      flows: [
        { id: 'f-u-paas', from: 'users', to: 'paas', type: 'request', active: true, sequence: 1 },
        { id: 'f-paas-u', from: 'paas', to: 'users', type: 'response', active: true, sequence: 1 },
      ],
      telemetry: [
        { id: 'manage', label: 'YOU MANAGE', value: 'code only', icon: 'Shield' },
        { id: 'setup', label: 'SETUP TIME', value: 'minutes', icon: 'Clock' },
        { id: 'control', label: 'CONTROL', value: 'low', icon: 'Gauge' },
        { id: 'cost', label: 'COST AT SCALE', value: 'higher', icon: 'Zap' },
      ],
      crowd: { users: 200 },
      learned: 'The hidden production tasks managed by automated deployment platforms.',
    },

    // Step 3: IaaS
    {
      id: 'step-3-iaas',
      shortLabel: 'Cloud VM (IaaS)',
      title: 'IaaS (Cloud VMs): Full Control with On-Demand Cloud Primitives',
      category: 'ARCHITECTURE',
      explanation: [
        'Infrastructure as a Service (IaaS) provides raw compute primitives: virtual machines (such as AWS EC2 or Google Compute Engine), virtual private clouds (VPCs), and elastic block storage.',
        'You have complete control over the operating system, kernel parameters, and installed software. In exchange, you are responsible for OS security patches, firewall configuration, system monitoring, and runtime setup.',
      ],
      goodToKnow: 'IaaS gives you granular architectural flexibility and integrates with sprawling cloud ecosystems, but navigating security groups, IAM roles, and usage-based pricing adds substantial complexity.',
      nodes: [
        {
          id: 'users',
          kind: 'users',
          label: 'Users',
          position: { x: 1, y: 3 },
          status: 'active',
          badge: '200 online',
        },
        {
          id: 'iaas',
          kind: 'custom',
          label: 'Cloud VM',
          sublabel: 'e.g. AWS EC2, Google Compute Engine',
          position: { x: 5, y: 3 },
          status: 'active',
          badge: 'you run the OS',
        },
      ],
      flows: [
        { id: 'f-u-iaas', from: 'users', to: 'iaas', type: 'request', active: true, sequence: 1 },
        { id: 'f-iaas-u', from: 'iaas', to: 'users', type: 'response', active: true, sequence: 1 },
      ],
      telemetry: [
        { id: 'manage', label: 'YOU MANAGE', value: 'OS + code', icon: 'Shield' },
        { id: 'setup', label: 'SETUP TIME', value: 'hours', icon: 'Clock' },
        { id: 'control', label: 'CONTROL', value: 'high', icon: 'Gauge' },
        { id: 'cost', label: 'COST AT SCALE', value: 'medium', icon: 'Zap' },
      ],
      crowd: { users: 200 },
      learned: 'How Infrastructure as a Service (IaaS) exchanges operational simplicity for total flexibility.',
    },

    // Step 4: VPS
    {
      id: 'step-4-vps',
      shortLabel: 'VPS (Rented server)',
      title: 'VPS: A Rented Virtual Server with Full Root Access',
      category: 'ARCHITECTURE',
      explanation: [
        'A Virtual Private Server (VPS) is a dedicated slice of physical server hardware running its own isolated Linux operating system. You get direct root SSH access, a public IPv4 address, and fixed, predictable monthly pricing.',
        'The boundary between a VPS and IaaS is blurry: many modern VPS providers offer block storage, private networks, and firewalls. A VPS is essentially a simplified, budget-friendly cloud VM.',
      ],
      goodToKnow: 'A basic VPS often costs between $4 and $6 per month and easily handles thousands of active users if properly configured with a reverse proxy, process manager, and cache.',
      nodes: [
        {
          id: 'users',
          kind: 'users',
          label: 'Users',
          position: { x: 1, y: 3 },
          status: 'active',
          badge: '200 online',
        },
        {
          id: 'vps',
          kind: 'custom',
          label: 'VPS',
          sublabel: 'a rented virtual server',
          position: { x: 5, y: 3 },
          status: 'active',
          badge: 'root access',
        },
      ],
      flows: [
        { id: 'f-u-vps', from: 'users', to: 'vps', type: 'request', active: true, sequence: 1 },
        { id: 'f-vps-u', from: 'vps', to: 'users', type: 'response', active: true, sequence: 1 },
      ],
      telemetry: [
        { id: 'manage', label: 'YOU MANAGE', value: 'OS + code', icon: 'Shield' },
        { id: 'setup', label: 'SETUP TIME', value: 'hours', icon: 'Clock' },
        { id: 'control', label: 'CONTROL', value: 'high', icon: 'Gauge' },
        { id: 'cost', label: 'COST AT SCALE', value: 'lowest', icon: 'Zap' },
      ],
      crowd: { users: 200 },
      learned: 'Why a VPS provides a cost-effective, full-control foundation for hosting web applications.',
    },

    // Step 5: Trade-offs
    {
      id: 'step-5-trade-offs',
      shortLabel: 'Trade-offs',
      title: 'Trade-offs: Comparing Convenience, Architectural Control, and Cost',
      category: 'TECHNIQUE',
      explanation: [
        'No single hosting model is best for every scenario. PaaS offers instant deployment at a premium price; IaaS offers infinite scalability at high complexity; a VPS offers fixed low costs and complete control.',
        'Production teams evaluate trade-offs: use PaaS for rapid prototypes or edge frontends, and use dedicated VPS or cloud VM clusters for database storage, core APIs, and cost-sensitive scale.',
      ],
      goodToKnow: 'Bandwidth and memory pricing on PaaS providers can be 5x to 10x higher than raw VPS or cloud bandwidth. Understanding the lower layers lets you migrate workloads when costs escalate.',
      nodes: [
        {
          id: 'users',
          kind: 'users',
          label: 'Users',
          position: { x: 1, y: 3 },
          status: 'active',
          badge: 'all users',
        },
        {
          id: 'paas',
          kind: 'custom',
          label: 'PaaS platform',
          sublabel: 'e.g. Render, Vercel',
          position: { x: 5, y: 1 },
          status: 'active',
          badge: 'easy',
        },
        {
          id: 'iaas',
          kind: 'custom',
          label: 'Cloud VM',
          sublabel: 'e.g. AWS EC2, GCE',
          position: { x: 5, y: 3 },
          status: 'active',
          badge: 'flexible',
        },
        {
          id: 'vps',
          kind: 'custom',
          label: 'VPS',
          sublabel: 'rented virtual server',
          position: { x: 5, y: 5 },
          status: 'active',
          badge: 'cheap + simple',
        },
      ],
      flows: [],
      telemetry: [
        { id: 'manage', label: 'YOU MANAGE', value: 'varies', icon: 'Shield' },
        { id: 'setup', label: 'SETUP TIME', value: 'varies', icon: 'Clock' },
        { id: 'control', label: 'CONTROL', value: 'trade-off', icon: 'Gauge' },
        { id: 'cost', label: 'COST AT SCALE', value: 'trade-off', icon: 'Zap' },
      ],
      crowd: { users: 200 },
      learned: 'How to evaluate the trade-offs between convenience, infrastructure control, and cost at scale.',
    },

    // Step 6: Why this course uses a VPS
    {
      id: 'step-6-why-vps',
      shortLabel: 'Why use a VPS',
      title: 'Why This Course Uses a VPS: Unmasking the Full Production Stack',
      category: 'ARCHITECTURE',
      explanation: [
        'ShipToProd teaches real production engineering on a VPS because it forces us to build what the PaaS button hides: SSH key security, UFW firewalls, PM2 process management, NGINX routing, and TLS certificates.',
        'Once you understand how to manage a real Linux server from scratch, you will know exactly what PaaS platforms do for you, and you will have the superpower to deploy, optimize, and debug anywhere.',
      ],
      goodToKnow: 'Everything you learn on a $5/month VPS applies directly to AWS EC2 instances, Docker containers, and Kubernetes pods. Linux and networking fundamentals never go out of style.',
      nodes: [
        {
          id: 'users',
          kind: 'users',
          label: 'Users',
          position: { x: 1, y: 3 },
          status: 'active',
          badge: 'production users',
        },
        {
          id: 'vps',
          kind: 'custom',
          label: 'VPS',
          sublabel: 'our chosen path',
          position: { x: 5, y: 3 },
          status: 'active',
          badge: 'root access',
        },
      ],
      flows: [
        { id: 'f-u-vps', from: 'users', to: 'vps', type: 'request', active: true, sequence: 1 },
        { id: 'f-vps-u', from: 'vps', to: 'users', type: 'response', active: true, sequence: 1 },
      ],
      telemetry: [
        { id: 'manage', label: 'YOU MANAGE', value: 'full stack', icon: 'Shield' },
        { id: 'setup', label: 'SETUP TIME', value: 'our focus', icon: 'Clock' },
        { id: 'control', label: 'CONTROL', value: 'complete', icon: 'Gauge' },
        { id: 'cost', label: 'COST AT SCALE', value: 'predictable', icon: 'Zap' },
      ],
      crowd: { users: 200 },
      learned: 'Why hands-on VPS administration builds the foundation for all modern deployment skills.',
    },
  ],
};
