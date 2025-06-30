import { fetchERC721CollectionHolders } from "./helpers/ERC721Holders"

(async function main() {
  try {
    await fetchERC721CollectionHolders();
    console.log("ERC721 Collection holders fetched successfully.");
  } catch (error) {
    console.error("Error fetching ERC721 Collection holders:", error);
  }
})()