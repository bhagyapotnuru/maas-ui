import { argPath } from "app/utils";
export type Resources = { id: string };

const urls = {
  resources: {
    add: "resources/add",
    index: "/drut-cdi/resources",
    resourceDetails: argPath<{ id: Resources["id"] }>(
      "/drut-cdi/resources/:id"
    ),
  },
};

export default urls;
