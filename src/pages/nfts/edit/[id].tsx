import { NftModule } from "@/modules/nft/modules";
import { Nft } from "@/modules/nft/types";
import { NftEditScreen } from "@/screens/nfts/edit";

export default NftEditScreen;

export async function getStaticPaths() {
  let res: any;
  try {
    res = await NftModule.getList();
  } catch (error) {

  } finally {
    const paths = res.data.tokens.map((v: Nft) => ({
      params: { id: v.collectionID ? v.tokenID.toString() : "" },
    }));
    return { paths, fallback: true };
  }
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const { id } = params;
  const res = await NftModule.getNftByID(id);

  return {
    props: {
      token: res.data
    }
  };
} 