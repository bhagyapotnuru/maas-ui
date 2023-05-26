import type {
  ComputerSystem,
  NetworkInterface,
  Processor,
  StorageElement,
} from "./ResourceBlock";

export type ResourceTypes = {
  Processors: Processor[];
  Storage: StorageElement[];
  ComputerSystems: ComputerSystem[];
  NetworkInterfaces: NetworkInterface[];
};
