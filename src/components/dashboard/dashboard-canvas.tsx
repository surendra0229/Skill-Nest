"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  Gamepad2,
  CheckCircle2,
  Code2,
  FileText,
  Play,
  ArrowRight,
  Sparkles,
  BookOpen,
  Video,
  Terminal,
  Trophy,
  Users,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  Flame,
  FileCheck2,
  Download,
  Copy,
  Layers,
  Clock,
  Send,
  Eye,
  Camera,
  Mic,
  Brain,
  Bug,
  Split,
  Building,
  MapPin,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import type { DashboardPillar } from "./top-navbar";
import type { LanguageNote, DsaQuestion, CareerRoadmap } from "@/db/schema";

interface DashboardCanvasProps {
  initialPillar?: DashboardPillar;
  userStats: {
    name?: string | null;
    username?: string | null;
    email?: string | null;
    role?: string;
    dsaSolved: number;
    contestSolved: number;
    atsChecksCount: number;
    latestAtsScore: number | null;
    modulesCompleted: number;
    xp: number;
    streak: number;
  };
  notes: LanguageNote[];
  dsaQuestions: DsaQuestion[];
  roadmaps: CareerRoadmap[];
}

export function DashboardCanvas({
  initialPillar = "learning",
  userStats,
  notes,
  dsaQuestions: initialDsa,
  roadmaps: initialRoadmaps,
}: DashboardCanvasProps) {
  // Current active top-level pillar
  const [activePillar, setActivePillar] = useState<DashboardPillar>(initialPillar);

  // Sub-tabs per pillar
  const [learningTab, setLearningTab] = useState<
    "overview" | "roadmaps" | "notes_yt" | "compiler" | "practice"
  >("overview");

  const [jobsTab, setJobsTab] = useState<
    "matched_jobs" | "latex_lab" | "ats_scanner" | "applied"
  >("matched_jobs");

  const [arcadeTab, setArcadeTab] = useState<
    "all" | "brain" | "coding" | "gesture_sound"
  >("all");

  // Listen for pillar changes triggered from top-navbar or URL
  useEffect(() => {
    const handleCustomPillarChange = (e: Event) => {
      const customEvent = e as CustomEvent<DashboardPillar>;
      if (customEvent.detail) {
        setActivePillar(customEvent.detail);
      }
    };

    window.addEventListener("skillnest:pillarChange", handleCustomPillarChange);

    // Initial check from URL
    const urlParams = new URLSearchParams(window.location.search);
    const p = urlParams.get("pillar") as DashboardPillar;
    if (p && ["learning", "jobs", "arcade"].includes(p)) {
      setActivePillar(p);
    }

    return () => {
      window.removeEventListener("skillnest:pillarChange", handleCustomPillarChange);
    };
  }, []);

  // Update URL search param when activePillar changes
  const switchPillar = (pillar: DashboardPillar) => {
    setActivePillar(pillar);
    const params = new URLSearchParams(window.location.search);
    params.set("pillar", pillar);
    window.history.pushState(null, "", `?${params.toString()}`);
  };

  // State for interactive features
  // 1. Contest Room Modal State
  const [isContestModalOpen, setIsContestModalOpen] = useState(false);
  const [contestRoomCode, setContestRoomCode] = useState("729415");
  const [contestMessage, setContestMessage] = useState("");
  const [contestChat, setContestChat] = useState([
    { sender: "Alex", text: "Ready for Two Sum speedrun!" },
    { sender: "Sarah", text: "Joined! 5 minutes remaining." },
  ]);

  // 2. Compiler state
  const [selectedLang, setSelectedLang] = useState("python");
  const [codeContent, setCodeContent] = useState(
    `# Two Sum - O(N) Hash Map Solution\ndef twoSum(nums, target):\n    lookup = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in lookup:\n            return [lookup[complement], i]\n        lookup[num] = i\n    return []\n\nprint("Result:", twoSum([2, 7, 11, 15], 9))`
  );
  const [compilerOutput, setCompilerOutput] = useState("");
  const [isExecutingCode, setIsExecutingCode] = useState(false);

  const handleRunCode = () => {
    setIsExecutingCode(true);
    setCompilerOutput("Executing on Judge0 engine...");
    setTimeout(() => {
      setCompilerOutput("Result: [0, 1]\n\nExecution Time: 0.042s | Memory: 14.2 MB\nStatus: Accepted (100% tests passed)");
      setIsExecutingCode(false);
      toast.success("Code executed successfully!");
    }, 600);
  };

  // 3. LaTeX resume code state
  const [latexCode, setLatexCode] = useState(`\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage{verbatim}
\\usepackage{enumitem}

\\begin{document}
\\begin{center}
    \\textbf{\\Huge \\scshape ${userStats.name || "Alex Chen"}} \\\\ \\vspace{1pt}
    \\small 987-654-3210 $|$ \\underline{${userStats.email || "engineer@skillnest.dev"}} $|$ \\underline{linkedin.com/in/dev} $|$ \\underline{github.com/coder}
\\end{center}

\\section{Education}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {State University of Technology}{City, State}
      {Bachelor of Science in Computer Science}{Expected May 2026}
  \\resumeSubHeadingListEnd

\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: Python, TypeScript, C++, SQL, Go} \\\\
     \\textbf{Frameworks}{: FastAPI, Next.js, React, Node.js, Tailwind CSS} \\\\
     \\textbf{Developer Tools}{: Git, Docker, Supabase, PostgreSQL, Linux}
    }}
 \\end{itemize}

\\section{Experience}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {Backend Software Engineering Intern}{June 2025 -- Aug 2025}
      {InnoTech Labs}{Remote}
      \\resumeItemListStart
        \\resumeItem{Developed high-throughput REST APIs using FastAPI and PostgreSQL, serving 50k daily active queries.}
        \\resumeItem{Implemented rate-limiting middleware using Redis and optimized database indices for 35\\% latency reduction.}
      \\resumeItemListEnd
  \\resumeSubHeadingListEnd
\\end{document}`);

  // 4. ATS instant fix state
  const [atsScore, setAtsScore] = useState(84);
  const [isFixingAts, setIsFixingAts] = useState(false);

  const handleRunAtsFix = () => {
    setIsFixingAts(true);
    setTimeout(() => {
      setAtsScore(96);
      setIsFixingAts(false);
      toast.success("AI ATS Fix applied! Score boosted to 96 / 100.");
    }, 900);
  };

  // 15 Games Data
  const gamesList = [
    // Brain (5)
    { id: 1, title: "Memory Match", category: "brain", icon: "🧠", tag: "Memory", gesture: false, sound: false, desc: "Match algorithmic data structures under strict moves." },
    { id: 2, title: "2048 Code Edition", category: "brain", icon: "🔢", tag: "Strategy", gesture: false, sound: false, desc: "Merge powers of two up to O(2^11) tiles." },
    { id: 3, title: "Sudoku Logic Grid", category: "brain", icon: "🧩", tag: "Backtracking", gesture: false, sound: false, desc: "Solve classic 9x9 constraints with algorithmic hints." },
    { id: 4, title: "Syntax Word Puzzle", category: "brain", icon: "🔠", tag: "Keywords", gesture: false, sound: false, desc: "Unscramble reserved programming keywords." },
    { id: 5, title: "Chess Engine Blitz", category: "brain", icon: "♟️", tag: "Minimax", gesture: false, sound: false, desc: "Battle Stockfish bot with tactical move timer." },
    // Coding (5)
    { id: 6, title: "Code Jigsaw", category: "coding", icon: "🧩", tag: "AST Parsing", gesture: false, sound: false, desc: "Reassemble scrambled function blocks in valid order." },
    { id: 7, title: "Output Predict", category: "coding", icon: "⚡", tag: "Runtime Scope", gesture: false, sound: false, desc: "Speedrun predicting console outputs with tricky closures." },
    { id: 8, title: "Speed Code Time Attack", category: "coding", icon: "⏱️", tag: "Fast Typing", gesture: false, sound: false, desc: "Implement clean algorithms before the countdown hits 0." },
    { id: 9, title: "Bug Sniper", category: "coding", icon: "🎯", tag: "Debugging", gesture: false, sound: false, desc: "Click the exact off-by-one error or memory leak line." },
    { id: 10, title: "Big-O Swipe", category: "coding", icon: "📈", tag: "Complexity", gesture: false, sound: false, desc: "Swipe left/right to classify algorithms into O(1), O(N), or O(N log N)." },
    // Casual / Gesture / Sound (5)
    { id: 11, title: "Typing Balloon Game", category: "gesture_sound", icon: "🎈", tag: "Keyboard Reflex", gesture: false, sound: false, desc: "Pop falling balloons by typing code snippets quickly." },
    { id: 12, title: "Reaction Challenge", category: "gesture_sound", icon: "⚡", tag: "Millisecond Reflex", gesture: false, sound: false, desc: "Hit the sensor instantly when compiler green lights flash." },
    { id: 13, title: "Bug Slicer", category: "gesture_sound", icon: "⚔️", tag: "Webcam Vision", gesture: true, sound: false, desc: "Slice flying software bugs with hand movements via camera." },
    { id: 14, title: "Sonic Flappy Coder", category: "gesture_sound", icon: "🎙️", tag: "Voice Pitch", gesture: false, sound: true, desc: "Control your character's flight altitude using microphone sound." },
    { id: 15, title: "Cyber Air Pong", category: "gesture_sound", icon: "🏓", tag: "Gesture Sensor", gesture: true, sound: false, desc: "Play air hockey against AI using your palm tracking." },
  ];

  const filteredGames = gamesList.filter((g) => {
    if (arcadeTab === "all") return true;
    if (arcadeTab === "brain") return g.category === "brain";
    if (arcadeTab === "coding") return g.category === "coding";
    if (arcadeTab === "gesture_sound") return g.category === "gesture_sound";
    return true;
  });

  return (
    <div className="w-full flex flex-col transition-colors duration-200">
      {/* ================================================================== */}
      {/* DYNAMIC HORIZONTAL SUB-TABS BAR                                    */}
      {/* ================================================================== */}
      <div className="sticky top-16 z-30 w-full border-b border-slate-200 dark:border-zinc-900 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-md px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 overflow-x-auto transition-colors duration-200 select-none">
        {/* Sub-Tabs for Pillar 1: 🎓 Learning Path */}
        {activePillar === "learning" && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            {[
              { id: "overview", label: "Overview", icon: Layers },
              { id: "roadmaps", label: "Roadmaps", icon: BookOpen },
              { id: "notes_yt", label: "Notes & YT (Split-Screen)", icon: Video },
              { id: "compiler", label: "Compiler", icon: Terminal },
              { id: "practice", label: "Practice & Contests", icon: Trophy },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = learningTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setLearningTab(tab.id as typeof learningTab)}
                  className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-slate-900 dark:bg-white text-white dark:text-black font-semibold shadow-xs"
                      : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Sub-Tabs for Pillar 2: 💼 Jobs & Resume */}
        {activePillar === "jobs" && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            {[
              { id: "matched_jobs", label: "Matched Jobs", icon: Briefcase },
              { id: "latex_lab", label: "LaTeX Resume Lab", icon: FileText },
              { id: "ats_scanner", label: "ATS Scanner", icon: ShieldCheck },
              { id: "applied", label: "Applied (3)", icon: CheckCircle2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = jobsTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setJobsTab(tab.id as typeof jobsTab)}
                  className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-slate-900 dark:bg-white text-white dark:text-black font-semibold shadow-xs"
                      : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Sub-Tabs for Pillar 3: 🎮 Arcade */}
        {activePillar === "arcade" && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            {[
              { id: "all", label: "All Games (15)", icon: Gamepad2 },
              { id: "brain", label: "🧠 Brain Games (5)", icon: Brain },
              { id: "coding", label: "💻 Coding Games (5)", icon: Code2 },
              { id: "gesture_sound", label: "⚡ Casual, Gesture & Sound (5)", icon: Zap },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = arcadeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setArcadeTab(tab.id as typeof arcadeTab)}
                  className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-slate-900 dark:bg-white text-white dark:text-black font-semibold shadow-xs"
                      : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Right Info Indicator */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
          <Badge
            variant="outline"
            className="text-[10px] font-mono border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300"
          >
            {activePillar === "learning"
              ? "TRACK: PYTHON & DSA"
              : activePillar === "jobs"
              ? "LATEX RESUME READY"
              : "15 MULTI-SENSORY GAMES"}
          </Badge>
        </div>
      </div>

      {/* ================================================================== */}
      {/* MAIN CONTENT CANVAS AREA                                           */}
      {/* ================================================================== */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* ================================================================ */}
        {/* PILLAR 1: LEARNING PATH CANVAS                                    */}
        {/* ================================================================ */}
        {activePillar === "learning" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* SUB-TAB: OVERVIEW (Default Wireframe View) */}
            {learningTab === "overview" && (
              <>
                {/* Top 2-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Left Card — 📌 ACTIVE TRACK */}
                  <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200/90 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-colors">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5" />
                          ACTIVE TRACK
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[11px] font-mono border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40"
                        >
                          62% COMPLETE
                        </Badge>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-3">
                        Python Backend Development
                      </h2>

                      <div className="mt-4 space-y-1.5">
                        <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-zinc-400">
                          <span>Syllabus Progress</span>
                          <span>62%</span>
                        </div>
                        <Progress
                          value={62}
                          className="h-2 bg-slate-100 dark:bg-zinc-900"
                        />
                      </div>

                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-4 leading-relaxed">
                        Next up: <strong className="text-slate-800 dark:text-zinc-200 font-semibold">AsyncIO &amp; FastAPI Intro</strong>. Master event loops, asynchronous route handlers, and dependency injection.
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-zinc-400">
                        14 / 22 modules completed
                      </span>
                      <Button
                        onClick={() => setLearningTab("roadmaps")}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl px-4 py-2 cursor-pointer shadow-sm shadow-blue-600/25"
                      >
                        Continue Track →
                      </Button>
                    </div>
                  </div>

                  {/* Right Card — ⚡ TODAY'S DSA TARGET */}
                  <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200/90 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-colors">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 fill-amber-500" />
                          TODAY&apos;S DSA TARGET
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[11px] font-mono border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40"
                        >
                          +50 XP
                        </Badge>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-3">
                        Two Sum - HashMap Approach
                      </h2>

                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300"
                        >
                          Medium
                        </Badge>
                        <span className="text-xs text-slate-500 dark:text-zinc-400">
                          Pattern: Arrays &amp; Hashing
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-4 leading-relaxed">
                        Find indices of two numbers that add up to a specific target in one single pass using an O(N) Hash Map look-ahead.
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
                        LeetCode #1
                      </span>
                      <Button
                        onClick={() => {
                          setLearningTab("compiler");
                          toast.info("Target loaded into the multi-language compiler.");
                        }}
                        className="bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white text-xs font-semibold rounded-xl px-4 py-2 cursor-pointer flex items-center gap-2"
                      >
                        <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                        <span>[ ▶ Solve in Compiler ]</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Bottom 3-Column Section — 📚 RECOMMENDED MODULES TO STUDY */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                        Recommended Modules to Study
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                        Handpicked notes, videos, and logic challenges aligned with your track.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Card 1: 📖 Handpicked Notes */}
                    <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200/90 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-blue-500/40 transition-colors">
                      <div>
                        <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400">
                          Handpicked Notes
                        </span>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                          Clean Architecture
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                          Decoupled domain layers, dependency inversion, and enterprise repository patterns.
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => setLearningTab("notes_yt")}
                        className="mt-5 w-full text-xs font-semibold rounded-xl border-slate-200 dark:border-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-blue-600 dark:text-blue-400 cursor-pointer"
                      >
                        [ Read PDF / Split View ]
                      </Button>
                    </div>

                    {/* Card 2: 🎥 Curated YT Series */}
                    <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200/90 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-red-500/40 transition-colors">
                      <div>
                        <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center mb-3">
                          <Video className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-red-600 dark:text-red-400">
                          Curated YT Series (Guarded)
                        </span>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                          FastAPI Crash Course
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                          Pydantic V2 validation, OAuth2 bearer tokens, and async database connections.
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => setLearningTab("notes_yt")}
                        className="mt-5 w-full text-xs font-semibold rounded-xl border-slate-200 dark:border-zinc-800 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 cursor-pointer"
                      >
                        [ Watch Stream ]
                      </Button>
                    </div>

                    {/* Card 3: 💻 Sandbox Challenges */}
                    <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200/90 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
                      <div>
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                          <Code2 className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          Sandbox Challenges
                        </span>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                          5 Mini Logic Tasks
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                          Dictionary comprehensions, generator pipelines, and custom decorator closures.
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => setLearningTab("compiler")}
                        className="mt-5 w-full text-xs font-semibold rounded-xl border-slate-200 dark:border-zinc-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 cursor-pointer"
                      >
                        [ Launch Code ]
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* SUB-TAB: ROADMAPS */}
            {learningTab === "roadmaps" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Role-Based Career Roadmaps
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                    Every sequential milestone required to achieve industry-ready engineering positions.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {(initialRoadmaps.length > 0
                    ? initialRoadmaps
                    : [
                        {
                          id: "1",
                          roleTitle: "Full-Stack Python & React Engineer",
                          description: "Master modern async backend development and Next.js full-stack systems.",
                          skillsRequired: "Python, FastAPI, PostgreSQL, Next.js, Docker, CI/CD",
                          estimatedDuration: "6 Months",
                          createdAt: new Date(),
                        },
                        {
                          id: "2",
                          roleTitle: "Algorithmic Problem Solver (FAANG Track)",
                          description: "Comprehensive DSA mastery covering all 15 core LeetCode algorithmic patterns.",
                          skillsRequired: "Arrays, Two Pointers, Trees, Graphs, Dynamic Programming, System Design",
                          estimatedDuration: "4 Months",
                          createdAt: new Date(),
                        },
                      ]
                  ).map((rm) => (
                    <div
                      key={rm.id}
                      className="bg-white dark:bg-[#0a0a0a] border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-6 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className="text-[10px] font-mono border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40"
                        >
                          {rm.estimatedDuration}
                        </Badge>
                        <span className="text-xs text-slate-400 dark:text-zinc-500 font-mono">
                          Verified Curriculum
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-3">
                        {rm.roleTitle}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                        {rm.description}
                      </p>

                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800/80">
                        <p className="text-[11px] font-semibold text-slate-700 dark:text-zinc-300 mb-2">
                          Core Milestones:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {rm.skillsRequired.split(",").map((skill, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-TAB: NOTES & YT (Desktop 50/50 Split-Screen with AI Guardrail) */}
            {learningTab === "notes_yt" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-zinc-800">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Split className="w-4 h-4 text-blue-500" />
                      50/50 Split-Screen Studio: Notes &amp; Curated Video
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Read curriculum notes on the left while streaming verified educational lectures on the right.
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-xs font-mono flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    AI Guardrail Active (Strictly Educational)
                  </Badge>
                </div>

                {/* 50/50 Split-Screen Container */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 h-[580px]">
                  {/* Left Half: Language Notes & Code */}
                  <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-5 overflow-y-auto flex flex-col">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800 text-xs">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        📖 Python Fundamentals: Clean Architecture &amp; Async
                      </span>
                      <Badge variant="secondary" className="text-[10px]">
                        Theory Notes
                      </Badge>
                    </div>

                    <div className="mt-4 space-y-4 text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        1. The Event Loop in Python
                      </h4>
                      <p>
                        The core of asynchronous programming in Python is the <code>asyncio</code> event loop. Unlike multi-threading which incurs context-switching overhead, cooperative multitasking yields execution voluntarily via <code>await</code>.
                      </p>

                      <div className="bg-slate-900 text-slate-100 dark:bg-zinc-950 rounded-xl p-3 font-mono text-[11px] overflow-x-auto">
                        <pre>{`import asyncio\n\nasync def fetch_user_data(user_id: int):\n    print(f"Fetching {user_id}...")\n    await asyncio.sleep(1.0) # simulate IO\n    return {"id": user_id, "status": "active"}\n\nasync def main():\n    results = await asyncio.gather(\n        fetch_user_data(1),\n        fetch_user_data(2)\n    )\n    print("All users fetched:", results)`}</pre>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        2. Real-World Industry Use Cases
                      </h4>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>High-throughput microservices connecting to PostgreSQL connection pools.</li>
                        <li>Non-blocking rate limiters querying Redis tokens concurrently.</li>
                        <li>Parallel webhook delivery systems processing thousands of HTTP callbacks.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Right Half: Guarded YouTube Stream */}
                  <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-5 flex flex-col">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800 text-xs">
                      <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-red-500" />
                        FastAPI &amp; Async Architecture (Guarded Player)
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono">
                        1080p 60fps
                      </span>
                    </div>

                    {/* Embedded Guarded Player Screen */}
                    <div className="flex-1 mt-4 rounded-xl bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden text-center p-6 border border-slate-800">
                      <div className="w-16 h-16 rounded-full bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center mb-4">
                        <Play className="w-7 h-7 fill-red-500" />
                      </div>
                      <h4 className="text-white text-base font-bold">
                        Stream: Python AsyncIO &amp; FastAPI Production Patterns
                      </h4>
                      <p className="text-xs text-zinc-400 mt-2 max-w-sm">
                        Verified by AI Guardrail Agent: Zero entertainment recommendations or distractions allowed.
                      </p>
                      <Button
                        onClick={() => toast.success("Stream launched in guarded sandbox player.")}
                        className="mt-5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-xl px-5 py-2 cursor-pointer shadow-md shadow-red-600/30"
                      >
                        Play Verified Video
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB: COMPILER (Multi-Language Monaco/Judge0 Studio) */}
            {learningTab === "compiler" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-emerald-500" />
                      Multi-Language Cloud Compiler
                    </h3>
                    <select
                      value={selectedLang}
                      onChange={(e) => setSelectedLang(e.target.value)}
                      className="text-xs bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-2.5 py-1 text-slate-900 dark:text-white font-medium focus:outline-none"
                    >
                      <option value="python">Python 3.12</option>
                      <option value="javascript">JavaScript (Node 20)</option>
                      <option value="typescript">TypeScript 5.5</option>
                      <option value="cpp">C++ 20 (GCC)</option>
                      <option value="java">Java 21 (OpenJDK)</option>
                      <option value="rust">Rust 1.79</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-[10px] font-mono border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400"
                    >
                      Judge0 Rate Limit: 30 / 15-min
                    </Badge>
                    <Button
                      onClick={handleRunCode}
                      disabled={isExecutingCode}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl px-4 py-2 cursor-pointer flex items-center gap-1.5 shadow-sm shadow-emerald-600/25"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{isExecutingCode ? "Running..." : "Run Code"}</span>
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 h-[520px]">
                  {/* Code Editor */}
                  <div className="lg:col-span-2 bg-slate-950 rounded-2xl p-4 border border-slate-800 flex flex-col font-mono">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs text-zinc-400">
                      <span>main.{selectedLang === "python" ? "py" : selectedLang === "typescript" ? "ts" : selectedLang === "cpp" ? "cpp" : "js"}</span>
                      <span>UTF-8</span>
                    </div>
                    <textarea
                      value={codeContent}
                      onChange={(e) => setCodeContent(e.target.value)}
                      className="flex-1 w-full bg-transparent text-emerald-400 text-xs p-2 leading-relaxed resize-none focus:outline-none font-mono"
                      spellCheck={false}
                    />
                  </div>

                  {/* Execution Output Console */}
                  <div className="bg-slate-900 dark:bg-black rounded-2xl p-4 border border-slate-200 dark:border-zinc-800 flex flex-col font-mono text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400">
                      <span>Output Console</span>
                      <button
                        type="button"
                        onClick={() => setCompilerOutput("")}
                        className="text-[10px] hover:text-white"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex-1 p-2 overflow-y-auto text-slate-800 dark:text-zinc-200 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                      {compilerOutput || "Click 'Run Code' to compile and execute in Judge0 cloud container..."}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB: PRACTICE & CONTESTS */}
            {learningTab === "practice" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-zinc-800">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      LeetCode DSA &amp; Free Fire Style Contest Rooms
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                      Practice curated algorithmic patterns or create 1v1 and squad coding battle rooms.
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsContestModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl px-4 py-2 cursor-pointer flex items-center gap-2 shadow-sm shadow-blue-600/25 self-start sm:self-auto"
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Create Contest Room (6-Digit)</span>
                  </Button>
                </div>

                {/* DSA Problem List */}
                <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                    Curated DSA Problems &amp; Test Cases
                  </h4>
                  <div className="space-y-3">
                    {(initialDsa.length > 0
                      ? initialDsa
                      : [
                          {
                            id: "1",
                            title: "Two Sum",
                            difficulty: "Easy" as const,
                            pattern: "Arrays & Hashing",
                            description: "Find indices of elements adding to target.",
                            createdAt: new Date(),
                          },
                          {
                            id: "2",
                            title: "Valid Anagram",
                            difficulty: "Easy" as const,
                            pattern: "Frequency Counting",
                            description: "Check if string s can be rearranged to t.",
                            createdAt: new Date(),
                          },
                          {
                            id: "3",
                            title: "Longest Substring Without Repeating Characters",
                            difficulty: "Medium" as const,
                            pattern: "Sliding Window",
                            description: "Compute max window size with distinct characters.",
                            createdAt: new Date(),
                          },
                        ]
                    ).map((q) => (
                      <div
                        key={q.id}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/70 dark:border-zinc-800/70 hover:border-blue-500/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <div>
                            <h5 className="text-xs font-semibold text-slate-900 dark:text-white">
                              {q.title}
                            </h5>
                            <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                              {q.pattern}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Badge
                            variant={q.difficulty === "Easy" ? "secondary" : "default"}
                            className="text-[10px]"
                          >
                            {q.difficulty}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setLearningTab("compiler");
                              toast.info(`Loaded problem: ${q.title}`);
                            }}
                            className="text-xs rounded-lg cursor-pointer"
                          >
                            Solve in Compiler
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Free Fire Style Contest Room Modal / Dialog */}
                {isContestModalOpen && (
                  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="w-full max-w-lg bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 text-slate-900 dark:text-zinc-100 space-y-4 animate-in zoom-in-95 duration-150">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-5 h-5 text-amber-500" />
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">
                            Free Fire Style Contest Room
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsContestModalOpen(false)}
                          className="text-slate-400 hover:text-white cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-mono uppercase text-amber-700 dark:text-amber-400">
                            6-Digit Room Code
                          </p>
                          <p className="text-2xl font-bold font-mono tracking-widest text-slate-900 dark:text-white">
                            {contestRoomCode}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(contestRoomCode);
                            toast.success("Room Code copied! Share with friends.");
                          }}
                          className="text-xs rounded-lg cursor-pointer flex items-center gap-1.5"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </Button>
                      </div>

                      {/* Friends Squad List */}
                      <div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200 mb-2">
                          Lobby Squad (3 / 4 Players)
                        </p>
                        <div className="space-y-1.5">
                          {[
                            { name: "You (Host)", ready: true },
                            { name: "Alex_CodeDev", ready: true },
                            { name: "Sarah_Pythonista", ready: false },
                          ].map((player, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-zinc-900 text-xs"
                            >
                              <span className="font-medium text-slate-700 dark:text-zinc-300">
                                {player.name}
                              </span>
                              <Badge
                                variant={player.ready ? "default" : "secondary"}
                                className="text-[10px]"
                              >
                                {player.ready ? "READY" : "WAITING"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Live Room Chat */}
                      <div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200 mb-1.5">
                          Live Room Chat
                        </p>
                        <div className="h-28 bg-slate-100 dark:bg-zinc-950 rounded-xl p-2.5 overflow-y-auto space-y-1.5 text-xs font-sans">
                          {contestChat.map((c, i) => (
                            <p key={i}>
                              <strong className="text-blue-500">{c.sender}:</strong>{" "}
                              <span className="text-slate-700 dark:text-zinc-300">
                                {c.text}
                              </span>
                            </p>
                          ))}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <input
                            type="text"
                            value={contestMessage}
                            onChange={(e) => setContestMessage(e.target.value)}
                            placeholder="Type a message to squad..."
                            className="flex-1 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-white"
                          />
                          <Button
                            size="sm"
                            onClick={() => {
                              if (!contestMessage.trim()) return;
                              setContestChat((prev) => [
                                ...prev,
                                { sender: "You", text: contestMessage.trim() },
                              ]);
                              setContestMessage("");
                            }}
                            className="text-xs rounded-lg"
                          >
                            Send
                          </Button>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsContestModalOpen(false)}
                          className="text-xs rounded-xl"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            setIsContestModalOpen(false);
                            toast.success("Contest Battle Match started! Good luck.");
                          }}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-xl font-bold"
                        >
                          Start Speed Match
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================================================================ */}
        {/* PILLAR 2: JOBS & RESUME CANVAS                                    */}
        {/* ================================================================ */}
        {activePillar === "jobs" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* SUB-TAB: MATCHED JOBS (Default Wireframe View) */}
            {jobsTab === "matched_jobs" && (
              <>
                {/* Top 2-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Left Card — 📄 YOUR ACTIVE RESUME */}
                  <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200/90 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-colors">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" />
                          YOUR ACTIVE RESUME
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[10px] font-mono border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40"
                        >
                          LaTeX .TEX FORMAT ONLY
                        </Badge>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-3 font-mono">
                        Software_Engineer_V2.tex
                      </h2>

                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2">
                        Last updated: 2 days ago • Compiled with TeX Live Engine
                      </p>

                      <p className="text-xs text-slate-600 dark:text-zinc-300 mt-4 leading-relaxed">
                        Pure LaTeX resume structure engineered to bypass ATS parser errors, double column issues, and glyph encoding traps.
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setJobsTab("latex_lab")}
                        className="text-xs font-semibold rounded-xl border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-900 cursor-pointer"
                      >
                        [ Edit in LaTeX ]
                      </Button>
                      <Button
                        onClick={() => toast.success("Downloading compiled PDF: Software_Engineer_V2.pdf")}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl px-4 py-2 cursor-pointer flex items-center gap-1.5 shadow-sm shadow-blue-600/25"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>[ Download PDF ]</span>
                      </Button>
                    </div>
                  </div>

                  {/* Right Card — 🎯 ATS READINESS SCORE */}
                  <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200/90 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-colors">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          ATS READINESS SCORE
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[11px] font-mono border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40"
                        >
                          STRONG MATCH
                        </Badge>
                      </div>

                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                          {atsScore}
                        </span>
                        <span className="text-sm text-slate-500 dark:text-zinc-400">
                          / 100 (Strong Match)
                        </span>
                      </div>

                      <div className="mt-3 space-y-1.5">
                        <Progress
                          value={atsScore}
                          className="h-2 bg-slate-100 dark:bg-zinc-900"
                        />
                      </div>

                      <div className="mt-4 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                        <span>⚠️ Missing Keywords:</span>
                        <span className="font-semibold underline">Docker, Redis</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-zinc-400">
                        Protected by Rate Limiter (5/day)
                      </span>
                      <Button
                        onClick={handleRunAtsFix}
                        disabled={isFixingAts}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl px-4 py-2 cursor-pointer shadow-sm shadow-emerald-600/25"
                      >
                        {isFixingAts ? "Optimizing..." : "[ Run Instant Fix with AI ]"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Bottom List — 💼 MATCHED JOBS */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                        Matched Jobs (Based on your Learning Track &amp; Resume skills)
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                        Powered by JSearch API with direct employer apply channels and LaTeX resume integration.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Job Card 1 */}
                    <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200/90 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-500/40 transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">
                            Junior Backend Developer
                          </h4>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                            <Building className="w-3.5 h-3.5" />
                            InnoTech Labs
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-zinc-400">
                          Skills: <strong className="text-slate-700 dark:text-zinc-300">Python, FastAPI, PostgreSQL</strong> | Match: <strong className="text-emerald-500">88%</strong> | Location: Hyderabad / Remote
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <Button
                          variant="outline"
                          onClick={() => toast.info("Opening InnoTech Labs job description...")}
                          className="text-xs rounded-xl border-slate-200 dark:border-zinc-800 cursor-pointer"
                        >
                          [ View Job Description ]
                        </Button>
                        <Button
                          onClick={() => toast.success("Applied to InnoTech Labs with Software_Engineer_V2.tex!")}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl px-4 py-2 cursor-pointer shadow-sm shadow-blue-600/25 flex items-center gap-1.5"
                        >
                          <Zap className="w-3.5 h-3.5 fill-white" />
                          <span>[ ⚡ 1-Click Apply with LaTeX Resume ]</span>
                        </Button>
                      </div>
                    </div>

                    {/* Job Card 2 */}
                    <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200/90 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-500/40 transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">
                            Python Intern
                          </h4>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                            <Building className="w-3.5 h-3.5" />
                            CloudScale Systems
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-zinc-400">
                          Skills: <strong className="text-slate-700 dark:text-zinc-300">Python, Git, REST APIs</strong> | Match: <strong className="text-emerald-500">95%</strong> | Location: Bengaluru
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <Button
                          variant="outline"
                          onClick={() => toast.info("Opening CloudScale Systems internship details...")}
                          className="text-xs rounded-xl border-slate-200 dark:border-zinc-800 cursor-pointer"
                        >
                          [ View Job Description ]
                        </Button>
                        <Button
                          onClick={() => toast.success("Applied to CloudScale Systems with Software_Engineer_V2.tex!")}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl px-4 py-2 cursor-pointer shadow-sm shadow-blue-600/25 flex items-center gap-1.5"
                        >
                          <Zap className="w-3.5 h-3.5 fill-white" />
                          <span>[ ⚡ 1-Click Apply with LaTeX Resume ]</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* SUB-TAB: LATEX RESUME LAB */}
            {jobsTab === "latex_lab" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-zinc-800">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      LaTeX Resume Studio (Pure .tex Compilation)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Standardized professional LaTeX typesetting for bug-free ATS parsing and instant PDF generation.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-[10px] font-mono border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400"
                    >
                      Rate limit: 10 / hr
                    </Badge>
                    <Button
                      onClick={() => toast.success("Compiled successfully with TeX Live! Generated 1-page PDF.")}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl px-4 py-2 cursor-pointer shadow-sm shadow-blue-600/25 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Compile LaTeX → PDF</span>
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 h-[560px]">
                  {/* .tex Editor */}
                  <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 flex flex-col font-mono text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-zinc-400">
                      <span>resume.tex (LaTeX)</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(latexCode);
                          toast.success("LaTeX source copied!");
                        }}
                        className="text-[11px] text-blue-400 hover:text-blue-300"
                      >
                        Copy Source
                      </button>
                    </div>
                    <textarea
                      value={latexCode}
                      onChange={(e) => setLatexCode(e.target.value)}
                      className="flex-1 w-full bg-transparent text-slate-100 text-xs p-2 leading-relaxed resize-none focus:outline-none font-mono"
                      spellCheck={false}
                    />
                  </div>

                  {/* Live Rendered Document Preview */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-inner flex flex-col text-slate-900 font-serif overflow-y-auto">
                    <div className="text-center pb-4 border-b border-slate-300">
                      <h2 className="text-2xl font-bold tracking-tight">
                        {userStats.name || "Alex Chen"}
                      </h2>
                      <p className="text-xs text-slate-600 mt-1">
                        987-654-3210 • {userStats.email || "engineer@skillnest.dev"} • linkedin.com/in/dev • github.com/coder
                      </p>
                    </div>

                    <div className="mt-4 space-y-3 text-xs leading-relaxed">
                      <h3 className="text-sm font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5">
                        Technical Skills
                      </h3>
                      <p>
                        <strong>Languages:</strong> Python, TypeScript, C++, SQL, Go<br />
                        <strong>Frameworks:</strong> FastAPI, Next.js, React, Node.js, Tailwind CSS<br />
                        <strong>Developer Tools:</strong> Git, Docker, Supabase, PostgreSQL, Linux
                      </p>

                      <h3 className="text-sm font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 pt-2">
                        Experience
                      </h3>
                      <div>
                        <div className="flex justify-between font-bold">
                          <span>Backend Software Engineering Intern — InnoTech Labs</span>
                          <span>June 2025 – Aug 2025</span>
                        </div>
                        <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[11px] text-slate-700">
                          <li>Developed high-throughput REST APIs using FastAPI and PostgreSQL, serving 50k daily queries.</li>
                          <li>Implemented rate-limiting middleware using Redis and optimized database indices for 35% latency reduction.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB: ATS SCANNER */}
            {jobsTab === "ats_scanner" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    ATS Keyword Scanner &amp; AI Diagnostic Report
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                    Detect exact syntax keywords that recruiters filter for in modern automated parsing funnels.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase">
                      Parser Compatibility
                    </span>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                      98%
                    </p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                      Zero multi-column glitches, tables, or corrupted text glyphs detected.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
                    <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 uppercase">
                      Matched Keywords
                    </span>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                      18 / 20
                    </p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                      Python, REST, FastAPI, PostgreSQL, CI/CD, Unit Testing, SQL.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
                    <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 uppercase">
                      Actionable AI Fixes
                    </span>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                      2 Suggestions
                    </p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                      Add Docker containerization bullet and Redis caching metrics.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB: APPLIED JOBS */}
            {jobsTab === "applied" && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Active Applications Tracker (3)
                </h3>
                <div className="space-y-3">
                  {[
                    { company: "InnoTech Labs", role: "Junior Backend Developer", status: "Under Review", date: "Applied Yesterday" },
                    { company: "CloudScale Systems", role: "Python Intern", status: "Interview Scheduled", date: "3 days ago" },
                    { company: "Apex Systems", role: "Software Engineer I", status: "Application Submitted", date: "Last week" },
                  ].map((app, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                          {app.role} — {app.company}
                        </h4>
                        <span className="text-slate-500 dark:text-zinc-400 text-[11px]">
                          {app.date}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-blue-600 dark:text-blue-400 border-blue-500/30">
                        {app.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================ */}
        {/* PILLAR 3: ARCADE (15-Game Developer Space)                        */}
        {/* ================================================================ */}
        {activePillar === "arcade" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                    <Gamepad2 className="w-6 h-6 text-blue-600" />
                    Developer Arcade: 15 Multi-Sensory Games
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                    Sharpen cognitive agility, syntax instincts, and algorithmic reflexes with Hand Gesture and Voice Sound controls.
                  </p>
                </div>

                <Badge
                  variant="outline"
                  className="hidden sm:inline-flex border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 text-xs font-mono"
                >
                  15 / 15 GAMES UNLOCKED
                </Badge>
              </div>
            </div>

            {/* 15 Games Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredGames.map((game) => (
                <div
                  key={game.id}
                  className="bg-white dark:bg-[#0a0a0a] border border-slate-200/90 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-blue-500/50 hover:shadow-md transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{game.icon}</span>
                      <div className="flex items-center gap-1.5">
                        {game.gesture && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 shadow-xs"
                            title="Webcam Hand Gesture Tracking Supported"
                          >
                            <Camera className="w-3 h-3" />
                            <span>✋ Hand Gesture</span>
                          </span>
                        )}
                        {game.sound && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 shadow-xs"
                            title="Microphone Pitch & Sound Control Supported"
                          >
                            <Mic className="w-3 h-3" />
                            <span>🎙️ Sound Control</span>
                          </span>
                        )}
                        {!game.gesture && !game.sound && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] font-mono"
                          >
                            {game.tag}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {game.title}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                      {game.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500">
                      High Score: 1,420 XP
                    </span>
                    <Button
                      onClick={() => toast.success(`Launching ${game.title}...`)}
                      className="bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white text-xs font-semibold rounded-xl px-4 py-1.5 cursor-pointer flex items-center gap-1.5"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Play Now</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
