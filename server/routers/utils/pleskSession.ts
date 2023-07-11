import _ from "lodash";
import PleskXMLClient from "../../../node/PleskXMLClient";
import { ServerConnectInterface } from "../../../Types/ServerConnectInterface";
import { OrderInterface } from "../../../Types/OrderInterface";

const pleskSession = async (
  connect: ServerConnectInterface,
  order: OrderInterface | any,
  type?: string
) => {
  const pleskapi = new PleskXMLClient(
    connect.hostAddress,
    connect.port,
    connect.username,
    connect.password
  );

  let data: any = await pleskapi?.getPleskCall(`<packet>
  <server>
  <create_session>
  <login>${order.hostMeta[0].username}</login>
  <data>
      <user_ip>${connect.ipAddress}</user_ip>
      <source_server></source_server>
  </data>
  </create_session>
</server>
</packet>`);
  if (
    _.isEqual(
      data.packet?.server[0]?.create_session[0]?.result[0]?.status[0],
      "ok"
    )
  ) {
    switch (type) {
      case "email":
        return {
          url: `https://${connect.hostAddress}:8443/enterprise/rsession_init.php?PLESKSESSID=${data.packet?.server[0]?.create_session[0]?.result[0]?.id[0]}&success_redirect_url=https://${connect.hostAddress}:8443/smb/email-address/list`,
          status: true,
        };
      case "statistics":
        return {
          url: `https://${connect.hostAddress}:8443/enterprise/rsession_init.php?PLESKSESSID=${data.packet?.server[0]?.create_session[0]?.result[0]?.id[0]}&success_redirect_url=https://${connect.hostAddress}:8443/smb/statistics/details`,
          status: true,
        };
      case "backup":
        return {
          url: `https://${connect.hostAddress}:8443/enterprise/rsession_init.php?PLESKSESSID=${data.packet?.server[0]?.create_session[0]?.result[0]?.id[0]}&success_redirect_url=https://${connect.hostAddress}:8443/smb/backup/list/domainId`,
          status: true,
        };
      case "filemanager":
        return {
          url: `https://${connect.hostAddress}:8443/enterprise/rsession_init.php?PLESKSESSID=${data.packet?.server[0]?.create_session[0]?.result[0]?.id[0]}&success_redirect_url=https://${connect.hostAddress}:8443/smb/file-manager/list`,
          status: true,
        };

      case "domain":
        return {
          url: `https://${connect.hostAddress}:8443/enterprise/rsession_init.php?PLESKSESSID=${data.packet?.server[0]?.create_session[0]?.result[0]?.id[0]}&success_redirect_url=https://${connect.hostAddress}:8443/smb/web/view`,
          status: true,
        };
      case "subdomain":
        return {
          url: `https://${connect.hostAddress}:8443/enterprise/rsession_init.php?PLESKSESSID=${data.packet?.server[0]?.create_session[0]?.result[0]?.id[0]}&success_redirect_url=https://${connect.hostAddress}:8443/smb/web/view`,
          status: true,
        };
      case "database":
        return {
          url: `https://${connect.hostAddress}:8443/enterprise/rsession_init.php?PLESKSESSID=${data.packet?.server[0]?.create_session[0]?.result[0]?.id[0]}&success_redirect_url=https://${connect.hostAddress}:8443/smb/database/list`,
          status: true,
        };
      case "scheduler":
        return {
          url: `https://${connect.hostAddress}:8443/enterprise/rsession_init.php?PLESKSESSID=${data.packet?.server[0]?.create_session[0]?.result[0]?.id[0]}&success_redirect_url=https://${connect.hostAddress}:8443/smb/scheduler/tasks-list`,
          status: true,
        };
      default:
        return {
          url: `https://${connect.hostAddress}:8443/enterprise/rsession_init.php?PLESKSESSID=${data.packet?.server[0]?.create_session[0]?.result[0]?.id[0]}`,
          status: true,
        };
    }
  } else {
    return {
      url: "",
      status: false,
    };
  }
};

export default pleskSession;
