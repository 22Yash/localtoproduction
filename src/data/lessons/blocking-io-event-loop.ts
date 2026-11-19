import { Lesson } from '../../types/course';

export const blockingIoEventLoopLesson: Lesson = {
  id: 'blocking-io-event-loop',
  moduleId: '01-localhost-limits',
  order: 2,
  title: 'Blocking I/O and the event loop',
  subtitle: 'One slow request freezes everyone.',
  minutes: 8,
  difficulty: 'Beginner',
  whyItMatters: 'Because Node.js executes JavaScript on a single thread, a single synchronous CPU-heavy operation blocks all other users simultaneously.',
  realWorldEquivalent: 'At scale, heavy work goes to background workers and queues, and the web tier stays fast',
  steps: [
    // Step 1: One request
    {
      id: 'step-1-one-request',
      shortLabel: 'One request',
      title: 'Baseline: JavaScript Executes on a Single Thread',
      category: 'ARCHITECTURE',
      explanation: [
        'When an incoming HTTP request arrives at your Node.js application, Node processes the JavaScript code on a single main thread. There are no separate threads allocated per user connection.',
        'For standard lightweight operations—such as reading headers, dispatching routes, and returning JSON—execution finishes in milliseconds. Latency is just 20 ms and CPU utilization sits at 5%.',
      ],
      goodToKnow: 'Node.js is single-threaded for your application code. All JavaScript statements run sequentially on one call stack, making concurrency management lightweight and simple.',
      nodes: [
        {
          id: 'users',
          kind: 'users',
          label: 'Users',
          position: { x: 1, y: 3 },
          status: 'active',
          badge: '1 online',
        },
        {
          id: 'node-1',
          kind: 'node',
          label: 'Node server',
          sublabel: '1 thread',
          position: { x: 5, y: 3 },
          status: 'active',
          badge: 'idle loop',
        },
      ],
      flows: [
        { id: 'f-u-n1', from: 'users', to: 'node-1', type: 'request', active: true, sequence: 1 },
        { id: 'f-n1-u', from: 'node-1', to: 'users', type: 'response', active: true, sequence: 1 },
      ],
      telemetry: [
        { id: 'event-loop', label: 'EVENT LOOP', value: '1 ms', numeric: 1, icon: 'Activity' },
        { id: 'latency', label: 'P95 LATENCY', value: '20 ms', numeric: 20, icon: 'Gauge' },
        { id: 'errors', label: 'ERROR RATE', value: '0.0%', numeric: 0.0, icon: 'AlertTriangle' },
        { id: 'cpu', label: 'NODE CPU', value: '5%', numeric: 5, icon: 'Cpu' },
      ],
      crowd: { users: 1 },
      learned: 'How Node.js executes JavaScript on a single thread.',
    },

    // Step 2: Waiting is cheap
    {
      id: 'step-2-waiting-is-cheap',
      shortLabel: 'Waiting is cheap',
      title: 'Non-Blocking I/O: Waiting on Database Calls Is Free',
      category: 'TECHNIQUE',
      explanation: [
        'Three users send concurrent requests that query a database or fetch a third-party API. Even on a single thread, Node does not sit idle waiting for network responses.',
        'Node registers an asynchronous callback with the operating system and immediately handles the next user. Because I/O operations are non-blocking, latency stays low at 22 ms.',
      ],
      goodToKnow: 'The event loop continuously cycles through phases: running timers, checking completed I/O events, and firing callbacks. Slow I/O never blocks other requests because the OS handles the wait.',
      nodes: [
        {
          id: 'users',
          kind: 'users',
          label: 'Users',
          position: { x: 1, y: 3 },
          status: 'active',
          badge: '3 online',
        },
        {
          id: 'node-1',
          kind: 'node',
          label: 'Node server',
          sublabel: '1 thread',
          position: { x: 5, y: 3 },
          status: 'active',
          badge: 'async I/O',
        },
      ],
      flows: [
        { id: 'f-u-n1', from: 'users', to: 'node-1', type: 'request', active: true, sequence: 1 },
        { id: 'f-n1-u', from: 'node-1', to: 'users', type: 'response', active: true, sequence: 1 },
      ],
      telemetry: [
        { id: 'event-loop', label: 'EVENT LOOP', value: '2 ms', numeric: 2, icon: 'Activity' },
        { id: 'latency', label: 'P95 LATENCY', value: '22 ms', numeric: 22, icon: 'Gauge' },
        { id: 'errors', label: 'ERROR RATE', value: '0.0%', numeric: 0.0, icon: 'AlertTriangle' },
        { id: 'cpu', label: 'NODE CPU', value: '9%', numeric: 9, icon: 'Cpu' },
      ],
      crowd: { users: 3 },
      learned: 'Why non-blocking I/O allows one thread to juggle multiple concurrent requests.',
    },

    // Step 3: A heavy synchronous task arrives
    {
      id: 'step-3-heavy-task',
      shortLabel: 'Heavy task arrives',
      title: 'Synchronous Workload: A CPU Loop Freezes the Thread',
      category: 'FAILOVER',
      explanation: [
        'A single user triggers a CPU-intensive operation: parsing a massive 50MB JSON file or calculating a cryptographic password hash synchronously in a loop.',
        'Because JavaScript runs on one thread, this synchronous computation completely commandeers the call stack. The event loop stops cycling, and every other user is frozen in place.',
      ],
      goodToKnow: 'The event loop can only do one thing at a time. If synchronous JavaScript executes for 2.4 seconds, all incoming network packets sit in the kernel buffer until that single computation completes.',
      nodes: [
        {
          id: 'users',
          kind: 'users',
          label: 'Users',
          position: { x: 1, y: 3 },
          status: 'active',
          badge: 'waiting behind',
        },
        {
          id: 'node-1',
          kind: 'node',
          label: 'Node server',
          sublabel: '1 thread',
          position: { x: 5, y: 3 },
          status: 'overloaded',
          badge: 'blocked 2.4s',
        },
      ],
      flows: [
        { id: 'f-u-n1', from: 'users', to: 'node-1', type: 'request', active: true, sequence: 1 },
      ],
      telemetry: [
        { id: 'event-loop', label: 'EVENT LOOP', value: '2,400 ms', numeric: 2400, icon: 'Activity' },
        { id: 'latency', label: 'P95 LATENCY', value: '2,420 ms', numeric: 2420, icon: 'Gauge' },
        { id: 'errors', label: 'ERROR RATE', value: '0.0%', numeric: 0.0, icon: 'AlertTriangle' },
        { id: 'cpu', label: 'NODE CPU', value: '100%', numeric: 100, icon: 'Cpu' },
      ],
      crowd: { users: 3 },
      learned: 'How long-running synchronous code freezes the event loop for all users.',
    },

    // Step 4: The queue grows
    {
      id: 'step-4-queue-grows',
      shortLabel: 'The queue grows',
      title: 'The Queue Grows: Cascading Latency and Dropped Connections',
      category: 'FAILOVER',
      explanation: [
        'With the main thread blocked for 5.1 seconds, 198 incoming requests sit stalled in the operating system socket backlog queue.',
        'Client connection timers expire, and browser requests begin failing with 504 Gateway Timeouts. One person’s heavy calculation has frozen all other users.',
      ],
      goodToKnow: 'In production, a blocked event loop often triggers false downtime alerts: health checks sent by load balancers will timeout and mark your healthy server dead even though memory is fine.',
      nodes: [
        {
          id: 'users',
          kind: 'users',
          label: 'Users',
          position: { x: 1, y: 3 },
          status: 'active',
          badge: '200 queued',
        },
        {
          id: 'node-1',
          kind: 'node',
          label: 'Node server',
          sublabel: '1 thread',
          position: { x: 5, y: 3 },
          status: 'overloaded',
          badge: '198 waiting',
        },
      ],
      flows: [
        { id: 'f-u-n1', from: 'users', to: 'node-1', type: 'request', active: true, sequence: 1 },
      ],
      telemetry: [
        { id: 'event-loop', label: 'EVENT LOOP', value: '4,800 ms', numeric: 4800, icon: 'Activity' },
        { id: 'latency', label: 'P95 LATENCY', value: '5,100 ms', numeric: 5100, icon: 'Gauge' },
        { id: 'errors', label: 'ERROR RATE', value: '18.5%', numeric: 18.5, icon: 'AlertTriangle' },
        { id: 'cpu', label: 'NODE CPU', value: '100%', numeric: 100, icon: 'Cpu' },
      ],
      crowd: { users: 200 },
      learned: 'Why single-threaded bottlenecks trigger cascading latency spikes and timeout errors.',
    },

    // Step 5: Fixes that keep the thread free
    {
      id: 'step-5-fixes-keep-thread-free',
      shortLabel: 'Thread-safe fixes',
      title: 'Architectural Fixes: Offloading Work and Scaling Processes',
      category: 'TECHNIQUE',
      explanation: [
        'To prevent freezes, heavy computational tasks are moved to Node.js worker_threads or dedicated background queues (e.g. BullMQ with Redis). Large payloads use streaming parsers.',
        'Additionally, running extra Node processes allows the system to utilize multiple CPU cores. A second process appears, ready to absorb incoming traffic once balanced.',
      ],
      goodToKnow: 'worker_threads run true secondary OS threads with isolated event loops, while job queues allow dedicated background worker machines to crunch tasks without touching the web tier.',
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
          id: 'node-1',
          kind: 'node',
          label: 'Node server 1',
          sublabel: 'port 3000',
          position: { x: 5, y: 2.1 },
          status: 'active',
          badge: 'CPU 28%',
        },
        {
          id: 'node-2',
          kind: 'node',
          label: 'Node server 2',
          sublabel: 'port 3001 (preview)',
          position: { x: 5, y: 3.9 },
          status: 'active',
          badge: 'idle preview',
        },
      ],
      flows: [
        { id: 'f-u-n1', from: 'users', to: 'node-1', type: 'request', active: true, sequence: 1 },
        { id: 'f-n1-u', from: 'node-1', to: 'users', type: 'response', active: true, sequence: 1 },
      ],
      telemetry: [
        { id: 'event-loop', label: 'EVENT LOOP', value: '4 ms', numeric: 4, icon: 'Activity' },
        { id: 'latency', label: 'P95 LATENCY', value: '35 ms', numeric: 35, icon: 'Gauge' },
        { id: 'errors', label: 'ERROR RATE', value: '0.0%', numeric: 0.0, icon: 'AlertTriangle' },
        { id: 'cpu', label: 'NODE CPU', value: '28%', numeric: 28, icon: 'Cpu' },
      ],
      crowd: { users: 200 },
      learned: 'Techniques to protect the event loop: worker threads, background queues, and clustering.',
    },

    // Step 6: Recap and bridge
    {
      id: 'step-6-recap-bridge',
      shortLabel: 'Recap and bridge',
      title: 'The Production Pattern: Multi-Process Clustering and Load Balancing',
      category: 'ARCHITECTURE',
      explanation: [
        'A single Node.js process is constrained to one CPU core and remains a single point of failure. If an unhandled exception or blocking bug slips through, the entire server halts.',
        'Production systems solve this by running multiple processes across all CPU cores using PM2 (Module 3) and placing an NGINX reverse proxy in front to balance connections (Module 4).',
      ],
      goodToKnow: 'In Module 3, you will use PM2 cluster mode to run one process per CPU core with automatic restart on crash. In Module 4, NGINX will route traffic seamlessly between them.',
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
          id: 'node-1',
          kind: 'node',
          label: 'Node server 1',
          sublabel: 'port 3000',
          position: { x: 5, y: 2.1 },
          status: 'active',
          badge: 'core 1',
        },
        {
          id: 'node-2',
          kind: 'node',
          label: 'Node server 2',
          sublabel: 'port 3001 (preview)',
          position: { x: 5, y: 3.9 },
          status: 'active',
          badge: 'core 2',
        },
      ],
      flows: [
        { id: 'f-u-n1', from: 'users', to: 'node-1', type: 'request', active: true, sequence: 1 },
        { id: 'f-n1-u', from: 'node-1', to: 'users', type: 'response', active: true, sequence: 1 },
      ],
      telemetry: [
        { id: 'event-loop', label: 'EVENT LOOP', value: '2 ms', numeric: 2, icon: 'Activity' },
        { id: 'latency', label: 'P95 LATENCY', value: '25 ms', numeric: 25, icon: 'Gauge' },
        { id: 'errors', label: 'ERROR RATE', value: '0.0%', numeric: 0.0, icon: 'AlertTriangle' },
        { id: 'cpu', label: 'NODE CPU', value: '20%', numeric: 20, icon: 'Cpu' },
      ],
      crowd: { users: 200 },
      learned: 'How multi-process architecture with PM2 and NGINX scales beyond a single event loop.',
    },
  ],
};
