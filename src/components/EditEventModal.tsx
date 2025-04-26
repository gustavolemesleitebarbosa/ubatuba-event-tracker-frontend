import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil } from "lucide-react"
import Event from "@/types/Event"
import { useState, useEffect } from "react"
import { createEventSchema } from "@/schemas/event.schema"
import { z } from "zod"

interface EditEventModalProps {
  event: Event;
  onSave: (updatedEvent: Event) => void;
}

export function EditEventModal({ event, onSave }: EditEventModalProps) {
  const [formData, setFormData] = useState(event);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    try {
      createEventSchema.parse(formData);
      setIsValid(true);
      setErrors({});
    } catch (error) {
      setIsValid(false);
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  }, [formData]);

  const handleSave = () => {
    if (isValid) {
      onSave(formData);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-slate-100 rounded-full" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-100 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input 
              id="description" 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location" 
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className={errors.location ? "border-red-500" : ""}
            />
            {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input 
              id="date" 
              type="datetime-local" 
              value={new Date(formData.date).toISOString().slice(0, 16)}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className={errors.date ? "border-red-500" : ""}
            />
            {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            onClick={handleSave}
            disabled={!isValid}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 