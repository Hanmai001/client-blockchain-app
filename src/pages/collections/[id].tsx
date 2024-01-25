import { CollectionModule } from "@/modules/collection/modules";
import { Collection } from "@/modules/collection/types";
import { CollectionDetailScreen } from "@/screens/collections/collection-detail";

export default CollectionDetailScreen;

export async function getStaticPaths() {
  let res: any;
  try {
    res = await CollectionModule.getList();
  } catch (error) {

  } finally {
    const paths = res.data.collections.map((v: Collection) => ({
      params: { id: v.collectionID ? v.collectionID.toString() : "" },
    }));
    return { paths, fallback: true };
  }
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const { id } = params;
  const res = await CollectionModule.getCollectionByID(id);

  return {
    props: {
      collection: res.data
    }
  };
} 