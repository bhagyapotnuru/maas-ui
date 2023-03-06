import computeBlock1 from "../../../../../../assets/compute_block1.json";
import computeBlock2 from "../../../../../../assets/compute_block2.json";
import computeBlock3 from "../../../../../../assets/compute_block3.json";
import computeBlock4 from "../../../../../../assets/compute_block4.json";
import networkBlock1 from "../../../../../../assets/network_block1.json";
import networkBlock2 from "../../../../../../assets/network_block2.json";
import networkBlock3 from "../../../../../../assets/network_block3.json";
import networkBlock4 from "../../../../../../assets/network_block4.json";
import networkBlock5 from "../../../../../../assets/network_block5.json";
import computeBlock5 from "../../../../../../assets/compute_block5.json";
import offloadBlock1 from "../../../../../../assets/offload_block1.json";
import offloadBlock2 from "../../../../../../assets/offload_block2.json";
import offloadBlock3 from "../../../../../../assets/offload_block3.json";
import offloadBlock4 from "../../../../../../assets/offload_block4.json";
import offloadBlock5 from "../../../../../../assets/offload_block5.json";
import storageBlock1 from "../../../../../../assets/storage_block1.json";
import storageBlock2 from "../../../../../../assets/storage_block2.json";
import storageBlock3 from "../../../../../../assets/storage_block3.json";
import storageBlock4 from "../../../../../../assets/storage_block4.json";
import storageBlock5 from "../../../../../../assets/storage_block5.json";

function getResourceInfo(id) {
  if (id === "OffloadBlock-1") {
    return offloadBlock1;
  } else if (id === "OffloadBlock-2") {
    return offloadBlock2;
  } else if (id === "OffloadBlock-3") {
    return offloadBlock3;
  } else if (id === "OffloadBlock-4") {
    return offloadBlock4;
  } else if (id === "OffloadBlock-5") {
    return offloadBlock5;
  } else if (id === "ComputeBlock-1") {
    return computeBlock1;
  } else if (id === "ComputeBlock-2") {
    return computeBlock2;
  } else if (id === "ComputeBlock-3") {
    return computeBlock3;
  } else if (id === "ComputeBlock-4") {
    return computeBlock4;
  } else if (id === "ComputeBlock-5") {
    return computeBlock5;
  } else if (id === "NetworkBlock-1") {
    return networkBlock1;
  } else if (id === "NetworkBlock-2") {
    return networkBlock2;
  } else if (id === "NetworkBlock-3") {
    return networkBlock3;
  } else if (id === "NetworkBlock-4") {
    return networkBlock4;
  } else if (id === "NetworkBlock-5") {
    return networkBlock5;
  } else if (id === "StorageBlock-1") {
    return storageBlock1;
  } else if (id === "StorageBlock-2") {
    return storageBlock2;
  } else if (id === "StorageBlock-3") {
    return storageBlock3;
  } else if (id === "StorageBlock-4") {
    return storageBlock4;
  } else if (id === "StorageBlock-5") {
    return storageBlock5;
  } else {
    return {};
  }
}

export { getResourceInfo };
