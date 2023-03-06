import { argPath } from "app/utils";
export type Health = { id: string };

const urls = {
  health: {
    index: "/drut-cdi/dfab-health",
    healthDetails: argPath<{ id: Health["id"] }>("/drut-cdi/dfab-health/:id"),
  },
};

export default urls;
