import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function UsernameModal({ isOpen, onSubmit, onClose, loading, description }: {
  isOpen: boolean;
  onSubmit: (username: string) => void;
  onClose: () => void;
  loading?: boolean;
  description?: string;
}) {
  const [username, setUsername] = useState("");
  const desc = description || "Enter your username to personalize your profile.";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-describedby="username-modal-desc">
        <DialogHeader>
          <DialogTitle>Set Your Username</DialogTitle>
        </DialogHeader>
        <div id="username-modal-desc" className="space-y-4">
          <div className="text-gray-400 text-sm mb-2">{desc}</div>
          <Input
            placeholder="Enter a username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={loading}
          />
          <Button
            onClick={() => onSubmit(username)}
            disabled={!username || loading}
            className="w-full"
          >
            {loading ? "Saving..." : "Save Username"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 