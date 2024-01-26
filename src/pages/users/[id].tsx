import { UserModule } from "@/modules/user/modules";
import { UserInformation } from "@/modules/user/types";
import { UserProfileScreen } from "@/screens/users/profile/user-profile";

export default UserProfileScreen;

export async function getStaticPaths() {
  let res: any;
  try {
    res = await UserModule.getListUsers();
  } catch (error) {

  } finally {
    const paths = res.data.users.map((v: UserInformation) => ({
      params: { id: v.wallet ? v.wallet.toString() : "" },
    }));
    return { paths, fallback: true };
  }
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const { id } = params;
  const res = await UserModule.getByWallet(id);

  return {
    props: {
      user: res
    }
  };
} 