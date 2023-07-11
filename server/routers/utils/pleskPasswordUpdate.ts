import _ from "lodash";
import { OrderInterface } from "../../../Types/OrderInterface";
import { ServerConnectInterface } from "../../../Types/ServerConnectInterface";
import PleskXMLClient from "../../../node/PleskXMLClient";

const pleskPasswordUpdate = async (
  connect: ServerConnectInterface,
  order: OrderInterface | any,
  password: string
) => {
  const pleskapi = new PleskXMLClient(
    connect.hostAddress,
    connect.port,
    connect.username,
    connect.password
  );

  // console.log(password);

  // ( cname, pname, login, passwd, status, phone, fax, email, address, city )"
  let data: any = await pleskapi?.getPleskCall(`
  <packet>
   <customer>
      <set>
         <filter>
            <login>${order.hostMeta[0].username}</login>
         </filter>
         <values>
         <gen_info>
          <passwd>${password}</passwd>
         </gen_info>
        </values>
      </set>
   </customer>
</packet>`);

  if (_.isEqual(data.packet?.customer[0]?.set[0]?.result[0]?.status[0], "ok")) {
    return {
      status: true,
    };
  } else {
    return {
      status: false,
    };
  }
};

export default pleskPasswordUpdate;
