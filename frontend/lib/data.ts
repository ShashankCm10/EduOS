import type { GradientKey } from './utils';

/* ============================================================
   EduOS — demo dataset for a single student workspace
   Everything the UI renders flows through here, so swapping in
   a real API is a matter of replacing these objects.
   ============================================================ */

export const student = {
  id: 'stu_8241',
  name: 'Aarav Mehta',
  firstName: 'Aarav',
  handle: '@aarav.m',
  email: 'aarav.mehta@university.edu',
  roll: 'CSE21B1042',
  program: 'B.Tech · Computer Science & Engineering',
  semester: 5,
  batch: '2021 – 2025',
  hostel: 'Block C · Room 214',
  cgpa: 8.74,
  creditsEarned: 104,
  creditsTotal: 160,
  streak: 26,
  longestStreak: 41,
  xp: 12480,
  xpToNext: 15000,
  level: 14,
  rank: 7,
  cohortSize: 240,
  studyHoursWeek: 31.5,
  focusScore: 82,
  attendance: 91,
  joined: 'Aug 2021',
  goals: ['Crack GATE 2026', 'Land a summer internship', 'Publish a paper on RAG'],
};

export const todayStats = [
  { label: 'Study time today', value: 4.6, suffix: 'h', delta: +12, tone: 'violet' as GradientKey, spark: [2, 3, 2.5, 4, 3.4, 4.2, 4.6] },
  { label: 'Tasks completed', value: 7, suffix: '/9', delta: +3, tone: 'emerald' as GradientKey, spark: [3, 4, 3, 5, 6, 5, 7] },
  { label: 'Quiz accuracy', value: 84, suffix: '%', delta: +6, tone: 'cyan' as GradientKey, spark: [64, 68, 71, 70, 76, 80, 84] },
  { label: 'Focus streak', value: 26, suffix: 'd', delta: +1, tone: 'amber' as GradientKey, spark: [12, 15, 18, 20, 22, 24, 26] },
];

export type Subject = {
  id: string;
  code: string;
  title: string;
  short: string;
  faculty: string;
  credits: number;
  progress: number;
  grade: string;
  score: number;
  attendance: number;
  modules: number;
  modulesDone: number;
  tone: GradientKey;
  next: string;
  room: string;
  blurb: string;
  topics: string[];
};

export const subjects: Subject[] = [
  {
    id: 'dsa',
    code: 'CS302',
    title: 'Data Structures & Algorithms',
    short: 'DSA',
    faculty: 'Prof. Nandita Rao',
    credits: 4,
    progress: 78,
    grade: 'A',
    score: 89,
    attendance: 94,
    modules: 9,
    modulesDone: 7,
    tone: 'violet',
    next: 'Mon · 09:00',
    room: 'LH-204',
    blurb: 'Amortised analysis, graphs, dynamic programming and the interview canon.',
    topics: ['Trees', 'Graphs', 'DP', 'Greedy', 'Heaps', 'Tries'],
  },
  {
    id: 'os',
    code: 'CS304',
    title: 'Operating Systems',
    short: 'OS',
    faculty: 'Dr. Imran Qureshi',
    credits: 4,
    progress: 64,
    grade: 'A-',
    score: 81,
    attendance: 88,
    modules: 8,
    modulesDone: 5,
    tone: 'cyan',
    next: 'Tue · 11:00',
    room: 'LH-118',
    blurb: 'Processes, scheduling, synchronisation, memory and file systems.',
    topics: ['Scheduling', 'Deadlocks', 'Paging', 'Concurrency', 'I/O'],
  },
  {
    id: 'dbms',
    code: 'CS306',
    title: 'Database Management Systems',
    short: 'DBMS',
    faculty: 'Prof. Kavya Iyer',
    credits: 4,
    progress: 71,
    grade: 'A',
    score: 86,
    attendance: 92,
    modules: 8,
    modulesDone: 6,
    tone: 'emerald',
    next: 'Wed · 10:00',
    room: 'LH-204',
    blurb: 'Relational algebra, normalisation, indexing, transactions and tuning.',
    topics: ['SQL', 'Normalisation', 'Indexing', 'ACID', 'Query plans'],
  },
  {
    id: 'cn',
    code: 'CS308',
    title: 'Computer Networks',
    short: 'CN',
    faculty: 'Dr. Rohit Shenoy',
    credits: 3,
    progress: 52,
    grade: 'B+',
    score: 74,
    attendance: 79,
    modules: 7,
    modulesDone: 4,
    tone: 'amber',
    next: 'Thu · 14:00',
    room: 'LH-311',
    blurb: 'Layered protocol stacks, TCP/IP internals, routing and network security.',
    topics: ['TCP/IP', 'Routing', 'DNS', 'Sockets', 'TLS'],
  },
  {
    id: 'ml',
    code: 'AI402',
    title: 'Machine Learning Foundations',
    short: 'ML',
    faculty: 'Prof. Ananya Bose',
    credits: 4,
    progress: 43,
    grade: 'B',
    score: 71,
    attendance: 85,
    modules: 10,
    modulesDone: 4,
    tone: 'pink',
    next: 'Fri · 09:00',
    room: 'AI-Lab',
    blurb: 'Linear models to transformers — the maths, the code and the intuition.',
    topics: ['Regression', 'SVM', 'Trees', 'Neural nets', 'Attention'],
  },
  {
    id: 'maths',
    code: 'MA301',
    title: 'Discrete Mathematics',
    short: 'DM',
    faculty: 'Dr. S. Venkatesh',
    credits: 3,
    progress: 88,
    grade: 'A+',
    score: 93,
    attendance: 96,
    modules: 6,
    modulesDone: 6,
    tone: 'rose',
    next: 'Fri · 15:00',
    room: 'LH-102',
    blurb: 'Logic, combinatorics, graph theory and the algebra behind computing.',
    topics: ['Logic', 'Counting', 'Graph theory', 'Recurrences'],
  },
];

export type Assignment = {
  id: string;
  title: string;
  subjectId: string;
  due: string;
  status: 'overdue' | 'due-soon' | 'in-progress' | 'submitted' | 'graded';
  weight: number;
  score?: number;
  max: number;
  progress: number;
  type: 'Lab' | 'Essay' | 'Problem set' | 'Project' | 'Report';
  attachments: number;
  brief: string;
};

export const assignments: Assignment[] = [
  { id: 'a1', title: 'Red-Black Trees vs AVL: a benchmark study', subjectId: 'dsa', due: '2026-10-02', status: 'due-soon', weight: 10, max: 100, progress: 65, type: 'Report', attachments: 2, brief: 'Implement both trees, insert 1e6 keys, plot rebalance counts and compare p99 latencies.' },
  { id: 'a2', title: 'Implement a priority-inheritance scheduler', subjectId: 'os', due: '2026-10-05', status: 'in-progress', weight: 15, max: 100, progress: 40, type: 'Lab', attachments: 1, brief: 'Simulate priority inversion and fix it with inheritance. Submit traces + a 2-page writeup.' },
  { id: 'a3', title: 'Normalise the "CampusConnect" schema to 3NF', subjectId: 'dbms', due: '2026-09-28', status: 'graded', weight: 10, score: 92, max: 100, progress: 100, type: 'Problem set', attachments: 3, brief: 'Given 14 relations, identify FDs, decompose to 3NF and justify every split.' },
  { id: 'a4', title: 'Build a TCP chat server with socket multiplexing', subjectId: 'cn', due: '2026-09-26', status: 'overdue', weight: 15, max: 100, progress: 20, type: 'Lab', attachments: 0, brief: 'Threaded vs select()-based servers: measure throughput at 5k concurrent clients.' },
  { id: 'a5', title: 'From scratch: logistic regression + gradient descent', subjectId: 'ml', due: '2026-10-08', status: 'in-progress', weight: 20, max: 100, progress: 25, type: 'Project', attachments: 2, brief: 'No sklearn. Derive, implement, and report convergence curves on the given dataset.' },
  { id: 'a6', title: 'Combinatorial proofs of the pigeonhole principle', subjectId: 'maths', due: '2026-09-22', status: 'graded', weight: 10, score: 96, max: 100, progress: 100, type: 'Problem set', attachments: 1, brief: 'Twelve exercises on extremal counting. Rigour matters more than length.' },
  { id: 'a7', title: 'Dynamic programming: 25 curated problems', subjectId: 'dsa', due: '2026-10-11', status: 'in-progress', weight: 10, max: 100, progress: 52, type: 'Problem set', attachments: 0, brief: 'Submit accepted solutions with a one-line recurrence explanation for each.' },
  { id: 'a8', title: 'Two-phase locking and deadlock detection lab', subjectId: 'dbms', due: '2026-10-14', status: 'in-progress', weight: 15, max: 100, progress: 10, type: 'Lab', attachments: 1, brief: 'Build a wait-for-graph detector and demonstrate recovery on a synthetic schedule.' },
  { id: 'a9', title: 'Essay: is attention all you really need?', subjectId: 'ml', due: '2026-10-18', status: 'in-progress', weight: 15, max: 100, progress: 0, type: 'Essay', attachments: 0, brief: '1,800 words. Argue a position and cite at least six primary sources.' },
];

export const assignmentStatusMeta: Record<Assignment['status'], { label: string; chip: string }> = {
  overdue: { label: 'Overdue', chip: 'chip-pink' },
  'due-soon': { label: 'Due in 24h', chip: 'chip-amber' },
  'in-progress': { label: 'In progress', chip: 'chip-violet' },
  submitted: { label: 'Submitted', chip: 'chip-cyan' },
  graded: { label: 'Graded', chip: 'chip-emerald' },
};

export type Quiz = {
  id: string;
  title: string;
  subjectId: string;
  questions: number;
  minutes: number;
  attempts: number;
  best?: number;
  status: 'not-started' | 'in-progress' | 'completed';
  difficulty: 'Adaptive' | 'Core' | 'Challenge' | 'Rapid';
  tags: string[];
};

export const quizzes: Quiz[] = [
  { id: 'q1', title: 'Graphs: traversal & shortest paths', subjectId: 'dsa', questions: 20, minutes: 25, attempts: 3, best: 92, status: 'completed', difficulty: 'Adaptive', tags: ['BFS', 'DFS', 'Dijkstra'] },
  { id: 'q2', title: 'CPU scheduling & deadlocks', subjectId: 'os', questions: 18, minutes: 22, attempts: 1, best: 78, status: 'completed', difficulty: 'Core', tags: ['SJF', 'Banker’s'] },
  { id: 'q3', title: 'SQL joins, views & window functions', subjectId: 'dbms', questions: 15, minutes: 18, attempts: 2, best: 88, status: 'completed', difficulty: 'Core', tags: ['Joins', 'CTE'] },
  { id: 'q4', title: 'Subnetting & routing protocols sprint', subjectId: 'cn', questions: 12, minutes: 12, attempts: 0, status: 'not-started', difficulty: 'Rapid', tags: ['CIDR', 'OSPF'] },
  { id: 'q5', title: 'Bias–variance and regularisation', subjectId: 'ml', questions: 16, minutes: 20, attempts: 1, best: 64, status: 'completed', difficulty: 'Challenge', tags: ['L1', 'L2', 'CV'] },
  { id: 'q6', title: 'Recurrence relations masterclass', subjectId: 'maths', questions: 14, minutes: 16, attempts: 4, best: 100, status: 'completed', difficulty: 'Adaptive', tags: ['Master theorem'] },
];

export const lastQuizResult = {
  quizId: 'q1',
  title: 'Graphs: traversal & shortest paths',
  subject: 'Data Structures & Algorithms',
  score: 92,
  correct: 18,
  wrong: 1,
  skipped: 1,
  percentile: 96,
  cohortAvg: 71,
  duration: '19m 42s',
  avgTimePerQ: 59,
  xpEarned: 340,
  rankDelta: +3,
  topics: [
    { name: 'BFS / DFS', accuracy: 100, questions: 6 },
    { name: 'Dijkstra', accuracy: 92, questions: 5 },
    { name: 'Topological sort', accuracy: 88, questions: 4 },
    { name: 'Bellman-Ford', accuracy: 67, questions: 3 },
    { name: 'MST (Prim/Kruskal)', accuracy: 100, questions: 2 },
  ],
  timeline: [
    { q: 'Q1', correct: 1, time: 34 },
    { q: 'Q2', correct: 1, time: 41 },
    { q: 'Q3', correct: 1, time: 52 },
    { q: 'Q4', correct: 0, time: 96 },
    { q: 'Q5', correct: 1, time: 38 },
    { q: 'Q6', correct: 1, time: 44 },
    { q: 'Q7', correct: 1, time: 61 },
    { q: 'Q8', correct: 1, time: 47 },
    { q: 'Q9', correct: 1, time: 55 },
    { q: 'Q10', correct: 1, time: 49 },
    { q: 'Q11', correct: 1, time: 72 },
    { q: 'Q12', correct: 1, time: 58 },
  ],
};

export type Material = {
  id: string;
  title: string;
  subjectId: string;
  kind: 'PDF' | 'Slides' | 'Notes' | 'Formula sheet' | 'Past paper';
  pages: number;
  size: string;
  read: number;
  starred: boolean;
  updated: string;
};

export const materials: Material[] = [
  { id: 'm1', title: 'Unit 4 — Graph Algorithms (full notes)', subjectId: 'dsa', kind: 'PDF', pages: 84, size: '6.2 MB', read: 62, starred: true, updated: '2 days ago' },
  { id: 'm2', title: 'Dijkstra & Bellman-Ford worked examples', subjectId: 'dsa', kind: 'Slides', pages: 42, size: '3.1 MB', read: 100, starred: false, updated: '5 days ago' },
  { id: 'm3', title: 'Deadlock detection: Banker’s algorithm', subjectId: 'os', kind: 'PDF', pages: 36, size: '2.4 MB', read: 34, starred: true, updated: 'yesterday' },
  { id: 'm4', title: 'Paging & TLB numericals — 40 solved', subjectId: 'os', kind: 'Past paper', pages: 58, size: '4.8 MB', read: 12, starred: false, updated: '1 week ago' },
  { id: 'm5', title: 'Normalisation cheat-sheet (1NF → BCNF)', subjectId: 'dbms', kind: 'Formula sheet', pages: 6, size: '800 KB', read: 88, starred: true, updated: '3 days ago' },
  { id: 'm6', title: 'Transactions & isolation levels deep-dive', subjectId: 'dbms', kind: 'PDF', pages: 72, size: '5.5 MB', read: 45, starred: false, updated: '4 days ago' },
  { id: 'm7', title: 'TCP congestion control — Karn & Jacobson', subjectId: 'cn', kind: 'PDF', pages: 48, size: '3.9 MB', read: 22, starred: false, updated: '6 days ago' },
  { id: 'm8', title: 'Subnetting drills (with solutions)', subjectId: 'cn', kind: 'Past paper', pages: 30, size: '2.2 MB', read: 8, starred: true, updated: '2 days ago' },
  { id: 'm9', title: 'Gradient descent variants — derivations', subjectId: 'ml', kind: 'Notes', pages: 26, size: '1.7 MB', read: 55, starred: false, updated: 'today' },
];

export const materialChunks = [
  { id: 'c1', page: 18, chapter: '4.2 Graph traversal', text: 'Breadth-first search explores a graph in layers using a FIFO queue, guaranteeing the fewest number of edges from the source in an unweighted graph.' },
  { id: 'c2', page: 24, chapter: '4.5 Dijkstra’s algorithm', text: 'Dijkstra’s algorithm maintains a set S of vertices whose final shortest-path weights are known, repeatedly extracting the minimum-distance vertex from a binary heap.' },
  { id: 'c3', page: 31, chapter: '4.7 Bellman-Ford', text: 'Bellman-Ford relaxes every edge |V|−1 times and works with negative edge weights; a further relaxation that succeeds implies a negative-weight cycle.' },
  { id: 'c4', page: 44, chapter: '4.9 Minimum spanning trees', text: 'Kruskal’s algorithm sorts edges and unions disjoint sets; Prim’s algorithm grows a single tree by always adding the cheapest crossing edge.' },
];

export const timetable = [
  { day: 'Mon', slots: [{ t: '09:00', title: 'Data Structures & Algorithms', room: 'LH-204', subjectId: 'dsa', kind: 'Lecture' }, { t: '11:00', title: 'DBMS Lab', room: 'Lab-2', subjectId: 'dbms', kind: 'Lab' }, { t: '15:00', title: 'DSA Tutorial', room: 'LH-204', subjectId: 'dsa', kind: 'Tutorial' }] },
  { day: 'Tue', slots: [{ t: '11:00', title: 'Operating Systems', room: 'LH-118', subjectId: 'os', kind: 'Lecture' }, { t: '14:00', title: 'Discrete Maths', room: 'LH-102', subjectId: 'maths', kind: 'Lecture' }] },
  { day: 'Wed', slots: [{ t: '10:00', title: 'DBMS', room: 'LH-204', subjectId: 'dbms', kind: 'Lecture' }, { t: '13:00', title: 'ML Foundations', room: 'AI-Lab', subjectId: 'ml', kind: 'Lecture' }, { t: '16:00', title: 'OS Lab', room: 'Lab-4', subjectId: 'os', kind: 'Lab' }] },
  { day: 'Thu', slots: [{ t: '09:00', title: 'Computer Networks', room: 'LH-311', subjectId: 'cn', kind: 'Lecture' }, { t: '12:00', title: 'CN Tutorial', room: 'LH-311', subjectId: 'cn', kind: 'Tutorial' }, { t: '15:00', title: 'Library / deep work', room: '—', subjectId: 'dsa', kind: 'Focus' }] },
  { day: 'Fri', slots: [{ t: '09:00', title: 'ML Foundations', room: 'AI-Lab', subjectId: 'ml', kind: 'Lecture' }, { t: '11:00', title: 'Discrete Maths', room: 'LH-102', subjectId: 'maths', kind: 'Lecture' }, { t: '15:00', title: 'Project studio', room: 'Studio', subjectId: 'ml', kind: 'Focus' }] },
  { day: 'Sat', slots: [{ t: '10:00', title: 'Mock test — GATE pattern', room: 'Online', subjectId: 'dsa', kind: 'Exam' }, { t: '12:30', title: 'Weekly review & retro', room: '—', subjectId: 'maths', kind: 'Focus' }] },
  { day: 'Sun', slots: [{ t: '11:00', title: 'Rest + light revision', room: '—', subjectId: 'os', kind: 'Focus' }] },
];

export const tasks = [
  { id: 't1', title: 'Finish red-black tree benchmark plots', subjectId: 'dsa', done: false, mins: 45, priority: 'high' as const, when: 'Today · 17:00' },
  { id: 't2', title: 'Revise Bellman-Ford (weakest topic)', subjectId: 'dsa', done: false, mins: 30, priority: 'high' as const, when: 'Today · 19:30' },
  { id: 't3', title: 'Read 12 pages of OS Unit 5', subjectId: 'os', done: true, mins: 25, priority: 'med' as const, when: 'Today · 08:00' },
  { id: 't4', title: 'Subnetting drills — 20 questions', subjectId: 'cn', done: false, mins: 20, priority: 'med' as const, when: 'Tomorrow · 07:30' },
  { id: 't5', title: 'Draft ML project outline', subjectId: 'ml', done: false, mins: 60, priority: 'low' as const, when: 'Tomorrow · 16:00' },
  { id: 't6', title: 'Group call — DBMS lab pair work', subjectId: 'dbms', done: true, mins: 40, priority: 'med' as const, when: 'Yesterday · 20:00' },
];

export const examCountdown = [
  { code: 'CS302', subject: 'DSA', date: '2026-11-04', days: 34, readiness: 74 },
  { code: 'CS304', subject: 'OS', date: '2026-11-07', days: 37, readiness: 61 },
  { code: 'CS306', subject: 'DBMS', date: '2026-11-10', days: 40, readiness: 69 },
  { code: 'CS308', subject: 'CN', date: '2026-11-12', days: 42, readiness: 48 },
  { code: 'AI402', subject: 'ML', date: '2026-11-15', days: 45, readiness: 41 },
  { code: 'MA301', subject: 'DM', date: '2026-11-18', days: 48, readiness: 86 },
];

/* ---------- Analytics ---------- */
export const studyTrend = [
  { d: '18 Sep', hours: 3.2, focus: 70 },
  { d: '19 Sep', hours: 4.1, focus: 74 },
  { d: '20 Sep', hours: 2.4, focus: 62 },
  { d: '21 Sep', hours: 5.0, focus: 81 },
  { d: '22 Sep', hours: 4.4, focus: 78 },
  { d: '23 Sep', hours: 1.8, focus: 55 },
  { d: '24 Sep', hours: 5.6, focus: 86 },
  { d: '25 Sep', hours: 4.9, focus: 83 },
  { d: '26 Sep', hours: 3.7, focus: 72 },
  { d: '27 Sep', hours: 5.2, focus: 84 },
  { d: '28 Sep', hours: 4.8, focus: 80 },
  { d: '29 Sep', hours: 6.1, focus: 89 },
  { d: '30 Sep', hours: 5.4, focus: 85 },
  { d: '1 Oct', hours: 4.6, focus: 82 },
];

export const accuracyTrend = [
  { m: 'Mar', you: 58, cohort: 62 },
  { m: 'Apr', you: 63, cohort: 63 },
  { m: 'May', you: 61, cohort: 64 },
  { m: 'Jun', you: 69, cohort: 65 },
  { m: 'Jul', you: 74, cohort: 66 },
  { m: 'Aug', you: 78, cohort: 68 },
  { m: 'Sep', you: 84, cohort: 69 },
  { m: 'Oct', you: 87, cohort: 71 },
];

export const mastery = [
  { label: 'Problem solving', a: 88, b: 62 },
  { label: 'Theory recall', a: 76, b: 58 },
  { label: 'Speed', a: 71, b: 60 },
  { label: 'Accuracy', a: 84, b: 62 },
  { label: 'Consistency', a: 79, b: 55 },
  { label: 'Depth', a: 68, b: 54 },
];

export const focusSplit = [
  { label: 'Deep work', value: 42, tone: '#7C3AED' },
  { label: 'Practice/quiz', value: 26, tone: '#22D3EE' },
  { label: 'Reading', value: 18, tone: '#10B981' },
  { label: 'Revision', value: 14, tone: '#F59E0B' },
];

/* 12-week consistency heatmap (weeks × 7 days) — values 0-4 */
export const heatmap = Array.from({ length: 12 }, (_, w) =>
  Array.from({ length: 7 }, (_, d) => {
    const v = Math.abs(Math.sin((w + 1) * 1.7 + (d + 1) * 0.9)) * 4.6;
    const weekend = d >= 5 ? 0.6 : 1;
    return Math.min(4, Math.round(v * weekend));
  })
);

export const leaderboard = [
  { rank: 1, name: 'Ishita Verma', xp: 18420, you: false, tone: 'amber' },
  { rank: 2, name: 'Rahul Nair', xp: 17110, you: false, tone: 'amber' },
  { rank: 3, name: 'Sneha Pillai', xp: 16340, you: false, tone: 'amber' },
  { rank: 4, name: 'Devansh Gupta', xp: 14980, you: false, tone: 'violet' },
  { rank: 5, name: 'Meera Krishnan', xp: 14100, you: false, tone: 'violet' },
  { rank: 6, name: 'Kabir Anand', xp: 13050, you: false, tone: 'violet' },
  { rank: 7, name: 'Aarav Mehta', xp: 12480, you: true, tone: 'cyan' },
  { rank: 8, name: 'Tanvi Desai', xp: 11920, you: false, tone: 'cyan' },
];

/* ---------- AI tutor ---------- */
export const tutorSuggestions = [
  'Explain Dijkstra vs Bellman-Ford with a negative-edge example',
  'Quiz me on CPU scheduling for 10 minutes',
  'Summarise my OS Unit 5 notes into flashcards',
  'Why did I get Bellman-Ford wrong last week?',
  'Build a 7-day revision plan for my November exams',
];

export const tutorThread = [
  {
    role: 'student' as const,
    text: 'I keep getting Bellman-Ford wrong in quizzes. Can you explain when it beats Dijkstra?',
  },
  {
    role: 'tutor' as const,
    text: 'Short version: Dijkstra assumes every edge weight is non-negative — it greedily locks in the closest unvisited node, so a single negative edge can break that assumption. Bellman-Ford gives up greediness: it relaxes every edge |V| − 1 times, which is enough for the shortest path to propagate through any acyclic chain of at most |V| − 1 edges.',
    sources: [
      { doc: 'Unit 4 — Graph Algorithms (full notes)', page: 31 },
      { doc: 'Dijkstra & Bellman-Ford worked examples', page: 19 },
    ],
    blocks: [
      { title: 'Rule of thumb', body: 'No negative weights → Dijkstra, O(E log V). Any negative weight (but no negative cycle) → Bellman-Ford, O(V·E).' },
      { title: 'The tell-tale sign', body: 'If the question mentions negative weights, currency arbitrage, or a graph that changes over time, reach for Bellman-Ford.' },
    ],
    recall: 'You lost 2 of 3 Bellman-Ford questions in the 28 Sep quiz — both were "is there a negative cycle?" variants.',
  },
  {
    role: 'student' as const,
    text: 'So how do I actually detect the negative cycle?',
  },
  {
    role: 'tutor' as const,
    text: 'Run the standard |V| − 1 rounds first. Then do one more pass over every edge: if any edge can still be relaxed, that edge lies on or after a negative cycle, so the answer is "yes, a negative cycle exists". That extra pass is the whole trick — and it is exactly the step you skipped before.',
    sources: [{ doc: 'Unit 4 — Graph Algorithms (full notes)', page: 33 }],
    blocks: [
      { title: 'Mini drill', body: 'Take A→B (2), B→C (−5), C→A (1). Total = −2, so it is a negative cycle. Try to prove it in under 60 seconds.' },
    ],
  },
];

/* ---------- Materials RAG thread ---------- */
export const ragThread = [
  {
    role: 'student' as const,
    text: 'Summarise section 4.7 in 3 bullets and give me the exam-focused part.',
  },
  {
    role: 'tutor' as const,
    text: 'Here is 4.7 (Bellman-Ford), condensed from pages 31–33:',
    points: [
      'Relax all edges |V| − 1 times — enough for any shortest path with at most |V| − 1 edges.',
      'Works with negative weights; Dijkstra does not.',
      'One extra relaxation pass that succeeds ⇒ negative-weight cycle reachable from the source.',
    ],
    sources: [
      { doc: 'Unit 4 — Graph Algorithms (full notes)', page: 31 },
      { doc: 'Unit 4 — Graph Algorithms (full notes)', page: 33 },
    ],
    highlight: 'Exam-ready: the negative-cycle detection pass carries 4 marks in the 2023 and 2024 papers.',
  },
];

export const navLinks = [
  { label: 'Product', href: '#product' },
  { label: 'Features', href: '#features' },
  { label: 'AI Tutor', href: '#ai' },
  { label: 'Students', href: '#testimonials' },
  { label: 'Pricing', href: '#pricing' },
];
