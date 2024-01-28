import { AppWrapper } from "@/components/app/app-wrapper";
import { BoundaryConnectWallet } from "@/components/boundary-connect-wallet";
import { ActionIcon, AspectRatio, Avatar, Group, Skeleton, Stack, Text, rem, useMantineTheme } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { ListLoadState } from "../../../types";
import { NftModule } from "@/modules/nft/modules";
import { getChainId } from "@/share/blockchain/context";
import { EmptyMessage } from "@/components/empty-message";
import { useAccount } from "@/modules/account/context";
import { UserModule } from "@/modules/user/modules";
import { UserInformation } from "@/modules/user/types";
import { DateTimeUtils, StringUtils } from "@/share/utils";

export const FriendsScreen: FC = () => {
  const [items, setItems] = useState<ListLoadState<any, 'tokens'>>({ isFetching: true, data: { tokens: [], count: 0 } });
  const [users, setUsers] = useState<UserInformation[]>([]);
  const theme = useMantineTheme();
  const account = useAccount();
  
  const fetchItems = async () => {
    try {
      const listItems = await NftModule.getList({chainID: getChainId()});
      setItems(s => ({ ...s, isFetching: false, data: { tokens: listItems.data!.tokens || [], count: listItems.data!.count || 0 } }));
    } catch (error) {
      setItems(s => ({ ...s, isFetching: false, data: { tokens: [], count: 0 } }))
      // onError(error);
      throw error
    }
  }

  const getUserOfNft = async (wallet: string) => {
    const user = await UserModule.getByWallet(wallet);
    return user;
  }

  const fetchUsers = async () => {
    setUsers([]);
    const userPromises = items.data?.tokens.map(async (v, k) => {
      const user = await getUserOfNft(v.owner);
      return user;
    });

    const usersResult = await Promise.all(userPromises);
    setUsers(usersResult);
  };


  const handleContextMenu = (event: any) => {
    event.preventDefault();
  };

  useEffect(() => {
    fetchItems();
  }, [account.information])

  useEffect(() => {
    fetchUsers();
  }, [items.data?.tokens])

  return <AppWrapper>
    <BoundaryConnectWallet>
      {function() {
        if (items.isFetching || !items.data?.tokens) return <Skeleton height='100%' width='100%'/>

        if (items.data.count === 0) return <EmptyMessage />

        return <>
          {items.data?.tokens.map((v, k) => <Group key={k}>
            <AspectRatio ratio={100 / 160} style={{
              overflow: 'hidden',
              borderRadius: theme.radius.md,
              width: rem(400)
            }}>
              <video
                controls
                controlsList="nodownload"
                // crossOrigin="use-credentials"
                preload="auto"
                src={v.source}
                onContextMenu={handleContextMenu}
              />
            </AspectRatio>
            
            {function() {
              if (users.length === 0) return <Skeleton />

              console.log(users)
              return <Stack>
                <Group align="flex-start" justify="space-between">
                  <Group align="flex-start">
                    <Avatar w={64} h={64} src={users[k].avatar || '/images/default/avatar.png'} />
                    <Stack gap={0}>
                      <Text fw={500} c={theme.colors.text[1]}>{users[k].username}</Text>

                      <Text size="14px" c="dimmed">Tạo vào {DateTimeUtils.formatToShow(users[k].createdAt)}</Text>
                    </Stack>
                  </Group>

                  <Group gap={0}>
                    <Text size="14px" c="dimmed">{StringUtils.compact(users[k].wallet, 8, 5)}</Text>
                    <ActionIcon
                      c={theme.colors.gray[7]}
                      variant="transparent"
                    // onClick={() => clipboard.copy(users[k].wallet)}
                    >
                      {/* {clipboard.copied ? <IconCopyCheck size={20} stroke={1.5} /> : <IconCopy size={20} stroke={1.5} />} */}
                    </ActionIcon>
                  </Group>
                </Group>
              </Stack>
            }()}
          </Group>)}
        </>
      }()}
    </BoundaryConnectWallet>
  </AppWrapper>
}

