import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import "./App.css";
import { DeleteEventModal } from "./components/DeleteEventModal";
import { EditEventModal } from "./components/EditEventModal";
import Event from "./types/Event";

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchEvents = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEdit = async (updatedEvent: Event) => {
    await fetch(`${import.meta.env.VITE_BASE_URL}${updatedEvent.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedEvent),
    })
    await fetchEvents();  
  };

  const  handleDelete = async (eventToDelete: Event) => {
    await fetch(`${import.meta.env.VITE_BASE_URL}${eventToDelete.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    await fetchEvents();  
  };

  if (loading) return <div>Loading events...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-gray-600 container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((event, index) => (
        <Card key={index} className="overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-48 object-cover"
          />
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{event.title}</CardTitle>
              <div className="flex gap-2">
                <EditEventModal event={event} onSave={handleEdit} />
                <DeleteEventModal event={event} onDelete={() => handleDelete(event)} />
              </div>
            </div>
            <CardDescription>
              {new Date(event.date).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>{event.description}</p>
            <p className="mt-2 text-sm text-gray-600">{event.location}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default App;
