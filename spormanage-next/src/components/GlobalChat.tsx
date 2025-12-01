"use client";
import { useEffect, useState } from "react";
import ChatModal from "@/components/ChatModal";
import AssistantFab from "@/components/AssistantFab";

export default function GlobalChat() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("open-chat", onOpen as EventListener);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("open-chat", onOpen as EventListener);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("chat-open", open);
  }, [open]);

  return (
    <>
      <ChatModal open={open} onClose={() => setOpen(false)} />
      <AssistantFab onClick={() => setOpen(true)} />
    </>
  );
}

