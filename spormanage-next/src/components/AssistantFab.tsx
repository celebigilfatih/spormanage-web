"use client";

export default function AssistantFab({ onClick }: { onClick: () => void }) {
  return (
    <button className="btn btn-primary assist-fab" onClick={onClick}>Asistan</button>
  );
}

