import { UserModule } from "@/modules/user/modules";
import { UserInformation } from "@/modules/user/types";
import { UserProfileScreen } from "@/screens/users/profile/user-profile";

export default UserProfileScreen;

export async function getStaticPaths() {
  let res: any;
  let paths: Array<{ params: { id: string } }> = [];

  try {
    res = await UserModule.getListUsers();
    if (res?.data?.users) {
      paths = res.data.users.map((v: UserInformation) => ({
        params: { id: v.wallet ? v.wallet.toString() : "" },
      }));
    }
  } catch (error) {
  }

  return { paths, fallback: true };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const { id } = params;
  let user: UserInformation | null = null;

  try {
    const res = await UserModule.getByWallet(id);
    user = res;
  } catch (error) {
  }

  return {
    props: {
      user,
    },
  };
}
