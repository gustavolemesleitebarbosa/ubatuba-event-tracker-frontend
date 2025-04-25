import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import "./App.css";
import { DeleteEventModal } from "./components/DeleteEventModal";
import { EditEventModal } from "./components/EditEventModal";
import Event from "./types/Event";
import { CreateEventModal } from "./components/CreateEventModal";
import toast, { Toaster } from "react-hot-toast";
function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}`);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEdit = async (updatedEvent: Event) => {
    await fetch(`${import.meta.env.VITE_BASE_URL}${updatedEvent.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedEvent),
    });
    await fetchEvents();
    toast.success("Event updated successfully!");
  };

  const handleDelete = async (eventToDelete: Event) => {
    await fetch(`${import.meta.env.VITE_BASE_URL}${eventToDelete.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    setLoading(true);
    await fetchEvents();
    setLoading(false);
    toast.success("Event deleted successfully!");
  };

  const handleCreate = async (newEvent: Omit<Event, "id">) => {
    await fetch(`${import.meta.env.VITE_BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvent),
    });
    setLoading(true);
    await fetchEvents();
    setLoading(false);
    toast.success("Event created successfully!");
  };

  if (loading) return <div>Loading events...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Toaster />
      <div className="h-full w-full bg-blue-300 p-12">
        <h1
          style={{ fontFamily: "'Baloo 2', sans-serif" }}
          className="text-2xl font-bold mb-4 mt-2"
        >
          Próximos Eventos em Ubatuba{" "}
        </h1>
        <div className="h-screen w-full container mx-4 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CreateEventModal onCreate={handleCreate} />
          {events.map((event, index) => (
            <Card
              key={index}
              className="min-h-80 bg-slate-100 overflow-hidden pt-0"
            >
              <div className="w-full">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-24 lg:h-44 object-cover"
                />
                <div className="bg-black w-full h-[1.5px]"></div>
              </div>
              <CardHeader>
                <CardTitle className="font-bold">{event.title}</CardTitle>
                {/* <CardDescription className="text-gray-600">
                {new Date(event.date).toLocaleDateString()}
              </CardDescription> */}
              </CardHeader>
              <CardContent className="text-gray-800 flex flex-col items-start">
                <p>{event.description}</p>
                <p className="mt-2 text-sm text-gray-600">
                  {" "}
                  Local: <b>{event.location}</b>{" "}
                </p>
                <div className="w-full justify-end mt-3 ml-auto flex gap-3">
                  <EditEventModal event={event} onSave={handleEdit} />
                  <DeleteEventModal
                    event={event}
                    onDelete={() => handleDelete(event)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
