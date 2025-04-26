import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { DeleteEventModal } from "../components/DeleteEventModal";
import { EditEventModal } from "../components/EditEventModal";
import Event from "../types/Event";
import { CreateEventModal } from "../components/CreateEventModal";
import toast, { Toaster } from "react-hot-toast";
import { Input } from "../components/ui/input";
import { useNavigate } from "react-router-dom";
import { ThreeCircles } from "react-loader-spinner";

function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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

  if (events.length === 0)
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <h1 className="text-yellow-50 text-2xl font-bold">
          {" "}
          Nenhum evento encontrado para
        </h1>
      </div>
    );

  return (
    <>
      <Toaster />
      <div className="min-h-screen w-full bg-[##234683] p-12">
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
              className="bg-slate-600 font-bold mb-4 border-2 border-slate-200 mt-2 text-slate-100 pl-10 text-xs "
            />
          </div>
        </div>
        <div className="w-full container md:mx-4 md:p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CreateEventModal onCreate={handleCreate} />
          {filteredEvents.map((event) => (
            <Card
              key={event.id}
              onClick={() => navigate(`/event/${event.id}`)}
              className="min-h-80 relative bg-slate-300 overflow-hidden pt-0"
            >
              <div className="w-full">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-24 lg:h-44 object-cover"
                  />
                ) : (
                  <img
                    src="/src/assets/placeholder.png"
                    alt="Event placeholder"
                    className="w-full h-24 lg:h-44"
                  />
                )}
                <div className="bg-black w-full h-[1.5px]"></div>
              </div>
              <CardHeader>
                <CardTitle className="font-bold">
                  {event.title}
                  {event.category}
                  <br />
                  {new Date(event.date).toLocaleDateString("pt-BR")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-800 flex flex-col items-start">
                <p className="mt-2 text-sm text-gray-600">
                  {" "}
                  Local: <b>{event.location}</b>{" "}
                </p>
                <p className="text-sm text-gray-900 overflow-hidden whitespace-nowrap text-ellipsis max-w-full">
                  {event.description}
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
