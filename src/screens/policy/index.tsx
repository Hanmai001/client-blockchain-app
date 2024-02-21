import { AppFooter } from "@/components/app/app-footer";
import { AppHeader } from "@/components/app/app-header";
import { AppTitle } from "@/components/app/app-title";
import { Box, List, Stack, Title, useMantineTheme, Text } from "@mantine/core";
import { FC } from "react";

export const PolicyScreen: FC = () => {
  const theme = useMantineTheme();

  return <>
    <AppTitle title="Chính sách và điều khoản" />
    <AppHeader />

    <Stack my={90} align="center">
      <Title order={2} c='red'>Chính sách và Điều khoản</Title>

      <Box w='80%'>
        <List type="ordered" styles={{
          item: {
            fontSize: '18px',
            color: 'red',
            fontWeight: 500,
            marginBottom: '20px'
          }
        }}>
          <List.Item>Chính sách cho thuê - thuê NFT:
            <List listStyleType="disc" styles={{
              item: {
                fontSize: '15px',
                color: theme.colors.text[1],
                fontWeight: 'normal',
                marginBottom: '10px'
              }
            }}>
              <List.Item>
                Người sở hữu NFT có quyền đăng cho thuê NFT với giá tiền mong muốn được tính theo ngày, và cho phép số lượng người thuê tối đa N (ít nhất là 1 và nhiều nhất là 10 để hệ thống có thể dễ dàng quản lý). Ngoài ra, người sở hữu NFT phải lựa chọn một trong 2 quyền sử dụng cho thuê gồm: chỉ cho phép người thuê xem hoặc cho phép người thuê xem và tải về.
              </List.Item>
              <List.Item>
                Tại một thời điểm, chỉ có N người được phép đang thuê NFT, hệ thống sẽ hiển thị thời gian sắp hết hạn gần nhất để người dùng khác có thể xem xét để quyết định có đợi thuê hay không.
              </List.Item>
              <List.Item>
                Người thuê có thể cài đặt khoảng thời gian muốn thuê được tính theo ngày (giờ bắt đầu một ngày là 00:00 và được thuê tối đa 14 ngày để tránh giam giữ NFT của chủ sở hữu quá lâu và cho những người muốn thuê khác) và phải thanh toán toàn bộ số tiền thuê cho khoảng thời gian trên cho người sở hữu NFT khi xác nhận muốn thuê NFT của chủ sở hữu. Số tiền cần phải thanh toán cho chủ sở hữu được tính như sau: giá tiền * số ngày.
              </List.Item>
              <List.Item>
                Trường hợp người sở hữu NFT không muốn cho thuê nữa thì hệ thống phải kiểm tra xem có đang còn người thuê NFT của chủ sở hữu đó nữa không, nếu còn thì không cho phép người sở hữu NFT hủy, không còn thì được quyền hủy để tránh gây ra những bất lợi không mong muốn cho người đang thuê.
              </List.Item>
              <List.Item>
                Trường hợp người thuê muốn hủy trước thời hạn bản thân đã cài đặt thì sẽ không được hoàn tiền và việc thuê của người thuê đó sẽ kết thúc.
              </List.Item>
            </List>
          </List.Item>

          <List.Item>Chính sách mua - bán quyền sở hửu NFT:
            <List listStyleType="disc" styles={{
              item: {
                fontSize: '15px',
                color: theme.colors.text[1],
                fontWeight: 'normal',
                marginBottom: '10px'
              }
            }}>
              <List.Item>
                Người sở hữu NFT có quyền đăng bán NFT với giá tiền mong muốn.
              </List.Item>
              <List.Item>
                Người mua có thể mua NFT từ người sở hữu với giá tiền của người sở hữu đặt ra.
              </List.Item>
              <List.Item>
                Sau khi mua NFT từ chủ sở hữu thành công, quyền sở hữu NFT hoàn toàn thuộc về người mua.
              </List.Item>
            </List>
          </List.Item>
        </List>
      </Box>
    </Stack>

    <AppFooter />
  </>
}