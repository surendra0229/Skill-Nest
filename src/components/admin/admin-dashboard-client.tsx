"use client";

import React, { useState } from "react";
import {
  Users,
  BookOpen,
  Code2,
  Compass,
  ShieldAlert,
  Plus,
  Trash2,
  RefreshCw,
  ExternalLink,
  Shield,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Database,
  Lock,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  createLanguageNote,
  deleteLanguageNote,
  createDsaQuestion,
  deleteDsaQuestion,
  createCareerRoadmap,
  deleteCareerRoadmap,
  resetUserRateLimits,
  toggleUserRole,
  deleteUserAccount,
} from "@/actions/admin-actions";
import type {
  User,
  LanguageNote,
  DsaQuestion,
  CareerRoadmap,
} from "@/db/schema";

interface AdminDashboardClientProps {
  stats: {
    totalUsers: number;
    totalNotes: number;
    totalDsa: number;
    totalRoadmaps: number;
    totalRateLimitBlocks: number;
  };
  usersList: User[];
  notesList: LanguageNote[];
  dsaList: DsaQuestion[];
  roadmapsList: CareerRoadmap[];
}

export function AdminDashboardClient({
  stats,
  usersList,
  notesList,
  dsaList,
  roadmapsList,
}: AdminDashboardClientProps) {
  // Modal Open States
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isAddDsaOpen, setIsAddDsaOpen] = useState(false);
  const [isAddRoadmapOpen, setIsAddRoadmapOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State: Language Note
  const [noteForm, setNoteForm] = useState({
    language: "Python",
    title: "",
    category: "Fundamentals",
    useCases: "",
    codeExample: "",
    content: "",
  });

  // Form State: DSA Question
  const [dsaForm, setDsaForm] = useState<{
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    pattern: string;
    description: string;
    starterCode: string;
    testCases: string;
    leetcodeUrl: string;
  }>({
    title: "",
    difficulty: "Easy",
    pattern: "Arrays & Hashing",
    description: "",
    starterCode: "",
    testCases: "",
    leetcodeUrl: "",
  });

  // Form State: Career Roadmap
  const [roadmapForm, setRoadmapForm] = useState({
    roleTitle: "",
    estimatedDuration: "6 Months",
    skillsRequired: "",
    description: "",
  });

  // Handlers for Language Notes
  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteForm.title || !noteForm.content) {
      toast.error("Please fill in the title and content.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createLanguageNote(noteForm);
      if (res.success) {
        toast.success(`Note "${noteForm.title}" published!`);
        setIsAddNoteOpen(false);
        setNoteForm({
          language: "Python",
          title: "",
          category: "Fundamentals",
          useCases: "",
          codeExample: "",
          content: "",
        });
      } else {
        toast.error(res.error || "Failed to create note.");
      }
    } catch {
      toast.error("Error creating language note.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNote = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete note "${title}"?`)) return;
    try {
      const res = await deleteLanguageNote(id);
      if (res.success) {
        toast.success("Note deleted successfully.");
      } else {
        toast.error(res.error || "Failed to delete.");
      }
    } catch {
      toast.error("Error deleting note.");
    }
  };

  // Handlers for DSA Questions
  const handleCreateDsa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dsaForm.title || !dsaForm.description) {
      toast.error("Please fill in title and description.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createDsaQuestion(dsaForm);
      if (res.success) {
        toast.success(`DSA problem "${dsaForm.title}" added to sheet!`);
        setIsAddDsaOpen(false);
        setDsaForm({
          title: "",
          difficulty: "Easy",
          pattern: "Arrays & Hashing",
          description: "",
          starterCode: "",
          testCases: "",
          leetcodeUrl: "",
        });
      } else {
        toast.error(res.error || "Failed to create DSA problem.");
      }
    } catch {
      toast.error("Error creating DSA question.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDsa = async (id: string, title: string) => {
    if (!confirm(`Delete DSA question "${title}"?`)) return;
    try {
      const res = await deleteDsaQuestion(id);
      if (res.success) {
        toast.success("DSA problem removed.");
      } else {
        toast.error(res.error || "Failed to delete problem.");
      }
    } catch {
      toast.error("Error deleting DSA problem.");
    }
  };

  // Handlers for Career Roadmaps
  const handleCreateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roadmapForm.roleTitle || !roadmapForm.description) {
      toast.error("Please enter role title and description.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createCareerRoadmap(roadmapForm);
      if (res.success) {
        toast.success(`Career roadmap "${roadmapForm.roleTitle}" published!`);
        setIsAddRoadmapOpen(false);
        setRoadmapForm({
          roleTitle: "",
          estimatedDuration: "6 Months",
          skillsRequired: "",
          description: "",
        });
      } else {
        toast.error(res.error || "Failed to create roadmap.");
      }
    } catch {
      toast.error("Error creating career roadmap.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRoadmap = async (id: string, title: string) => {
    if (!confirm(`Delete roadmap "${title}"?`)) return;
    try {
      const res = await deleteCareerRoadmap(id);
      if (res.success) {
        toast.success("Roadmap deleted.");
      } else {
        toast.error(res.error || "Failed to delete roadmap.");
      }
    } catch {
      toast.error("Error deleting roadmap.");
    }
  };

  // Handlers for User Management
  const handleResetQuota = async (userId: string, email: string) => {
    try {
      const res = await resetUserRateLimits(userId);
      if (res.success) {
        toast.success(`Reset all API token quotas for ${email}`);
      } else {
        toast.error(res.error || "Failed to reset quotas.");
      }
    } catch {
      toast.error("Error resetting user quota.");
    }
  };

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (!confirm(`Change role to ${newRole.toUpperCase()}?`)) return;
    try {
      const res = await toggleUserRole(userId, newRole);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Error toggling role.");
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Permanently delete account for ${email}? This cannot be undone.`)) return;
    try {
      const res = await deleteUserAccount(userId);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Error deleting user.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Platform Overview & KPI Cards (Section 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Registered Users */}
        <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-medium">Total Users</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white my-2.5 tracking-tight">
            {stats.totalUsers}
          </p>
          <p className="text-[11px] text-zinc-500 font-mono">Platform Accounts</p>
        </div>

        {/* KPI 2: Language Notes */}
        <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-medium">Language Notes</span>
            <BookOpen className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-white my-2.5 tracking-tight">
            {stats.totalNotes}
          </p>
          <p className="text-[11px] text-zinc-500 font-mono">CMS Topic Guides</p>
        </div>

        {/* KPI 3: DSA Questions */}
        <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-medium">DSA Problems</span>
            <Code2 className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white my-2.5 tracking-tight">
            {stats.totalDsa}
          </p>
          <p className="text-[11px] text-zinc-500 font-mono">Pattern Exercises</p>
        </div>

        {/* KPI 4: Career Roadmaps */}
        <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-medium">Career Roadmaps</span>
            <Compass className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-bold text-white my-2.5 tracking-tight">
            {stats.totalRoadmaps}
          </p>
          <p className="text-[11px] text-zinc-500 font-mono">Curated Pathways</p>
        </div>

        {/* KPI 5: Rate Limit Blocks */}
        <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-medium">Rate-Limit Records</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-3xl font-bold text-white my-2.5 tracking-tight">
            {stats.totalRateLimitBlocks}
          </p>
          <p className="text-[11px] text-zinc-500 font-mono">Active Windows</p>
        </div>
      </div>

      {/* Admin Central Tabs Navigation */}
      <Tabs defaultValue="overview" className="w-full space-y-6">
        <TabsList className="bg-[#0e0e0e] border border-zinc-900 p-1 w-full justify-start overflow-x-auto h-auto flex flex-wrap gap-1">
          <TabsTrigger value="overview">1. Platform Overview</TabsTrigger>
          <TabsTrigger value="notes">2. Language Notes CMS</TabsTrigger>
          <TabsTrigger value="dsa">3. DSA Questions CMS</TabsTrigger>
          <TabsTrigger value="roadmaps">4. Career Roadmaps CMS</TabsTrigger>
          <TabsTrigger value="users">5. Users &amp; Rate Limits</TabsTrigger>
        </TabsList>

        {/* ------------------------------------------------------------------ */}
        {/* TAB 1: OVERVIEW & SYSTEM DIAGNOSTICS */}
        {/* ------------------------------------------------------------------ */}
        <TabsContent value="overview" className="space-y-6">
          <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-6">
            <h2 className="text-base font-semibold text-white mb-2">
              System Architecture &amp; Platform Status
            </h2>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
              Skill Nest runs on an isolated two-tier architecture: the student environment (/dashboard) is strictly rate-limited and focused on interactive learning, while this administrative CMS (/admin) governs global curriculum content, account permissions, and API safety.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#111111] border border-zinc-800/80 rounded-xl p-4">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium mb-1">
                  <Database className="w-4 h-4" />
                  <span>Database &amp; Storage</span>
                </div>
                <p className="text-sm font-semibold text-white">Supabase PostgreSQL</p>
                <p className="text-xs text-zinc-400 mt-1">
                  Direct pooled connection with Row Level Security (RLS) enabled on all tables.
                </p>
              </div>

              <div className="bg-[#111111] border border-zinc-800/80 rounded-xl p-4">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-medium mb-1">
                  <Lock className="w-4 h-4" />
                  <span>Authentication Engine</span>
                </div>
                <p className="text-sm font-semibold text-white">Auth.js v5 (NextAuth)</p>
                <p className="text-xs text-zinc-400 mt-1">
                  Secure HTTP-only cookie JWT strategy with 30-day session lifetime.
                </p>
              </div>

              <div className="bg-[#111111] border border-zinc-800/80 rounded-xl p-4">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-medium mb-1">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Rate Limiting Tier</span>
                </div>
                <p className="text-sm font-semibold text-white">Redis + Drizzle Fallback</p>
                <p className="text-xs text-zinc-400 mt-1">
                  Protects OpenAI ATS tokens, LaTeX compiler, Judge0 runners, and Room quotas.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ------------------------------------------------------------------ */}
        {/* TAB 2: LANGUAGE NOTES CMS */}
        {/* ------------------------------------------------------------------ */}
        <TabsContent value="notes" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">
                Manage Language Notes
              </h2>
              <p className="text-xs text-zinc-400">
                Content added here is dynamically displayed to students on the Language Notes page.
              </p>
            </div>

            {/* Add Language Note Modal */}
            <Dialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-9 gap-1.5 rounded-xl">
                  <Plus className="w-4 h-4" /> Add Language Note
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0d0d0d] border border-zinc-800 text-zinc-200 sm:max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl p-6">
                <DialogHeader>
                  <DialogTitle className="text-base font-semibold text-white">
                    Create New Language Note
                  </DialogTitle>
                  <DialogDescription className="text-xs text-zinc-400">
                    Publish syntax guides, concepts, and code snippets for student learning.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCreateNote} className="space-y-4 mt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400">Language</label>
                      <Select
                        value={noteForm.language}
                        onValueChange={(val) =>
                          setNoteForm({ ...noteForm, language: val })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Python">Python</SelectItem>
                          <SelectItem value="TypeScript">TypeScript</SelectItem>
                          <SelectItem value="JavaScript">JavaScript</SelectItem>
                          <SelectItem value="Java">Java</SelectItem>
                          <SelectItem value="C++">C++</SelectItem>
                          <SelectItem value="Rust">Rust</SelectItem>
                          <SelectItem value="Go">Go</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400">Category</label>
                      <Input
                        value={noteForm.category}
                        onChange={(e) =>
                          setNoteForm({ ...noteForm, category: e.target.value })
                        }
                        placeholder="e.g. Concurrency, OOP, Memory"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400">Topic Title</label>
                    <Input
                      value={noteForm.title}
                      onChange={(e) =>
                        setNoteForm({ ...noteForm, title: e.target.value })
                      }
                      placeholder="e.g. Pointers &amp; Memory Allocation"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400">Industry Use Cases</label>
                    <Input
                      value={noteForm.useCases}
                      onChange={(e) =>
                        setNoteForm({ ...noteForm, useCases: e.target.value })
                      }
                      placeholder="e.g. Embedded devices, high-throughput engines"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400">Code Example</label>
                    <Textarea
                      rows={3}
                      value={noteForm.codeExample}
                      onChange={(e) =>
                        setNoteForm({ ...noteForm, codeExample: e.target.value })
                      }
                      placeholder="Paste runnable snippet here..."
                      className="font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400">Detailed Content &amp; Explanation</label>
                    <Textarea
                      rows={5}
                      value={noteForm.content}
                      onChange={(e) =>
                        setNoteForm({ ...noteForm, content: e.target.value })
                      }
                      placeholder="Write thorough concept notes..."
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddNoteOpen(false)}
                      className="border-zinc-800 bg-zinc-900 text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs"
                    >
                      {isSubmitting ? "Publishing..." : "Publish Note"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Notes Table */}
          <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-28">Language</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="w-32">Category</TableHead>
                  <TableHead>Use Cases</TableHead>
                  <TableHead className="w-28 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notesList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-zinc-500">
                      No language notes found. Click &quot;Add Language Note&quot; to create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  notesList.map((note) => (
                    <TableRow key={note.id}>
                      <TableCell>
                        <Badge variant="outline" className="border-zinc-800 bg-zinc-900 text-zinc-300 font-mono text-[10px]">
                          {note.language}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-white">{note.title}</TableCell>
                      <TableCell className="text-zinc-400 text-xs">{note.category}</TableCell>
                      <TableCell className="text-zinc-500 text-xs truncate max-w-xs">{note.useCases}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteNote(note.id, note.title)}
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* ------------------------------------------------------------------ */}
        {/* TAB 3: DSA QUESTIONS CMS */}
        {/* ------------------------------------------------------------------ */}
        <TabsContent value="dsa" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">
                Manage DSA Questions Sheet
              </h2>
              <p className="text-xs text-zinc-400">
                Problems listed here feed the student LeetCode-style Practice Sheet and Judge0 IDE.
              </p>
            </div>

            {/* Add DSA Question Modal */}
            <Dialog open={isAddDsaOpen} onOpenChange={setIsAddDsaOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs h-9 gap-1.5 rounded-xl">
                  <Plus className="w-4 h-4" /> Add DSA Problem
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0d0d0d] border border-zinc-800 text-zinc-200 sm:max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl p-6">
                <DialogHeader>
                  <DialogTitle className="text-base font-semibold text-white">
                    Add Algorithm / DSA Problem
                  </DialogTitle>
                  <DialogDescription className="text-xs text-zinc-400">
                    Define problem pattern, difficulty, starter code, and test cases.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCreateDsa} className="space-y-4 mt-2">
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400">Problem Title</label>
                    <Input
                      value={dsaForm.title}
                      onChange={(e) =>
                        setDsaForm({ ...dsaForm, title: e.target.value })
                      }
                      placeholder="e.g. Reverse Nodes in k-Group"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400">Difficulty</label>
                      <Select
                        value={dsaForm.difficulty}
                        onValueChange={(val: "Easy" | "Medium" | "Hard") =>
                          setDsaForm({ ...dsaForm, difficulty: val })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Easy">Easy (Green)</SelectItem>
                          <SelectItem value="Medium">Medium (Yellow)</SelectItem>
                          <SelectItem value="Hard">Hard (Red)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400">Pattern</label>
                      <Input
                        value={dsaForm.pattern}
                        onChange={(e) =>
                          setDsaForm({ ...dsaForm, pattern: e.target.value })
                        }
                        placeholder="e.g. Two Pointers, Trees, DP"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400">LeetCode Reference URL</label>
                    <Input
                      value={dsaForm.leetcodeUrl}
                      onChange={(e) =>
                        setDsaForm({ ...dsaForm, leetcodeUrl: e.target.value })
                      }
                      placeholder="https://leetcode.com/problems/..."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400">Problem Description</label>
                    <Textarea
                      rows={4}
                      value={dsaForm.description}
                      onChange={(e) =>
                        setDsaForm({ ...dsaForm, description: e.target.value })
                      }
                      placeholder="Given an array of integers..."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400">Starter Code Template</label>
                    <Textarea
                      rows={3}
                      value={dsaForm.starterCode}
                      onChange={(e) =>
                        setDsaForm({ ...dsaForm, starterCode: e.target.value })
                      }
                      placeholder="function solution(params) { ... }"
                      className="font-mono text-xs"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddDsaOpen(false)}
                      className="border-zinc-800 bg-zinc-900 text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-purple-600 hover:bg-purple-500 text-white text-xs"
                    >
                      {isSubmitting ? "Adding..." : "Add Problem"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* DSA Questions Table */}
          <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Difficulty</TableHead>
                  <TableHead>Problem Title</TableHead>
                  <TableHead className="w-40">Pattern</TableHead>
                  <TableHead className="w-44">Reference Link</TableHead>
                  <TableHead className="w-20 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dsaList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-zinc-500">
                      No DSA questions configured yet. Click &quot;Add DSA Problem&quot; to populate.
                    </TableCell>
                  </TableRow>
                ) : (
                  dsaList.map((prob) => {
                    const badgeClass =
                      prob.difficulty === "Easy"
                        ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-400"
                        : prob.difficulty === "Medium"
                        ? "border-amber-500/40 bg-amber-950/40 text-amber-400"
                        : "border-red-500/40 bg-red-950/40 text-red-400";

                    return (
                      <TableRow key={prob.id}>
                        <TableCell>
                          <Badge variant="outline" className={`font-mono text-[10px] ${badgeClass}`}>
                            {prob.difficulty}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-white">{prob.title}</TableCell>
                        <TableCell className="text-zinc-400 text-xs">{prob.pattern}</TableCell>
                        <TableCell className="text-zinc-500 text-xs">
                          {prob.leetcodeUrl ? (
                            <a
                              href={prob.leetcodeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-400 hover:underline inline-flex items-center gap-1"
                            >
                              LeetCode <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteDsa(prob.id, prob.title)}
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* ------------------------------------------------------------------ */}
        {/* TAB 4: CAREER ROADMAPS CMS */}
        {/* ------------------------------------------------------------------ */}
        <TabsContent value="roadmaps" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">
                Manage Career Roadmaps
              </h2>
              <p className="text-xs text-zinc-400">
                Guide students with targeted skill checklists, timeline estimates, and role milestones.
              </p>
            </div>

            {/* Add Roadmap Modal */}
            <Dialog open={isAddRoadmapOpen} onOpenChange={setIsAddRoadmapOpen}>
              <DialogTrigger asChild>
                <Button className="bg-amber-600 hover:bg-amber-500 text-white text-xs h-9 gap-1.5 rounded-xl">
                  <Plus className="w-4 h-4" /> Add Career Roadmap
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0d0d0d] border border-zinc-800 text-zinc-200 sm:max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl p-6">
                <DialogHeader>
                  <DialogTitle className="text-base font-semibold text-white">
                    Publish Career Roadmap
                  </DialogTitle>
                  <DialogDescription className="text-xs text-zinc-400">
                    Define engineering specialization and milestone curriculum.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCreateRoadmap} className="space-y-4 mt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400">Target Role Title</label>
                      <Input
                        value={roadmapForm.roleTitle}
                        onChange={(e) =>
                          setRoadmapForm({ ...roadmapForm, roleTitle: e.target.value })
                        }
                        placeholder="e.g. Backend Go Engineer"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400">Estimated Duration</label>
                      <Input
                        value={roadmapForm.estimatedDuration}
                        onChange={(e) =>
                          setRoadmapForm({
                            ...roadmapForm,
                            estimatedDuration: e.target.value,
                          })
                        }
                        placeholder="e.g. 6 Months"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400">Skills &amp; Milestones Required</label>
                    <Textarea
                      rows={3}
                      value={roadmapForm.skillsRequired}
                      onChange={(e) =>
                        setRoadmapForm({
                          ...roadmapForm,
                          skillsRequired: e.target.value,
                        })
                      }
                      placeholder="e.g. Go syntax, gRPC, Docker, PostgreSQL indexing, Kubernetes..."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400">Pathway Description</label>
                    <Textarea
                      rows={4}
                      value={roadmapForm.description}
                      onChange={(e) =>
                        setRoadmapForm({
                          ...roadmapForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Provide an overview of this career track and daily responsibilities..."
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddRoadmapOpen(false)}
                      className="border-zinc-800 bg-zinc-900 text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-amber-600 hover:bg-amber-500 text-white text-xs"
                    >
                      {isSubmitting ? "Publishing..." : "Publish Roadmap"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Roadmaps Table */}
          <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-56">Role Title</TableHead>
                  <TableHead className="w-28">Duration</TableHead>
                  <TableHead>Key Skills &amp; Steps</TableHead>
                  <TableHead className="w-20 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roadmapsList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-zinc-500">
                      No career roadmaps created yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  roadmapsList.map((rm) => (
                    <TableRow key={rm.id}>
                      <TableCell className="font-semibold text-white">{rm.roleTitle}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-amber-500/30 bg-amber-950/20 text-amber-400 text-[10px] font-mono">
                          {rm.estimatedDuration}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-zinc-400 text-xs truncate max-w-md">{rm.skillsRequired}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteRoadmap(rm.id, rm.roleTitle)}
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* ------------------------------------------------------------------ */}
        {/* TAB 5: USERS & RATE LIMITS MANAGEMENT */}
        {/* ------------------------------------------------------------------ */}
        <TabsContent value="users" className="space-y-4">
          <div>
            <h2 className="text-base font-semibold text-white">
              Platform Accounts &amp; API Rate Limits
            </h2>
            <p className="text-xs text-zinc-400">
              Manage student roles, view DSA engagement, and reset API token quotas if blocked.
            </p>
          </div>

          <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User / Identity</TableHead>
                  <TableHead className="w-24">Role</TableHead>
                  <TableHead className="w-24 text-center">DSA</TableHead>
                  <TableHead className="w-24 text-center">ATS Checks</TableHead>
                  <TableHead className="w-32">Joined Date</TableHead>
                  <TableHead className="w-64 text-right">Administration Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersList.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-white text-xs">{user.name || "Anonymous User"}</p>
                        <p className="text-[11px] text-zinc-500 font-mono">{user.email}</p>
                        {user.username && (
                          <p className="text-[10px] text-zinc-600">@{user.username}</p>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.role === "admin"
                            ? "border-amber-500/40 bg-amber-950/30 text-amber-400 text-[10px] font-mono uppercase"
                            : "border-zinc-800 bg-zinc-900 text-zinc-400 text-[10px] font-mono uppercase"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center font-mono text-xs text-zinc-300">
                      {user.dsaSolved}
                    </TableCell>

                    <TableCell className="text-center font-mono text-xs text-zinc-300">
                      {user.atsChecksCount}
                    </TableCell>

                    <TableCell className="text-zinc-500 text-xs font-mono">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Reset API Quotas */}
                        <Button
                          size="sm"
                          variant="outline"
                          title="Clear rate-limit records for this user"
                          onClick={() => handleResetQuota(user.id, user.email)}
                          className="h-7 px-2 text-[11px] bg-zinc-900 border-zinc-800 text-blue-400 hover:text-blue-300 rounded-lg"
                        >
                          <RefreshCw className="w-3 h-3 mr-1" /> Reset Quota
                        </Button>

                        {/* Toggle Role */}
                        <Button
                          size="sm"
                          variant="outline"
                          title="Toggle between user and admin"
                          onClick={() => handleToggleRole(user.id, user.role)}
                          className="h-7 px-2 text-[11px] bg-zinc-900 border-zinc-800 text-amber-400 hover:text-amber-300 rounded-lg"
                        >
                          <Shield className="w-3 h-3 mr-1" />
                          {user.role === "admin" ? "Make User" : "Make Admin"}
                        </Button>

                        {/* Delete User */}
                        <Button
                          size="sm"
                          variant="ghost"
                          title="Delete user account"
                          onClick={() => handleDeleteUser(user.id, user.email)}
                          className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
