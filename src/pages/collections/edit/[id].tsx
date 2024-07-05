import { CollectionModule } from "@/modules/collection/modules";
import { Collection } from "@/modules/collection/types";
import { CollectionEditScreen } from "@/screens/collections/edit";

export default CollectionEditScreen;

export async function getStaticPaths() {
  let res: any;
  let paths: Array<{ params: { id: string } }> = [];

  try {
    res = await CollectionModule.getList();
    if (res?.data?.collections) {
      paths = res.data.collections.map((v: Collection) => ({
        params: { id: v.collectionID ? v.collectionID.toString() : "" },
      }));
    }
  } catch (error) {
  }

  return { paths, fallback: true };
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