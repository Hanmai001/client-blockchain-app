import { NftModule } from "@/modules/nft/modules";
import { NftDetailScreen } from "@/screens/nfts/nft-detail";

export default NftDetailScreen;

// export async function getStaticPaths() {
//   let res: any;
//   try {
//     res = await NftModule.getList();
//   } catch (error) {

//   } finally {
//     const paths = res.data.tokens.map((v: Nft) => ({
//       params: { id: v.collectionID ? v.tokenID.toString() : "" },
//     }));
//     return { paths, fallback: true };
//   }
// }

// export async function getStaticProps({ params }: { params: { id: string } }) {
//   const { id } = params;
//   const res = await NftModule.getNftByID(id);

//   return {
//     props: {
//       token: res.data
//     }
//   };
// } 

export const getServerSideProps = async ({
  params
}) => {
  let res: any;
  try {
    const { id } = params;
    res = await NftModule.getNftByID(id);
  } catch (error) {
    return {
      notFound: true
    }
  }

  if (!res.data) return {
    notFound: true
  }

  return {
    props: {
      token: res.data
    },
  };
}