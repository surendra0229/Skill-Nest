"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenTool,
  Bot,
  X,
  Circle,
  Eraser,
  RotateCcw,
  Sparkles,
  Send,
  Copy,
  Check,
  Trash2,
  FileText,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface FloatingWidgetsProps {
  aiQuota?: {
    limit: number;
    remaining: number;
    used: number;
  };
  isAdmin?: boolean;
}

type JamTool = "pen" | "node" | "eraser";

interface TreeNode {
  id: string;
  x: number;
  y: number;
  value: string;
  color: string;
}

export function FloatingWidgets({
  aiQuota = { limit: 25, remaining: 25, used: 0 },
  isAdmin = false,
}: FloatingWidgetsProps) {
  // --------------------------------------------------------------------------
  // Floating JAM Board Box State
  // --------------------------------------------------------------------------
  const [isJamOpen, setIsJamOpen] = useState(false);
  const [jamTab, setJamTab] = useState<"canvas" | "notes">("canvas");
  const [activeTool, setActiveTool] = useState<JamTool>("pen");
  const [selectedColor, setSelectedColor] = useState("#2563eb");
  const [nodeValueInput, setNodeValueInput] = useState("A");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Revision Notes State
  const [revisionNotes, setRevisionNotes] = useState("");
  const [notesCopied, setNotesCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("skillnest_revision_notes");
    if (saved) {
      setRevisionNotes(saved);
    }
  }, []);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setRevisionNotes(text);
    localStorage.setItem("skillnest_revision_notes", text);
  };

  const handleCopyNotes = () => {
    if (!revisionNotes) return;
    navigator.clipboard.writeText(revisionNotes);
    setNotesCopied(true);
    toast.success("Revision notes copied to clipboard!");
    setTimeout(() => setNotesCopied(false), 2000);
  };

  const handleClearNotes = () => {
    setRevisionNotes("");
    localStorage.removeItem("skillnest_revision_notes");
    toast.info("Revision notes cleared.");
  };

  // Canvas Initializer & Resize
  useEffect(() => {
    if (!isJamOpen || jamTab !== "canvas") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fill initial subtle background
    if (!canvas.getAttribute("data-initialized")) {
      ctx.fillStyle = document.documentElement.classList.contains("dark")
        ? "#0d0d0d"
        : "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      canvas.setAttribute("data-initialized", "true");
    }
  }, [isJamOpen, jamTab]);

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (activeTool === "node") {
      // Draw DSA Circle Node with Value
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, 2 * Math.PI);
      ctx.fillStyle = selectedColor;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();

      // Node label
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(nodeValueInput || "•", x, y);

      // Auto-increment node letter for convenience: A -> B -> C ...
      if (nodeValueInput.length === 1 && nodeValueInput >= "A" && nodeValueInput < "Z") {
        setNodeValueInput(String.fromCharCode(nodeValueInput.charCodeAt(0) + 1));
      } else if (!isNaN(Number(nodeValueInput))) {
        setNodeValueInput(String(Number(nodeValueInput) + 1));
      }
      return;
    }

    isDrawingRef.current = true;
    lastPosRef.current = { x, y };
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || activeTool === "node") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(x, y);

    if (activeTool === "eraser") {
      const isDark = document.documentElement.classList.contains("dark");
      ctx.strokeStyle = isDark ? "#0d0d0d" : "#ffffff";
      ctx.lineWidth = 14;
      ctx.lineCap = "round";
    } else {
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
    }

    ctx.stroke();
    lastPosRef.current = { x, y };
  };

  const handleCanvasMouseUp = () => {
    isDrawingRef.current = false;
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const isDark = document.documentElement.classList.contains("dark");
    ctx.fillStyle = isDark ? "#0d0d0d" : "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    toast.info("JAM Canvas reset.");
  };

  // --------------------------------------------------------------------------
  // Floating AI Tutor Box State
  // --------------------------------------------------------------------------
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<
    Array<{ sender: "ai" | "user"; text: string }>
  >([
    {
      sender: "ai",
      text: "👋 Hi! I'm your Skill Nest AI Tutor. Ask me any DSA problem, code bug, algorithm proof, or LaTeX resume query.",
    },
  ]);
  const [aiInput, setAiInput] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [remainingQuota, setRemainingQuota] = useState(aiQuota.remaining);

  const handleSendAi = (preset?: string) => {
    const text = preset || aiInput;
    if (!text.trim() || isAiThinking) return;

    if (!isAdmin && remainingQuota <= 0) {
      toast.error(
        "Hourly AI Tutor rate limit reached (25/hr). Please wait for window reset."
      );
      return;
    }

    const userMessage = { sender: "user" as const, text: text.trim() };
    setAiMessages((prev) => [...prev, userMessage]);
    if (!preset) setAiInput("");

    if (!isAdmin) {
      setRemainingQuota((prev) => Math.max(0, prev - 1));
    }

    setIsAiThinking(true);

    setTimeout(() => {
      let response =
        "Excellent question! When approaching algorithmic targets, first establish bounds on time complexity O(N) and auxiliary space O(1). What input constraints are given?";
      const lower = text.toLowerCase();

      if (lower.includes("two sum") || lower.includes("hashmap")) {
        response =
          "For Two Sum: Instead of O(N²) brute force, maintain a Hash Map `seen = {}`. For each element `num`, check if `target - num` exists. If so, return indices. Runtime is O(N) with O(N) space!";
      } else if (lower.includes("two pointer") || lower.includes("pointer")) {
        response =
          "Two-Pointer Technique: Initialize `left = 0` and `right = arr.length - 1`. If `sum < target`, advance `left++`. If `sum > target`, decrement `right--`. Requires a sorted array!";
      } else if (lower.includes("tree") || lower.includes("dsa") || lower.includes("graph")) {
        response =
          "Tip: You can use the JAM Board button on the bottom-left to visually draw tree nodes, recursive call stacks, and BFS/DFS levels!";
      } else if (lower.includes("resume") || lower.includes("latex") || lower.includes("ats")) {
        response =
          "LaTeX resumes bypass ATS parsing traps because they generate pure, predictable font streams without hidden columns. Head over to the 'LaTeX Resume Lab' sub-tab to compile in real-time!";
      }

      setAiMessages((prev) => [...prev, { sender: "ai", text: response }]);
      setIsAiThinking(false);
    }, 800);
  };

  return (
    <>
      {/* ================================================================== */}
      {/* 1. FLOATING JAM BOARD: Bottom-Left Trigger & Compact Floating Box  */}
      {/* ================================================================== */}

      {/* Floating Trigger Button (fixed bottom-6 left-6 z-50) */}
      <button
        type="button"
        onClick={() => setIsJamOpen(!isJamOpen)}
        className="fixed bottom-6 left-6 z-50 bg-slate-900 dark:bg-zinc-900 text-white border border-slate-700 dark:border-zinc-700 shadow-xl px-4 py-2.5 rounded-full flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        title="Open Compact Floating JAM Board"
      >
        <PenTool className="w-4 h-4 text-blue-400" />
        <span className="text-xs font-bold tracking-wider">JAM</span>
      </button>

      {/* Small Floating Box (w-[360px] sm:w-[400px] h-[430px]) */}
      <AnimatePresence>
        {isJamOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed bottom-20 left-6 z-50 w-[360px] sm:w-[400px] h-[430px] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-zinc-100"
          >
            {/* Header with Sub-Tabs */}
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/60">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setJamTab("canvas")}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    jamTab === "canvas"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Draw DSA / Trees
                </button>
                <button
                  type="button"
                  onClick={() => setJamTab("notes")}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    jamTab === "notes"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Revision Notes
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsJamOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab 1: Draw DSA / Trees */}
            {jamTab === "canvas" && (
              <div className="flex-1 flex flex-col p-2.5">
                {/* Toolbar */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-zinc-800 text-xs">
                  {/* Tool selection */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setActiveTool("pen")}
                      className={`p-1.5 rounded-md text-xs cursor-pointer ${
                        activeTool === "pen"
                          ? "bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 font-bold"
                          : "text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                      }`}
                      title="Freehand Pen"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTool("node")}
                      className={`px-2 py-1 rounded-md text-xs flex items-center gap-1 cursor-pointer ${
                        activeTool === "node"
                          ? "bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 font-bold"
                          : "text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                      }`}
                      title="Stamp DSA Tree/Graph Node"
                    >
                      <Circle className="w-3.5 h-3.5" />
                      <span>Node ({nodeValueInput})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTool("eraser")}
                      className={`p-1.5 rounded-md text-xs cursor-pointer ${
                        activeTool === "eraser"
                          ? "bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 font-bold"
                          : "text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                      }`}
                      title="Eraser"
                    >
                      <Eraser className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Colors & Reset */}
                  <div className="flex items-center gap-1.5">
                    {["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"].map(
                      (c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setSelectedColor(c)}
                          style={{ backgroundColor: c }}
                          className={`w-3.5 h-3.5 rounded-full cursor-pointer transition-transform ${
                            selectedColor === c
                              ? "ring-2 ring-offset-1 ring-blue-500 scale-125"
                              : "hover:scale-110"
                          }`}
                        />
                      )
                    )}
                    <button
                      type="button"
                      onClick={handleClearCanvas}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors ml-1 cursor-pointer"
                      title="Clear canvas"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* HTML5 Canvas */}
                <div className="flex-1 rounded-xl border border-slate-200 dark:border-zinc-800 overflow-hidden relative bg-white dark:bg-[#0d0d0d]">
                  <canvas
                    ref={canvasRef}
                    width={380}
                    height={300}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                    className="w-full h-full cursor-crosshair"
                  />
                  {activeTool === "node" && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-md pointer-events-none">
                      Click to place node: {nodeValueInput}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Revision Notes */}
            {jamTab === "notes" && (
              <div className="flex-1 flex flex-col p-3">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-zinc-800 text-xs">
                  <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                    Auto-saved to your browser.
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyNotes}
                      className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                    >
                      {notesCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleClearNotes}
                      className="text-slate-400 hover:text-red-500 cursor-pointer"
                      title="Clear Notes"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <textarea
                  value={revisionNotes}
                  onChange={handleNotesChange}
                  placeholder="Jot down algorithmic insights, edge cases (e.g. empty array, duplicate keys), or interview reminders here..."
                  className="flex-1 w-full bg-slate-50/50 dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800 rounded-xl p-3 text-xs leading-relaxed text-slate-900 dark:text-zinc-100 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================================== */}
      {/* 2. FLOATING AI TUTOR: Bottom-Right Trigger & Compact Floating Box */}
      {/* ================================================================== */}

      {/* Floating Trigger Button (fixed bottom-6 right-6 z-50) */}
      <button
        type="button"
        onClick={() => setIsAiOpen(!isAiOpen)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
        title="Open Floating AI Tutor"
      >
        <Bot className="w-5 h-5" />
      </button>

      {/* Small Floating Chat Box (w-[360px] sm:w-[390px] h-[440px]) */}
      <AnimatePresence>
        {isAiOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed bottom-20 right-6 z-50 w-[360px] sm:w-[390px] h-[440px] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-zinc-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/60">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                    Skill Nest AI Tutor
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400">
                    {isAdmin
                      ? "Admin Mode: Unlimited messages"
                      : `${remainingQuota} / 25 messages left this hour`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAiOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Preset quick chips */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 overflow-x-auto border-b border-slate-100 dark:border-zinc-800/80 bg-slate-50/40 dark:bg-black/30">
              {[
                "Two Sum Hashmap",
                "Sliding Window formula",
                "LaTeX vs Word",
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleSendAi(chip)}
                  className="whitespace-nowrap px-2 py-0.5 text-[10px] rounded-full bg-slate-200/60 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
              {aiMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-xs ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-xs"
                        : "bg-slate-100 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 rounded-bl-xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAiThinking && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 text-xs rounded-2xl px-3 py-2 rounded-bl-xs flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-blue-500 animate-spin" />
                    <span>AI Tutor is drafting solution...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendAi();
              }}
              className="p-2.5 border-t border-slate-200 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-900/40 flex items-center gap-2"
            >
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ask about DSA, LaTeX, or code..."
                className="flex-1 bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!aiInput.trim() || isAiThinking}
                className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
