import { useAccount } from "@/modules/account/context";
import { useMantineTheme } from "@mantine/core";
import { useParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { DataLoadState } from "../../../../types";

const nftTest = {
  tokenId: '1',
  _id: '1',
  creator: 'dsfdsf',
  tokenUri: 'dsfdsf',
  collectionId: "1",
  contractAddress: "0x6AaEF57A890743E6322Feb3275E4006b3Ecb8cb5",
  owner: '0x6AaEF57A890743E6322Feb3275E4006b3Ecb8cb5',
  chainId: '97',
  title: 'Cậu học trò chứng minh bài học vật lý',
  description: "The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣 The cat fought and fell into the water🤣🤣",
  source: "https://www.youtube.com/watch?v=g20t_K9dlhU&list=RDzENVcKkqZWg&index=27",
  totalViews: 0,
  totalLikes: 0,
  totalShare: 0,
  totalFavourite: 0,
  createdAt: '21/11/2023',
  updatedAt: '21/11/2023'
}

export const NftEditScreen: FC = () => {
  const theme = useMantineTheme();
  const params = useParams<{ id: string }>();
  const account = useAccount();
  const [nft, setNft] = useState<DataLoadState<any>>({ isFetching: false, data: nftTest })
  
  return (
    <>

    </>
  )
}