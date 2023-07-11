import { ActionIcon, Anchor, Badge, Box, Button, Group, Paper, Select, Text, Title } from '@mantine/core'
import React, { useState } from 'react'
import { BsClockHistory } from 'react-icons/bs'
import HistoryIcon from '../../Components/icons/HistoryIcon'
import { ReactGrid, Column, Row } from '@silevis/reactgrid'
import '@silevis/reactgrid/styles.css'
import { DataTable } from 'mantine-datatable'
import { AiOutlineFilePdf, AiOutlineHistory } from 'react-icons/ai'
import { trpc } from '../../utils/trpc'
import { PaginationInterface } from '../../Types/PaginationInterface'
import { Ucword } from '../../Components/TextFormatter'
import dateFormat, { masks } from "dateformat";
import CurrencyFormat from 'react-currency-format';
import { IconPdf } from '@tabler/icons-react'

interface Person {
  name: string
  surname: string
}

const PaymentHistory = () => {

  const PAGE_SIZE = 10;

  const [page, setPage] = useState(1);
  const [loadingButton, setloadingButton] = useState<{ state: boolean, id: string }>({ state: false, id: "" })
  let pager: PaginationInterface = {
    page,
    sort: { createdAt: -1 },
    limit: PAGE_SIZE,
    populate: [{ path: "items" }]
  }

  const columns: any = [{
    accessor: 'traxId', title: "Invoice ID", render(record: any, index) {
      return (
        <>
          <Anchor>{record.invoiceNumber}</Anchor>
        </>
      )
    },
  },
  {
    accessor: 'Amount', render: (record: any) => {

      return (
        <><CurrencyFormat value={record?.total} decimalScale={2} fixedDecimalScale={true} displayType={'text'} thousandSeparator={true} prefix={'$'} /></>
      )
    }
  },

  {
    accessor: 'method', render: (record: any) => {
      return (
        <>
          <Text>{Ucword(record.paymentMethod)}</Text>
        </>
      )
    }
  },
  {
    accessor: 'created', render: (record: any) => {
      return (
        <>
          <Text>{dateFormat(record.createdAt, "mediumDate")}</Text>
        </>
      )
    }
  },
  {
    accessor: 'status', render: (record: any) => {
      // enum: ["paid", "pending", "unpaid", "returned", "cancelled"],

      // <Text>{Ucword(record.paymentStatus)}</Text>
      switch (record.paymentStatus) {
        case "paid":
          return (
            <Badge variant="filled">{record.paymentStatus}</Badge>
          )
        case "pending":
          return (
            <Badge color='orange' variant="filled">{record.paymentStatus}</Badge>
          )
        case "unpaid":
          return (
            <Badge color='red' variant="filled">{record.paymentStatus}</Badge>
          )
        case "returned":
          return (
            <Badge color="yellow" variant="filled">{record.paymentStatus}</Badge>
          )
        case "cancelled":
          return (
            <Badge color="cyan" variant="filled">{record.paymentStatus}</Badge>
          )

      }
    }
  },
  {
    accessor: 'actions',
    title: <></>,
    width: 100,
    textAlignment: 'right',
    render: (row: any) => (
      <Group spacing={4} position="right" noWrap>
        <ActionIcon loading={loadingButton.state && loadingButton.id == row._id} onClick={() => {


          var myHeaders = new Headers();
          myHeaders.append("Authorization", "Bearer Basic 1234");
          myHeaders.append("Content-Type", "application/json");

          var raw = JSON.stringify({
            id: row._id,
            type: row.type
          });

          setloadingButton({ state: true, id: row._id })

          fetch('/api/invoice', {
            method: 'POST',
            body: raw,
            headers: myHeaders,
          })
            .then(response => response.blob())
            .then(pdfBlob => {
              const fileUrl = URL.createObjectURL(pdfBlob);
              const downloadLink = document.createElement('a');
              downloadLink.href = fileUrl;
              downloadLink.download = 'invoice.pdf';
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
              setloadingButton({ state: false, id: "" })
            })
            .catch(error => {
              console.error(error);
              setloadingButton({ state: false, id: "" })
            });

        }} variant='subtle' radius={"xl"}>
          <AiOutlineFilePdf size={20} />
        </ActionIcon>
      </Group>
    ),
  },
  ]

  const billingHistoryQuery = trpc.account.billingHistory.useQuery(pager)
  const data: any = billingHistoryQuery.data || []

  // console.log(data);


  return (
    <Paper py={10} p="md" className="flex flex-col border">
      <div className="pb-3 flex justify-between items-center border-b border-b-gray-200">
        <Title order={5} fw={400}>
          Billing & Payment History
        </Title>
        <Group>
          {/* <Select
            size="sm"
            radius={"xl"}
            placeholder="Pick one"
            searchable
            data={['React', 'Angular', 'Svelte', 'Vue']}
          />
          <Select
            placeholder="Pick one"
            searchable
            radius={"xl"}
            size="sm"
            data={['React', 'Angular', 'Svelte', 'Vue']}
          /> */}
        </Group>
      </div>
      <div className=" min-h-[200px]">
        <DataTable
          columns={columns}
          records={data?.docs}
          minHeight={300}
          recordsPerPage={PAGE_SIZE}
          onPageChange={(p) => setPage(p)}
          totalRecords={data?.totalDocs}
          horizontalSpacing={"xl"}
          verticalSpacing={"sm"}
          fetching={billingHistoryQuery.isLoading}
          page={page}
          noRecordsIcon={
            <Box
              p={4}
              mb={4}
            >
              <AiOutlineHistory size={80} className="fill-gray-200 mx-auto" />
            </Box>
          }
          noRecordsText="No records found"

        />

        {/* Pagination will be added to this table */}
      </div>
    </Paper>
  )
}

export default PaymentHistory
