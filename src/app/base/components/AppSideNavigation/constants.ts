import composeNodeUrls from "../../../drut/compose-node/url";
import drutDashboardUrl from "../../../drut/dashboard/url";
import eventUrl from "../../../drut/events/url";
import managersUrls from "../../../drut/fabricManagement/url";
import nodesUrl from "../../../drut/nodes/url";
import resourceUrls from "../../../drut/resources/url";

import type { NavGroup } from "./types";

import urls from "app/base/urls";

const navGroups: NavGroup[] = [
  {
    groupTitle: "Hardware",
    groupIcon: "machines",
    navLinks: [
      {
        highlight: [urls.machines.index, urls.machines.machine.index(null)],
        label: "Machines",
        url: urls.machines.index,
      },
      {
        highlight: [urls.devices.index, urls.devices.device.index(null)],
        label: "Devices",
        url: urls.devices.index,
      },
      {
        adminOnly: true,
        highlight: [
          urls.controllers.index,
          urls.controllers.controller.index(null),
        ],
        label: "Controllers",
        url: urls.controllers.index,
      },
    ],
  },
  {
    groupTitle: "Fabric",
    groupIcon: "tag",
    navLinks: [
      {
        label: "Resources",
        url: resourceUrls.resources.index,
      },
      {
        label: "Nodes",
        url: nodesUrl.nodes.index,
      },
      {
        label: "Events",
        url: eventUrl.events.index,
      },
      {
        label: "Compose",
        url: composeNodeUrls.compose.index,
      },
      {
        label: "Fabric Management",
        url: managersUrls.fabricManagement.index,
      },
      {
        label: "DashBoard",
        url: drutDashboardUrl.dashboard.index,
      },
    ],
  },
  {
    groupTitle: "KVM",
    groupIcon: "cluster-light",
    navLinks: [
      {
        label: "LXD",
        url: urls.kvm.lxd.index,
      },
      {
        label: "Virsh",
        url: urls.kvm.virsh.index,
      },
    ],
  },
  {
    groupTitle: "Organisation",
    groupIcon: "tag",
    navLinks: [
      {
        highlight: [urls.tags.index, urls.tags.tag.index(null)],
        label: "Tags",
        url: urls.tags.index,
      },
      {
        highlight: [urls.zones.index, urls.zones.details(null)],
        label: "AZs",
        url: urls.zones.index,
      },
      {
        label: "Pools",
        url: urls.pools.index,
      },
    ],
  },
  {
    groupTitle: "Configuration",
    groupIcon: "units",
    navLinks: [
      {
        label: "Images",
        url: urls.images.index,
      },
    ],
  },
  {
    groupTitle: "Networking",
    groupIcon: "connected",
    navLinks: [
      {
        highlight: [
          urls.subnets.index,
          urls.subnets.subnet.index(null),
          urls.subnets.space.index(null),
          urls.subnets.fabric.index(null),
          urls.subnets.vlan.index(null),
        ],
        label: "Subnets",
        url: urls.subnets.index,
      },
      {
        highlight: [urls.domains.index, urls.domains.details(null)],
        label: "DNS",
        url: urls.domains.index,
      },
      {
        label: "Network discovery",
        url: urls.dashboard.index,
      },
    ],
  },
];

export { navGroups };
