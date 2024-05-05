import { AppButton } from "@/components/app/app-button";
import { AppHeader } from "@/components/app/app-header";
import { AppLoading } from "@/components/app/app-loading";
import { BoundaryConnectWallet } from "@/components/boundary-connect-wallet";
import { MyCombobox } from "@/components/combobox/my-combobox";
import { MediaInput } from "@/components/input/media-input";
import { onError } from "@/components/modals/modal-error";
import { onSuccess } from "@/components/modals/modal-success";
import { useResponsive } from "@/modules/app/hooks";
import { renderPayment } from "@/modules/coins/utils";
import { CollectionModule } from "@/modules/collection/modules";
import { Collection, CollectionUpdatePayload } from "@/modules/collection/types";
import { RequestModule } from "@/modules/request/request";
import { chains } from "@/share/blockchain/chain";
import { Accordion, Anchor, Avatar, Box, Card, Checkbox, Group, NumberInput, Select, Stack, Switch, Tabs, Text, TextInput, Textarea, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEyeClosed, IconEyeFilled, IconPlus, IconStars } from "@tabler/icons-react";
import { FC, useEffect, useState } from "react";
import { AppPayment } from "../../../../types";
import classes from '../../../styles/collections/CollectionCreate.module.scss';

export const CollectionEditScreen: FC<{ collection: Collection }> = ({ collection }) => {
  const theme = useMantineTheme();
  const { isMobile } = useResponsive();
  const [bannerFile, setBannerFile] = useState<File | string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [checked, setChecked] = useState(collection.active);
  const [activeTab, setActiveTab] = useState<string | null>('info');
  const [selectedToken, setSelectedToken] = useState<AppPayment>(AppPayment.ETH);
  const [agreedPolicy, setAgreedPolicy] = useState(false);
  const [oldMetadata, setOldMetadata] = useState({
    title: collection.title,
    bannerURL: collection.bannerURL,
    description: collection.description,
    category: collection.category,
  })
  const payments = [
    { ...renderPayment(AppPayment.ETH), paymentType: AppPayment.ETH },
    { ...renderPayment(AppPayment.BCT), paymentType: AppPayment.BCT },
  ]
  enum CollectionType {
    TOURISM = 'Du lịch',
    GAME = 'Trò chơi',
    LIFE = 'Đời sống',
    EDUCATION = 'Giáo dục',
    FAMILY = 'Gia đình',
    FILM = 'Phim ảnh',
    COOK = 'Nấu ăn'
  }

  const formUpdate = useForm<CollectionUpdatePayload>({
    initialValues: {
      collectionID: collection.collectionID,
      contractAddress: collection.contractAddress,
      chainID: collection.chainID,
      title: collection.title,
      bannerURL: collection.bannerURL,
      description: collection.description,
      category: collection.category,
      active: collection.active,
    },
    validate: {
      title: (value) => (value && value.length < 1 && 'Tên bộ sưu tập không hợp lệ'),
      description: (value) => (value && value.length < 1 && 'Mô tả không hợp lệ'),
    },
  })

  const isMetadataChanged = () => {
    return (
      formUpdate.getInputProps('bannerURL').value !== oldMetadata.bannerURL ||
      formUpdate.getInputProps('description').value !== oldMetadata.description ||
      formUpdate.getInputProps('category').value !== oldMetadata.category ||
      formUpdate.getInputProps('title').value !== oldMetadata.title
    );
  };

  const onSubmitUpdate = formUpdate.onSubmit(async (values) => {
    try {
      setIsUploading(true);

      let payload = { ...values, active: checked };

      if (bannerFile instanceof File) {
        payload.bannerURL = await RequestModule.uploadMedia(`/api/v1/collections/image`, bannerFile as File, 400, "collectionImage");
        formUpdate.setFieldValue('bannerURL', payload.bannerURL);
      }
      
      const checkMetadataChanged = isMetadataChanged();
      const res = await CollectionModule.updateCollection(payload, checkMetadataChanged);
      collection = res;

      onSuccess({ title: 'Cập nhật thành công', message: '' });
    } catch (error) {
      onError("Cập nhật thất bại");
    } finally {
      setIsUploading(false);
    }
  })

  useEffect(() => {
    setBannerFile(collection.bannerURL);
  }, [collection])

  return (
    <BoundaryConnectWallet>
      <AppHeader />

      {isUploading && <AppLoading visible={isUploading} />}

      <Box px={40} mt={90}>
        <Card w={900} m='auto' withBorder radius={8} p={20}>
          <Tabs value={activeTab} onChange={setActiveTab} color={theme.colors.primary[5]} styles={{
            tabLabel: {
              fontSize: '16px',
              padding: '6px'
            }
          }}
            classNames={classes}
          >
            <Tabs.List>
              <Tabs.Tab value="info">
                Thông tin chung
              </Tabs.Tab>
              <Tabs.Tab value="listing">
                Giá đăng bán
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="info">
              <form onSubmit={onSubmitUpdate}>
                <Stack mt={20}>
                  <Switch
                    checked={checked}
                    onChange={(event) => setChecked(event.currentTarget.checked)}
                    onLabel={<IconEyeFilled size={18} />}
                    offLabel={<IconEyeClosed size={18} />}
                    size="lg"
                    label={checked ? "Ẩn" : "Hiện"}
                    color={theme.colors.primary[5]}
                    styles={{
                      label: {
                        fontSize: '14px',
                        fontWeight: 500
                      },
                      root: {
                        display: "inline-flex"
                      }
                    }}
                  />

                  <MediaInput
                    label="Hình nền"
                    withAsterisk
                    width={"100%"}
                    height={400}
                    ratio={260 / 150}
                    radius={10}
                    acceptance="image"
                    value={bannerFile || undefined}
                    onChange={(file) => setBannerFile(file)}
                    onRemove={() => setBannerFile(null)}
                    styles={{
                      label: {
                        marginBottom: "6px"
                      }
                    }}
                  />

                  <Group mt={20} grow>
                    <TextInput
                      label="Tên bộ sưu tập"
                      placeholder="My Collection"
                      withAsterisk
                      styles={{
                        root: {
                          width: '45%',
                        },
                        input: {
                          height: '45px',
                          borderRadius: '10px',
                          marginTop: "6px"
                        },
                      }}
                      {...formUpdate.getInputProps('title')}
                    />

                    <MyCombobox
                      initialvalue={CollectionType.TOURISM}
                      options={CollectionType}
                      label="Thể loại"
                      styles={{
                        dropdown: {
                          maxHeight: '200px',
                          overflow: 'hidden',
                          overflowY: 'auto',
                        },
                      }}
                      classNames={{
                        dropdown: 'hidden-scroll-bar'
                      }}
                      classnamesinput={classes.comboboxInput}
                      classnamesroot={classes.comboboxRootInput}
                      onChange={(value: CollectionType) => formUpdate.setFieldValue("category", value)}
                    />
                  </Group>

                  <Textarea
                    label="Mô tả"
                    withAsterisk
                    placeholder="Mô tả bộ sưu tập"
                    autosize
                    minRows={3}
                    styles={{
                      root: {
                        width: '100%',
                        borderRadius: '10px'
                      },
                      input: {
                        marginTop: '6px',
                        borderRadius: '10px'
                      }
                    }}
                    {...formUpdate.getInputProps('description')}
                  />

                  <Select
                    label="Blockchain"
                    disabled
                    placeholder="Chọn chain"
                    data={chains!.map((v) => ({ label: v.name, value: v.chainId }))}
                    styles={{
                      dropdown: {
                        maxHeight: '200px',
                        overflow: 'hidden',
                        overflowY: 'auto',
                      },
                      option: {

                      },
                      root: {
                        width: '100%'
                      },
                      input: {
                        height: '45px',
                        borderRadius: '10px',
                        marginTop: '6px'
                      }
                    }}
                    classNames={{
                      dropdown: 'hidden-scroll-bar'
                    }}
                    {...formUpdate.getInputProps('chainID')}
                  />

                  <Group justify="flex-end">
                    <AppButton async loading={isUploading} type='submit' width={150} height={54} radius={10} color={theme.colors.primary[5]}>
                      Cập nhật
                    </AppButton>
                  </Group>
                </Stack>
              </form>
            </Tabs.Panel>
            <Tabs.Panel value="listing">
              <Accordion
                mt={20}
                multiple
                variant="contained"
                defaultValue={['1']}
                chevron={<IconPlus className={classes.icon} />}
                radius={10}
                styles={{
                  item: {
                    margin: '8px 10px',
                    border: 'none',
                    borderBottom: `1px solid ${theme.colors.gray[3]}`,
                  },
                  control: {
                    color: theme.colors.primary[5],
                    padding: '5px 10px',
                  },
                  panel: {
                    borderTop: `1px solid ${theme.colors.gray[3]}`,
                    backgroundColor: theme.white,
                  },
                  root: {
                    //boxShadow: `0 1px 4px rgba(0, 0, 0, 0.1)`,
                    border: `1px solid ${theme.colors.gray[2]}`,
                    borderRadius: '8px'
                  }
                }}
                classNames={classes}
              >
                <Accordion.Item key="1" value="1">
                  <Accordion.Control icon={<IconStars />}>
                    Gói 30 ngày
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack>
                      <NumberInput
                        my={10}
                        label="Giá đăng kí"
                        placeholder="0.001"
                        withAsterisk
                        decimalScale={5}
                        allowNegative={false}
                        styles={{
                          root: {
                            width: '100%',
                          },
                          input: {
                            height: '45px',
                            borderRadius: '10px',
                            marginTop: "6px"
                          },
                        }}
                      />
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item key="2" value="2">
                  <Accordion.Control icon={<IconStars />}>
                    Gói 90 ngày
                  </Accordion.Control>
                  <Accordion.Panel>
                    <NumberInput
                      my={10}
                      label="Giá đăng kí"
                      placeholder="0.001"
                      withAsterisk
                      decimalScale={5}
                      allowNegative={false}
                      styles={{
                        root: {
                          width: '100%',
                        },
                        input: {
                          height: '45px',
                          borderRadius: '10px',
                          marginTop: "6px"
                        },
                      }}
                    />
                  </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item key="3" value="3">
                  <Accordion.Control icon={<IconStars />}>
                    Gói 1 năm
                  </Accordion.Control>
                  <Accordion.Panel>
                    <NumberInput
                      my={10}
                      label="Giá đăng kí"
                      placeholder="0.001"
                      withAsterisk
                      decimalScale={5}
                      allowNegative={false}
                      styles={{
                        root: {
                          width: '100%',
                        },
                        input: {
                          height: '45px',
                          borderRadius: '10px',
                          marginTop: "6px"
                        },
                      }}
                    />
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
              <Stack px={20} mt={20} gap={6}>
                <label style={{ display: 'block', fontWeight: 500, fontSize: '15px' }}>
                  Phương thức thanh toán
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <Group>
                  {payments.map((v, k) => <Card
                    withBorder
                    px={40}
                    py={20}
                    radius={8}
                    key={k}
                    onClick={() => setSelectedToken(v.paymentType)}
                    style={{
                      border: selectedToken === v.paymentType ? `1px solid ${theme.colors.primary[5]}` : '',
                      background: selectedToken === v.paymentType ? `${theme.colors.primary[5]}15` : '',
                      cursor: 'pointer'
                    }}>
                    <Stack align="center">
                      <Avatar src={v.image} w={48} h={48} />
                      <Text c={theme.colors.text[1]} fw={500}>{v.symbol}</Text>
                    </Stack>
                  </Card>)}
                </Group>
                <Checkbox
                  my={10}
                  label={
                    <>
                      Tôi đồng ý <Anchor href="/policy" target="_blank" inherit
                        style={{
                          textDecoration: 'underline',
                          color: 'blue'
                        }}
                      >Chính sách và điều khoản
                      </Anchor> của BlockClip
                    </>
                  }
                  checked={agreedPolicy}
                  color={theme.colors.primary[5]}
                  onChange={(event) => setAgreedPolicy(event.currentTarget.checked)}
                  styles={{
                    label: {
                      fontStyle: 'italic'
                    }
                  }}
                />
              </Stack>
              <Group justify="flex-end">
                <AppButton
                  async
                  loading={isUploading}
                  type='submit'
                  width={150} height={54} radius={10}
                  color={theme.colors.primary[5]}
                  disabled={!agreedPolicy}
                >
                  Xác nhận
                </AppButton>
              </Group>
            </Tabs.Panel>
          </Tabs>
        </Card>
      </Box>
    </BoundaryConnectWallet >
  )
}