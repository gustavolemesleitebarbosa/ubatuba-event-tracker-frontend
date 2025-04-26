import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Event } from "../schemas/event.schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { MagnifyingGlass, ThreeCircles } from "react-loader-spinner";

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvent = async (id: string) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch event");
        }
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchEvent(id);
    }
  }, [id]);

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-screen w-full">
        <h1 className="text-yellow-50 text-2xl font-bold mb-6">
          Carregando evento!
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
        <h1 className="text-yellow-50 text-2xl font-bold">Erro: {error}</h1>
      </div>
    );
  if (!event)
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <h1 className="text-yellow-50 text-2xl font-bold">
          Evento não encontrado
        </h1>
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-[#234683] p-6 md:p-12">
      <Button
        onClick={() => navigate("/")}
        variant="outline"
        className="mb-6 bg-slate-100"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Events
      </Button>

      <Card className="max-w-4xl pt-0 mx-auto bg-slate-300">
        <div className="w-full">
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-48 md:h-96 object-cover rounded-t-lg"
            />
          ) : (
            <img
              src="/src/assets/placeholder.png"
              alt="Event placeholder"
              className="w-full h-48 md:h-96 object-cover rounded-t-lg"
            />
          )}
          <div className="bg-black w-full h-[1.5px]"></div>
        </div>

        <CardHeader>
          <CardTitle className="text-2xl md:text-4xl font-bold">
            {event.title}
          </CardTitle>
          <p className="text-lg font-semibold text-gray-700">
            {new Date(event.date).toLocaleDateString("pt-BR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Location</h2>
            <p className="text-gray-700">{event.location}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EventDetail;
