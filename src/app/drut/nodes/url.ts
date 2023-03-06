import { argPath } from "app/utils";
export type Node = { id: string };

const urls = {
  nodes: {
    index: "/drut-cdi/nodes",
    nodeDetails: argPath<{ id: Node["id"] }>("/drut-cdi/nodes/:id"),
    summary: argPath<{ id: Node["id"] }>("/drut-cdi/nodes/:id/summary"),
    resourceBlocks: argPath<{ id: Node["id"] }>(
      "/drut-cdi/nodes/:id/resourceblocks"
    ),
    datapaths: argPath<{ id: Node["id"] }>("/drut-cdi/nodes/:id/datapaths"),
    logs: argPath<{ id: Node["id"] }>("/drut-cdi/nodes/:id/logs"),
  },
};

export default urls;
