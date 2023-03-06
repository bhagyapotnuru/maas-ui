import { argPath } from "app/utils";
export type Events = { id: string };

const urls = {
  events: {
    index: "/drut-cdi/dfab-events",
    eventDetails: argPath<{ id: Events["id"] }>("/drut-cdi/dfab-events/:id"),
  },
};

export default urls;
