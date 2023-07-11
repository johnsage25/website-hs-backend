import {
  Anchor,
  Button,
  Modal,
  Paper,
  Text,
  useMantineTheme,
} from '@mantine/core'
import React, { useState } from 'react'

function SMSMessageBlock(props: any) {
  const { isMobileVerify } = props.session.customer[0].isMobileVerify
  const [enableSMS, setenableSMS] = useState(isMobileVerify)
  const theme = useMantineTheme()
  const [modalOpt, setmodalOpt] = useState(false)

  return (
    <div>
      <Paper className="flex flex-col space-y-2 py-7 min-h-[80px]">
        <Text size={18} fw={500} className="text-gray-700">
          SMS Messaging
        </Text>

        <div className="flex flex-row items-center  space-y-4 basis-1/1">
          <div className="space-y-4 flex">
            <div className="flex flex-row items-center  space-y-4 basis-3/4">
              <div className="space-y-4 ">
                {props.session.customer[0].isMobileVerify ? (
                  <div className="border-l-green-600 border-l-4 px-4 bg-green-50 py-2 w-1/2">
                    <Text>SMS messaging is enabled for you.</Text>
                  </div>
                ) : (
                  <div className="border-l-red-600 border-l-4 px-4 bg-red-50 py-2 w-1/2">
                    <Text>SMS messaging is disabled.</Text>
                  </div>
                )}

                <Text size={15} className="text-gray-500 block space-y-2">
                  The phone verification procedure includes the sending of an
                  authentication code through SMS. No other motive exists for
                  sending messages. A crucial level of account security is
                  offered through SMS authentication, which is an optional
                  feature. You have the option to withdraw at any moment, in
                  which case your verified phone number will be erased.
                </Text>
              </div>
            </div>
            <div className="basis-1/4 md:basis-1/4 flex justify-end">
              {props.session.customer[0].isMobileVerify ? (
                <Button
                  size="md"
                  radius={'xl'}
                  onClick={() => {
                    setmodalOpt(true)
                  }}
                  disabled={!props.session.customer[0].isMobileVerify}
                  className="hover:bg-lochmara-500 bg-lochmara-400"
                >
                  Opt Out
                </Button>
              ) : (
                <Button
                  size="md"
                  radius={'xl'}
                  disabled={!props.session.customer[0].isMobileVerify}
                  className="hover:bg-lochmara-500 bg-lochmara-400"
                >
                  Opt In
                </Button>
              )}
            </div>
          </div>
        </div>
      </Paper>

      <Modal
        opened={modalOpt}
        size={'lg'}
        centered
        closeOnClickOutside={false}
        title={
          <Text size={20} fw={500}>
            Opt out of SMS messaging for phone verification
          </Text>
        }
        onClose={() => {
          setmodalOpt(false)
        }}
        overlayColor={
          theme.colorScheme === 'dark'
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        <div className="space-y-4">
          <div className=" space-y-4">
            <Text size={15} >
              Choosing not to receive SMS messages can lessen security and
              restrict how safely you can use your account.
            </Text>
            <div className=" bg-red-50 border-l-red-600 border-l-4 py-2 px-4">
              <Text size={14} ff="sans-serif">
                You should be aware that this action will result in the deletion
                of your verified phone number, +{props.session.customer[0].mobile}.
              </Text>
            </div>
          </div>
          <div className="flex justify-end space-x-3 items-center">
            <Anchor size={'md'} onClick={() => {
                setmodalOpt(false)
            }}>
              Cancel
            </Anchor>
            <Button
              color="red"
              radius={'xl'}
              className=" bg-red-500 hover:bg-red-600"
              size="md"
            >
              Opt Out
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default SMSMessageBlock
