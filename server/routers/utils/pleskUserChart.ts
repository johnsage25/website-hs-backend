import _ from "lodash";
import PleskXMLClient from "../../../node/PleskXMLClient";
import { ServerConnectInterface } from "../../../Types/ServerConnectInterface";


const pleskUserChart = async (
  connect: ServerConnectInterface,
  domain: string
) => {
  const pleskapi = new PleskXMLClient(
    connect.hostAddress,
    connect.port,
    connect.username,
    connect.password
  );




  let data: any = await pleskapi?.getPleskCall(`<packet>
  <webspace>
    <get>
      <filter>
        <name>${domain}</name>
      </filter>
      <dataset>
        <gen_info/>
        <stat/>
        <disk_usage/>
      </dataset>
    </get>
  </webspace>
</packet>`);

// console.log(data.packet.webspace[0].get[0].result);

  if (
    !_.isEqual(data?.packet.webspace[0]?.get[0]?.result[0]?.status[0], "error")
  ) {
    const totalDiskUsage =
      data?.packet.webspace[0]?.get[0]?.result[0]?.data[0].disk_usage.reduce(
        (acc: any, curr: any) => {
          Object.values(curr).forEach((value: any) => {
            acc += parseInt(value[0]);
          });
          return acc;
        },
        0
      );

    const totaltraffic =
      parseInt(
        data?.packet.webspace[0]?.get[0]?.result[0]?.data[0].stat[0].traffic[0]
      ) || 0;

    return { totalDiskUsage, totaltraffic };
  } else {
    return { totalDiskUsage: 0, totaltraffic: 0 };
  }
};

export default pleskUserChart;
