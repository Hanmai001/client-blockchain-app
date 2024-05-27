import { Nft } from "@/modules/nft/types";
import { ActionIcon, Button, Divider, Group, Modal, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { FC, useState } from "react";
import { onError } from "./modal-error";
import { ReportModule } from "@/modules/report/modules";
import { useAccount } from "@/modules/account/context";
import { ReportStatus } from "@/modules/report/types";
import { AppButton } from "../app/app-button";

interface State {
  title?: string
  message?: string,
  nft: Nft
}
interface ReportCategory {
  title: string;
  content?: string;
  links?: { title: string, content: string }[];
}

export let onReport = (state: State) => { };
export const ModalReport: FC = () => {
  const theme = useMantineTheme();
  const [opened, { open, close }] = useDisclosure(false)
  const [state, setState] = useState<State>()
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | null>(null);
  const account = useAccount();

  const reports = [
    {
      title: "Bạo lực",
      content: "Nội dung bạo lực có thể gây tổn hại nghiêm trọng đến tinh thần và sức khỏe của người xem.",
      links: [
        {
          title: "Có chứa hình ảnh bạo lực",
          content: "Chúng tôi không cho phép những video có nội dung xúi giục, đe dọa, hoặc có tác động vật lý gây hại tới người khác."
        },
        {
          title: "Ngược đãi động vật",
          content: "Chúng tôi không cho phép nội dung có hành vi bạo hành hoặc đối xử tàn nhẫn với động vật dưới bất kỳ hình thức nào."
        },
        {
          title: "Các vấn đề khác",
          content: "Nếu bạn gặp phải nội dung bạo lực không thuộc các mục trên, vui lòng báo cáo chi tiết để chúng tôi xử lý."
        }
      ]
    },
    {
      title: "Ngôn từ quấy rối và thù ghét",
      content: "Nội dung có ngôn từ quấy rối, đe dọa hoặc kích động thù ghét nhằm vào bất kỳ cá nhân hoặc nhóm nào dựa trên chủng tộc, tôn giáo, giới tính, hoặc các đặc điểm khác sẽ bị nghiêm cấm."
    },
    {
      title: "Tự tử và tự gây thương tích",
      content: "Chúng tôi không cho phép nội dung khuyến khích hoặc mô tả chi tiết hành động tự tử hoặc tự gây thương tích, vì có thể gây ảnh hưởng xấu đến người xem và xã hội."
    },
    {
      title: "Có những hành động nguy hiểm",
      content: "Nội dung mô tả hoặc khuyến khích các hành động nguy hiểm có thể gây hại đến bản thân hoặc người khác không được phép xuất hiện trên nền tảng của chúng tôi."
    },
    {
      title: "Thông tin sai sự thật, gây hoang mang dư luận",
      content: "Chúng tôi nghiêm cấm việc lan truyền thông tin sai sự thật có thể gây hoang mang, sợ hãi hoặc hiểu lầm trong cộng đồng.",
      links: [
        {
          title: "Sức khỏe",
          content: "Thông tin sai lệch về sức khỏe có thể gây hại nghiêm trọng đến cộng đồng. Chúng tôi không cho phép nội dung sai sự thật về các bệnh tật, phương pháp điều trị hoặc các thông tin y tế khác."
        },
        {
          title: "Chính trị",
          content: "Thông tin sai lệch về chính trị có thể gây ra sự hoang mang và chia rẽ trong xã hội. Chúng tôi không cho phép nội dung xuyên tạc hoặc giả mạo các sự kiện chính trị."
        },
        {
          title: "Vấn đề xã hội",
          content: "Thông tin sai lệch về các vấn đề xã hội có thể ảnh hưởng tiêu cực đến nhận thức và hành động của cộng đồng. Chúng tôi không cho phép nội dung bóp méo sự thật về các vấn đề xã hội quan trọng."
        },
        {
          title: "Các vấn đề khác",
          content: "Nếu bạn gặp phải thông tin sai sự thật không thuộc các mục trên, vui lòng báo cáo chi tiết để chúng tôi xử lý."
        }
      ]
    },
    {
      title: "Chia sẻ thông tin cá nhân",
      content: "Chúng tôi nghiêm cấm hành vi chia sẻ thông tin cá nhân mà không có sự đồng ý của người liên quan, nhằm bảo vệ quyền riêng tư và an toàn của người dùng."
    },
    {
      title: "Giả mạo",
      content: "Nội dung giả mạo có thể gây hiểu lầm nghiêm trọng và làm tổn hại đến uy tín của cá nhân hoặc tổ chức.",
      links: [
        {
          title: "Người khác",
          content: "Chúng tôi không cho phép nội dung giả mạo danh tính của người khác, bao gồm nhưng không giới hạn ở việc sử dụng tên, hình ảnh hoặc thông tin cá nhân mà không có sự đồng ý."
        },
        {
          title: "Tổ chức/Doanh nghiệp",
          content: "Chúng tôi không cho phép nội dung giả mạo các tổ chức hoặc doanh nghiệp, bao gồm nhưng không giới hạn ở việc sử dụng tên, logo, hoặc thông tin của tổ chức mà không có sự đồng ý."
        }
      ]
    },
    {
      title: "Khủng bố",
      content: "Chúng tôi nghiêm cấm nội dung liên quan đến khủng bố, bao gồm nhưng không giới hạn ở việc thúc đẩy, ủng hộ, hoặc ca ngợi các hoạt động khủng bố."
    }
  ]

  onReport = (s) => {
    setState(s)
    open()
  }

  const handleCategoryClick = (category: ReportCategory) => {
    setSelectedCategory(category);
  };

  const handleBackClick = () => {
    setSelectedCategory(null);
  };

  const submitReport = async () => {
    try {
      if (!state?.nft || !account.information) return;

      await ReportModule.create({
        tokenID: state.nft.tokenID,
        from: account.information.wallet || "",
        description: selectedCategory?.title + ': ' + selectedCategory?.content,
        owner: state.nft.owner,
        status: ReportStatus.ISPENDING
      })
      close();
    } catch (error) {
      onError(error);
    }
  }

  return (
    <Modal opened={opened} onClose={close} size='lg' title={selectedCategory ? <Group gap='xs'>
      <ActionIcon
        variant="subtle"
        onClick={handleBackClick}
        size='lg'
      >
        <IconChevronLeft />
      </ActionIcon>
      <Title order={3} fw={500} c={theme.colors.text[1]}>Trở lại</Title>
    </Group> : <Title order={3} fw={500} c={theme.colors.text[1]}>Báo cáo</Title>} styles={{
      overlay: {
        zIndex: 100
      },
      body: {
        padding: '0'
      }
    }}>
      <Divider />
      <Stack my={15}>
        {!selectedCategory && (
          <>
            <Text size="14px" ml={20}>Vui lòng chọn vấn đề</Text>
            {reports.map((report, index) => (
              <Button
                key={index}
                justify="space-between"
                variant="subtle"
                onClick={() => handleCategoryClick(report)}
                fullWidth
                size="md"
                h={45}
                rightSection={<IconChevronRight color={theme.colors.primary[5]} />}
              >
                {report.title}
              </Button>
            ))}
          </>
        )}
        {selectedCategory && (
          <>
            {selectedCategory.links ? (
              <>
                <Text size="14px" ml={20}>Vui lòng chọn vấn đề</Text>
                {selectedCategory.links.map((link, index) => (
                  <Button
                    key={index}
                    justify="space-between"
                    onClick={() => handleCategoryClick(link)}
                    variant="subtle"
                    fullWidth
                    size="md"
                    h={45}
                    rightSection={<IconChevronRight color={theme.colors.primary[5]} />}
                  >
                    {link.title}
                  </Button>
                ))}
              </>
            ) : (
              <Stack mx={20}>
                <Title order={3} fw={500} c={theme.colors.text[1]}>{selectedCategory.title}</Title>
                <Text>{selectedCategory.content}</Text>
                <AppButton
                  async
                  onClick={submitReport}
                  color={theme.colors.primary[5]}
                  radius={8}
                  h={45}
                  fullWidth
                >
                  Gửi báo cáo
                </AppButton>
              </Stack>
            )
            }
          </>
        )}
      </Stack>
    </Modal >
  )
}