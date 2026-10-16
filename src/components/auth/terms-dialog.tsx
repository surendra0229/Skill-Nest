"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TermsDialogProps {
  triggerText?: string;
  triggerClassName?: string;
}

/**
 * Interactive Terms & Conditions Dialog
 * Displays sample Skill Nest terms in a dark modal without triggering form resets or losing input.
 */
export function TermsDialog({
  triggerText = "Terms&conditions",
  triggerClassName = "underline underline-offset-2 text-zinc-400 hover:text-white cursor-pointer transition-colors inline",
}: TermsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={triggerClassName}
        >
          {triggerText}
        </button>
      </DialogTrigger>

      <DialogContent className="bg-[#0d0d0d] border border-zinc-800 text-zinc-200 max-w-lg rounded-2xl p-6 shadow-2xl">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg font-semibold text-white tracking-tight">
            Skill Nest Terms &amp; Conditions
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            Please review our platform guidelines and terms of service.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Container for Terms Content */}
        {/* TODO: Replace sample Terms & Conditions text here before production */}
        <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4 text-xs text-zinc-400 leading-relaxed custom-scrollbar">
          <section className="space-y-1">
            <h4 className="text-sm font-medium text-zinc-200">
              1. Acceptance of Terms
            </h4>
            <p>
              By creating an account, browsing, or accessing any interactive
              learning modules on Skill Nest, you acknowledge and agree to be
              bound by these Terms &amp; Conditions and all applicable laws and
              regulations.
            </p>
          </section>

          <section className="space-y-1">
            <h4 className="text-sm font-medium text-zinc-200">
              2. User Accounts &amp; Security
            </h4>
            <p>
              You are responsible for maintaining the confidentiality of your
              credentials, username, and password. Any actions executed through
              your authenticated account are your sole responsibility. Notify
              Skill Nest support immediately upon discovering unauthorized account
              activity.
            </p>
          </section>

          <section className="space-y-1">
            <h4 className="text-sm font-medium text-zinc-200">
              3. Code Execution &amp; Fair Usage
            </h4>
            <p>
              Skill Nest provides integrated sandboxed code execution
              environments for educational practice. You agree not to attempt to
              bypass sandbox limitations, initiate denial-of-service activities,
              mine cryptocurrency, or execute malicious binaries on platform
              infrastructure.
            </p>
          </section>

          <section className="space-y-1">
            <h4 className="text-sm font-medium text-zinc-200">
              4. Learning Content &amp; Intellectual Property
            </h4>
            <p>
              All problem sets, roadmaps, documentation, and design assets hosted
              on Skill Nest are protected by intellectual property laws. You are
              granted a limited, non-exclusive license to consume content for
              personal career preparation and educational purposes.
            </p>
          </section>

          <section className="space-y-1">
            <h4 className="text-sm font-medium text-zinc-200">
              5. Privacy &amp; Data Handling
            </h4>
            <p>
              Your data is processed in accordance with our Privacy Policy. We
              encrypt password credentials using industry-standard hashing
              algorithms and utilize secure PostgreSQL storage on Supabase Cloud.
            </p>
          </section>
        </div>

        <DialogFooter className="pt-2">
          <DialogClose asChild>
            <Button
              type="button"
              className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-medium px-4 py-2 border border-zinc-700"
            >
              I Understand
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
