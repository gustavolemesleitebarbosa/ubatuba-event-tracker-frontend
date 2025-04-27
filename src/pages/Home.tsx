import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { DeleteEventModal } from "../components/DeleteEventModal";
import { EditEventModal } from "../components/EditEventModal";
import Event from "../types/Event";
import { CreateEventModal } from "../components/CreateEventModal";
import toast, { Toaster } from "react-hot-toast";
import { Input } from "../components/ui/input";
import { useNavigate } from "react-router-dom";
import { ThreeCircles } from "react-loader-spinner";
import { CategoryColors, EventCategory } from "@/constants/categories";
import { Img } from "react-image";
import { getAuthHeaders } from "../utils/api";
import { useAuth } from "@/contexts/AuthContext";

function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [updatingEventId, setUpdatingEventId] = useState<string | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}events`);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      const sortedEvents = data.sort((a: Event, b: Event) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateA - dateB;
      });
      setEvents(sortedEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (search.length > 0) {
      const filteredEvents = events.filter(
        (event) =>
          event.title.toLowerCase().includes(search.toLowerCase()) ||
          event.location.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredEvents(filteredEvents);
    } else {
      setFilteredEvents(events);
    }
  }, [events, search]);

  const handleEdit = async (updatedEvent: Event) => {
    setUpdatingEventId(updatedEvent.id);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}events/${updatedEvent.id}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(updatedEvent),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      await fetchEvents();
      toast.success("Event updated successfully!");
    } catch {
      toast.error("Failed to update event");
    } finally {
      setUpdatingEventId(null);
    }
  };

  const handleDelete = async (eventToDelete: Event) => {
    setDeletingEventId(eventToDelete.id);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}events/${eventToDelete.id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      await fetchEvents();
      toast.success("Event deleted successfully!");
    } catch {
      toast.error("Failed to delete event");
    } finally {
      setDeletingEventId(null);
    }
  };

  const handleCreate = async (newEvent: Omit<Event, "id">) => {
    setCreating(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}events`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      await fetchEvents();
      toast.success("Event created successfully!");
    } catch {
      toast.error("Failed to create event");
    } finally {
      setCreating(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-screen w-full">
        <h1 className="text-yellow-50 text-2xl mb-6 font-bold">
          Carregando eventos em Ubatuba!
        </h1>
        <ThreeCircles
          visible={true}
          height="100"
          width="100"
          color="#06f3bc"
          ariaLabel="three-circles-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <h1 className="text-yellow-50 text-2xl font-bold">Error: {error}</h1>
      </div>
    );

  return (
    <>
      <Toaster />
      <div className="min-h-screen w-full bg-gradient-to-r from-[#251ee9]  to-[#3b70c4] p-12">
        <img
          src="/images/logo_header.png"
          alt="logo"
          className="w-1/3 md:w-1/6 mx-auto mb-4 "
        />
        <h1
          style={{ fontFamily: "'Original Surfer', cursive", fontWeight: 900 }}
          className="md:text-3xl text-md  flex justify-center font-bold mb-4 md:mt-2 mt-5 text-yellow-50"
        >
          🌊 Próximos Eventos em Ubatuba 🌊
        </h1>
        <div className="md:mx-4 md:p-4 ">
          <div className="relative">
            <Search
              onClick={() => searchRef.current?.focus()}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500"
            />
            <Input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar Evento ou Local"
              className="bg-slate-100 font-bold mb-4 border-2 border-slate-200 mt-2 text-slate-800 pl-10 text-xs "
            />
          </div>
        </div>
        <div className="w-full container cursor-pointer md:mx-4 md:p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CreateEventModal creating={creating} onCreate={handleCreate} />
          {filteredEvents.map((event) => (
            <Card
              key={event.id}
              onClick={() => navigate(`/event/${event.id}`)}
              className={`min-h-60 relative bg-slate-300 overflow-hidden pt-0 ${
                deletingEventId === event.id || updatingEventId === event.id
                  ? "pointer-events-none opacity-65"
                  : ""
              }`}
            >
              <div className="w-full">
                {event.image ? (
                  <Img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-24 lg:h-44 object-cover"
                  />
                ) : (
                  <Img
                    src="/images/placeholder.png"
                    alt="Event placeholder"
                    className="w-full h-24 lg:h-44"
                  />
                )}
                <div className="bg-black w-full h-[1.5px]"></div>
              </div>

              <CardContent className="text-gray-800 space-y-1">
                <div className="flex items-center gap-4">
                  <CardTitle className="w-[60%] md:w-[80%] text-md overflow-hidden whitespace-nowrap text-ellipsis  break-words  md:text-2xl font-bold">
                    {event.title}
                  </CardTitle>
                  {event.category && (
                    <span
                      className={`px-4 py-1.5 text-sm md:text-lg rounded-full text-white ${
                        CategoryColors[event.category as EventCategory]
                      }`}
                    >
                      {event.category}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-md pt-6 text-gray-600">
                  {" "}
                  <b>
                    {" "}
                    {new Date(event.date).toLocaleDateString("pt-BR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </b>{" "}
                </p>
                <p className="mt-2 text-sm pt-6 text-gray-600">
                  {" "}
                  Local: <b>{event.location}</b>{" "}
                </p>
                <p className="text-sm text-gray-900 overflow-hidden whitespace-nowrap text-ellipsis max-w-full">
                  {event.description}
                </p>
                {isAuthenticated && (
                  <div className="w-full pt-3  justify-end ml-auto flex gap-3">
                    <EditEventModal
                      event={event}
                      onSave={handleEdit}
                      updating={updatingEventId === event.id}
                    />
                    <DeleteEventModal
                      event={event}
                      onDelete={() => handleDelete(event)}
                      deleting={deletingEventId === event.id}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        {filteredEvents.length === 0 && (
          <div className="flex justify-center items-center w-full">
            <h1 className="text-yellow-50 text-2xl font-bold">
              {" "}
              Nenhum evento encontrado para esta busca 😢
            </h1>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
