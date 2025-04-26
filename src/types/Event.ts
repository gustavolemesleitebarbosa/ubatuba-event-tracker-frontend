
interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  category?: string | null;
  image?: string;
}

export default Event;