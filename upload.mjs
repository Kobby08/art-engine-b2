import { filesFromPath } from "files-from-path";
import { NFTStorage } from "nft.storage";
import path from "path";
import { update_image_info } from "./utils/custom/update_image_info.js";
import { update_metadata_info } from "./utils/custom/update_metadata_info.js";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEQxNzhDZTJFNDM3NjBhRjk1OThjRjcxNDZkMUEzMTg0NzllQTZhMjAiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MDk0Nzg1Mjg2MCwibmFtZSI6InRlc3QgcHJvamVjdCJ9.6seE0R3Q_S2L6d-noLxgvxAklc9enpvKfP2nNtb3o24";

async function uploadToIPFS() {
  try {
    console.log("Uploading images to IPFS....");
    let image_cid = await uploadAsset("build/images");
    update_image_info(image_cid);

    console.log("Uploading metadata to IPFS....");
    let metadata_cid = await uploadAsset("build/json");
    update_metadata_info(metadata_cid);
  } catch (error) {
    console.log("Could not upload to IPFS", error);
  }
}

async function uploadAsset(directory) {
  const directoryPath = directory;
  const files = filesFromPath(directoryPath, {
    pathPrefix: path.resolve(directoryPath), // see the note about pathPrefix below
    hidden: true, // use the default of false if you want to ignore files that start with '.'
  });

  const storage = new NFTStorage({ token });

  console.log(`storing file(s) from ${path}`);
  const cid = await storage.storeDirectory(files);
  console.log({ cid });

  const status = await storage.status(cid);
  console.log(status);
  return cid;
}
uploadToIPFS();
