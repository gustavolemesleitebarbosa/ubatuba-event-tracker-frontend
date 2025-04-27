import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Upload } from "lucide-react";
import Event from "@/types/Event";
import { useState, useRef } from "react";
import { createEventSchema } from "@/schemas/event.schema";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { EVENT_CATEGORIES } from "@/constants/categories";
import { ColorRing } from "react-loader-spinner";

interface CreateEventModalProps {
  onCreate: (newEvent: Omit<Event, "id">) => void;
  creating?: boolean;
}

export function CreateEventModal({
  onCreate,
  creating = false,
}: CreateEventModalProps) {
  const [formData, setFormData] = useState<Omit<Event, "id">>({
    title: "",
    description: "",
    location: "",
    date: new Date().toISOString().slice(0, 16),
    image: "",
    category: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      date: new Date().toISOString().slice(0, 16),
      image: "",
      category: null,
    });
    setSelectedImage(null);
    setPreviewUrl("");
    setErrors({});
  };

  const validateForm = () => {
    try {
      createEventSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = () => {
    if (validateForm()) {
      onCreate(formData);
      setFormData({
        title: "",
        description: "",
        location: "",
        date: new Date().toISOString().slice(0, 16),
        image: "",
        category: null,
      });
      resetForm();
    }
  };

  const isFormFilled = () => {
    return (
      formData.title.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.location.trim() !== "" &&
      formData.date.trim() !== ""
    );
  };

  return (
    <Dialog onOpenChange={(open) => !open && resetForm()}>
      <DialogTrigger asChild>
        <Button
          className="fixed top-4 z-20 right-4 bg-slate-300 rounded-full"
          variant="outline"
          size="lg"
          disabled={creating}
        >
          {creating ? (
            <>
              <ColorRing
                visible={true}
                height="50"
                width="50"
                ariaLabel="color-ring-loading"
                colors={["#0ff22d", "#0ff22d", "#0ff22d", "#849b87", "#849b87"]}
              />
              <p>Creating...</p>
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-100 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{"Create new event"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className={errors.location ? "border-red-500" : ""}
            />
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="datetime-local"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className={errors.date ? "border-red-500" : ""}
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category || undefined}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger
                className={errors.category ? "border-red-500" : ""}
              >
                <span>{formData.category || "Select a category"}</span>
              </SelectTrigger>
              <SelectContent>
                {EVENT_CATEGORIES.map((category) => (
                  <SelectItem
                    className="bg-slate-100 border-slate-300 border-b-[1px]"
                    key={category}
                    value={category}
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">Event Image</Label>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              {selectedImage ? "Change Image" : "Upload Image"}
            </Button>
            {previewUrl && (
              <div className="mt-2">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="bg-green-200"
              disabled={!isFormFilled()}
              onClick={handleCreate}
            >
              Create
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
