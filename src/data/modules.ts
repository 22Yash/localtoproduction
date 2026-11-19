import { Difficulty, Lesson, Module } from '../types/course';
import { localhostHidesLesson } from './lessons/localhost-hides';
import { blockingIoEventLoopLesson } from './lessons/blocking-io-event-loop';
import { nginxLoadBalancingLesson } from './lessons/nginx-load-balancing';

function createPlaceholderLesson(
  id: string,
  moduleId: string,
  order: number,
  title: string,
  subtitle: string,
  difficulty: Difficulty = 'Beginner',
  minutes = 10,
): Lesson {
  return {
    id,
    moduleId,
    order,
    title,
    subtitle,
    minutes,
    difficulty,
    whyItMatters: 'Understanding this architectural concept is vital before taking applications into production.',
    realWorldEquivalent: 'Production environments rely on this foundation at every tier.',
    steps: [
      {
        id: `${id}-step-1`,
        shortLabel: 'Overview',
        title: `${title} - Coming Soon`,
        category: 'ARCHITECTURE',
        explanation: [
          `This lesson (${title}) is part of the ShipToProd curriculum and is scheduled to be completed in Phase 5.`,
          'Check out the flagship lesson "4.3 NGINX Load Balancing & Failover" to experience the interactive visual simulation.',
        ],
        goodToKnow: 'ShipToProd lessons are driven entirely by typed snapshot data, never by custom UI code.',
        nodes: [],
        flows: [],
        telemetry: [
          { id: 'm1', label: 'STATUS', value: 'Draft', icon: 'Activity' },
          { id: 'm2', label: 'EST. TIME', value: `${minutes}m`, icon: 'Clock' },
          { id: 'm3', label: 'DIFFICULTY', value: difficulty, icon: 'Shield' },
          { id: 'm4', label: 'COMPLETION', value: '0%', icon: 'CheckCircle' },
        ],
        learned: `Foundational concepts for ${title}.`,
      },
    ],
  };
}

export const modules: Module[] = [
  {
    id: '01-localhost-limits',
    order: 1,
    title: '01. Localhost Limits',
    lessonIds: [
      'localhost-hides',
      'blocking-io-event-loop',
      'paas-vs-iaas-vs-vps',
      'target-architecture',
    ],
  },
  {
    id: '02-linux-cloud-vps',
    order: 2,
    title: '02. Linux & Cloud VPS',
    lessonIds: [
      'vps-first-ssh',
      'ssh-keys-security',
      'users-sudo-permissions',
      'ufw-firewall-deploy',
    ],
  },
  {
    id: '03-process-management',
    order: 3,
    title: '03. Process Management',
    lessonIds: [
      'why-node-dies',
      'pm2-basics',
      'pm2-cluster-mode',
      'zero-downtime-reload',
    ],
  },
  {
    id: '04-nginx',
    order: 4,
    title: '04. NGINX & Load Balancing',
    lessonIds: [
      'reverse-proxy-basics',
      'upstream-algorithms',
      'nginx-load-balancing',
      'nginx-static-gzip-security',
    ],
  },
  {
    id: '05-redis-caching',
    order: 5,
    title: '05. Redis Caching',
    lessonIds: [
      'db-melts',
      'cache-aside-ttl',
      'hit-rate-math',
      'invalidation-stampede',
    ],
  },
  {
    id: '06-domains-tls',
    order: 6,
    title: '06. Domains & TLS/HTTPS',
    lessonIds: [
      'dns-a-records',
      'tcp-vs-tls-handshake',
      'certbot-auto-renewal',
      'go-live-checklist',
    ],
  },
  {
    id: '07-big-companies',
    order: 7,
    title: '07. How Big Companies Do It',
    lessonIds: [
      'docker-basics',
      'kubernetes-basics',
      'cloud-load-balancers-cdn',
      'cicd-monitoring',
    ],
  },
];

export const lessons: Record<string, Lesson> = {
  // Module 1: Localhost Limits
  'localhost-hides': localhostHidesLesson,
  'blocking-io-event-loop': blockingIoEventLoopLesson,
  'paas-vs-iaas-vs-vps': createPlaceholderLesson(
    'paas-vs-iaas-vs-vps',
    '01-localhost-limits',
    3,
    'PaaS vs IaaS vs VPS',
    'What a "Deploy" button actually does for you.',
    'Beginner',
    9,
  ),
  'target-architecture': createPlaceholderLesson(
    'target-architecture',
    '01-localhost-limits',
    4,
    'The target architecture',
    'Users, NGINX, Node cluster, Redis, MongoDB preview.',
    'Beginner',
    12,
  ),

  // Module 2: Linux & Cloud VPS
  'vps-first-ssh': createPlaceholderLesson(
    'vps-first-ssh',
    '02-linux-cloud-vps',
    1,
    'Creating a VPS and first SSH login',
    'Spinning up a cloud instance and connecting via terminal.',
    'Beginner',
    10,
  ),
  'ssh-keys-security': createPlaceholderLesson(
    'ssh-keys-security',
    '02-linux-cloud-vps',
    2,
    'SSH keys & disabling password login',
    'Ed25519 key authentication and locking down SSH config.',
    'Beginner',
    11,
  ),
  'users-sudo-permissions': createPlaceholderLesson(
    'users-sudo-permissions',
    '02-linux-cloud-vps',
    3,
    'Users, sudo, and permissions',
    'Creating deploy users and dropping root privileges.',
    'Beginner',
    10,
  ),
  'ufw-firewall-deploy': createPlaceholderLesson(
    'ufw-firewall-deploy',
    '02-linux-cloud-vps',
    4,
    'UFW firewall & code deployment',
    'Opening ports 22, 80, 443 safely and cloning your repo.',
    'Beginner',
    12,
  ),

  // Module 3: Process Management
  'why-node-dies': createPlaceholderLesson(
    'why-node-dies',
    '03-process-management',
    1,
    'Why node server.js dies',
    'Unhandled exceptions, terminal disconnects, and reboots.',
    'Intermediate',
    9,
  ),
  'pm2-basics': createPlaceholderLesson(
    'pm2-basics',
    '03-process-management',
    2,
    'PM2 basics',
    'start, logs, restart, startup, and save commands.',
    'Intermediate',
    11,
  ),
  'pm2-cluster-mode': createPlaceholderLesson(
    'pm2-cluster-mode',
    '03-process-management',
    3,
    'PM2 cluster mode',
    'One instance per CPU core, sharing a single port.',
    'Intermediate',
    13,
  ),
  'zero-downtime-reload': createPlaceholderLesson(
    'zero-downtime-reload',
    '03-process-management',
    4,
    'Zero-downtime reload and limits',
    'pm2 reload, max_memory_restart, and ecosystem.config.js.',
    'Intermediate',
    14,
  ),

  // Module 4: NGINX & Load Balancing
  'reverse-proxy-basics': createPlaceholderLesson(
    'reverse-proxy-basics',
    '04-nginx',
    1,
    'Reverse proxy basics',
    'Fronting Node.js on port 80/443 with NGINX proxy_pass.',
    'Intermediate',
    10,
  ),
  'upstream-algorithms': createPlaceholderLesson(
    'upstream-algorithms',
    '04-nginx',
    2,
    'Upstream blocks and algorithms',
    'Round robin, least_conn, and ip_hash compared.',
    'Intermediate',
    12,
  ),
  'nginx-load-balancing': nginxLoadBalancingLesson, // Flagship lesson!
  'nginx-static-gzip-security': createPlaceholderLesson(
    'nginx-static-gzip-security',
    '04-nginx',
    4,
    'Static files, gzip, and rate limiting',
    'Offloading static assets, compressing payloads, and security headers.',
    'Intermediate',
    14,
  ),

  // Module 5: Redis Caching
  'db-melts': createPlaceholderLesson(
    'db-melts',
    '05-redis-caching',
    1,
    'The DB melts',
    'Connection limits and query latency under concurrent reads.',
    'Intermediate',
    10,
  ),
  'cache-aside-ttl': createPlaceholderLesson(
    'cache-aside-ttl',
    '05-redis-caching',
    2,
    'Cache-aside pattern and TTL',
    'Reading cache before DB and setting appropriate expiration.',
    'Intermediate',
    12,
  ),
  'hit-rate-math': createPlaceholderLesson(
    'hit-rate-math',
    '05-redis-caching',
    3,
    'Hit rate math',
    'Calculating average response latency from cache hit ratio.',
    'Intermediate',
    11,
  ),
  'invalidation-stampede': createPlaceholderLesson(
    'invalidation-stampede',
    '05-redis-caching',
    4,
    'Invalidation and cache stampede',
    'Stale data prevention, write-through, and stampede mitigation.',
    'Advanced',
    15,
  ),

  // Module 6: Domains & TLS/HTTPS
  'dns-a-records': createPlaceholderLesson(
    'dns-a-records',
    '06-domains-tls',
    1,
    'DNS and A records',
    'Mapping hostnames to server IPs and DNS TTL propagation.',
    'Beginner',
    10,
  ),
  'tcp-vs-tls-handshake': createPlaceholderLesson(
    'tcp-vs-tls-handshake',
    '06-domains-tls',
    2,
    'TCP vs TLS handshake',
    'How HTTPS establishes encrypted connections with certificates.',
    'Intermediate',
    12,
  ),
  'certbot-auto-renewal': createPlaceholderLesson(
    'certbot-auto-renewal',
    '06-domains-tls',
    3,
    'Certbot and auto-renewal',
    "Let's Encrypt certificates, NGINX plugin, and systemd renew timer.",
    'Intermediate',
    13,
  ),
  'go-live-checklist': createPlaceholderLesson(
    'go-live-checklist',
    '06-domains-tls',
    4,
    'Go-live checklist (Capstone)',
    'Tracing a single user request end-to-end through the full production stack.',
    'Advanced',
    18,
  ),

  // Module 7: How Big Companies Do It
  'docker-basics': createPlaceholderLesson(
    'docker-basics',
    '07-big-companies',
    1,
    'Docker: package once, run anywhere',
    'Containers, Dockerfiles, and eliminating "works on my machine".',
    'Intermediate',
    12,
  ),
  'kubernetes-basics': createPlaceholderLesson(
    'kubernetes-basics',
    '07-big-companies',
    2,
    'Kubernetes basics',
    'Pods, Deployments, Services, and self-healing replicas.',
    'Advanced',
    16,
  ),
  'cloud-load-balancers-cdn': createPlaceholderLesson(
    'cloud-load-balancers-cdn',
    '07-big-companies',
    3,
    'Cloud load balancers & CDN',
    'Edge caching, Anycast routing, and managed auto-scaling pools.',
    'Advanced',
    15,
  ),
  'cicd-monitoring': createPlaceholderLesson(
    'cicd-monitoring',
    '07-big-companies',
    4,
    'CI/CD and monitoring',
    'Automated GitHub Actions deployment, Prometheus, Grafana, and alerts.',
    'Advanced',
    15,
  ),
};

export const allLessons: Lesson[] = Object.values(lessons);

export function getLessonById(id: string): Lesson | undefined {
  return lessons[id];
}

export function getModuleById(id: string): Module | undefined {
  return modules.find((m) => m.id === id);
}

export function isLessonPlaceholder(lesson?: Lesson | null): boolean {
  if (!lesson) return true;
  return (
    lesson.steps.length <= 1 &&
    ((lesson.steps[0]?.nodes.length ?? 0) === 0 ||
      lesson.steps[0]?.title.includes('Coming Soon'))
  );
}
