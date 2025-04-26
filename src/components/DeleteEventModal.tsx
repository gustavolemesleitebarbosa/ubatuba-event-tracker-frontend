import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Event from "@/types/Event";
import { Trash2 } from "lucide-react";

interface DeleteEventModalProps {
  event: Event;
  onDelete: () => void;
}

export function DeleteEventModal({ event, onDelete }: DeleteEventModalProps) {
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <Dialog>
      <DialogTrigger onClick={(e) => e.stopPropagation()}  asChild>
        <Button variant="outline"className="bg-slate-100 rounded-full" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent  onClick={(e) => e.stopPropagation()} className="bg-slate-100 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Delete Event</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{event.title}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" className="bg-red-500" onClick={handleDelete}>
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}