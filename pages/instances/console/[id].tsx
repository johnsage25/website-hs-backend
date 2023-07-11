import React, { useEffect, useRef } from 'react'
import { ServerSideProps } from '../../../Types/ServerInterface'
import { AuthCheck } from '../../../node/AuthCheck'
import { VmDetails } from '../../../node/VmDetails'
import middleChecker from '../../../node/middleChecker'
import _ from 'lodash'
import dynamic from 'next/dynamic'
import { vmTerminal } from '../../../nodeProxmox/vmTerminal'
import { ProxmoxVmTerminal } from '../../../node/ProxmoxVmTerminal'
import { serialize } from 'cookie'
const TerminalConsole = dynamic(() => import("./_Component/TerminalConsole"), { ssr: false })

const Console = (props: any) => {

    const terminalRef = useRef(null);

    const initTerminal = async () => {


    }


    useEffect(() => {


        initTerminal()

    }, []);

    return (
        <>
            {/* <TerminalConsole url={props.termsurl} /> */}
        </>
    )
}

export default Console

export async function getServerSideProps(context: any) {

    let { req, res }: ServerSideProps = context
    let session: any = await AuthCheck(req, res)

    const query = context.query;
    let customer = session.customer[0]
    middleChecker(req, res, customer)

    let vmDetails: any = await VmDetails(context)
    let terms: any = await ProxmoxVmTerminal(vmDetails.vmid, vmDetails.region[0]?.locationId, vmDetails.vmProvider)


    let baseURL = process.env.BASEURL
    // let termsurl = `wss://217.23.5.62:8006/api2/json/nodes/customer/qemu/${vmDetails.vmid}/vncwebsocket?port=${encodeURIComponent(terms.port)}&vncticket=${encodeURIComponent(terms.ticket)}`
    // console.log(termsurl);

    // const cookie = serialize("PVEAuthCookie", encodeURIComponent(terms.ticket), {
    //     httpOnly: true,
    //     maxAge: 60 * 60 * 24 * 7 // 1 week
    // });

    // res?.setHeader("Set-Cookie", cookie);

    console.log(terms.responsePayload);

    if (_.isEmpty(session)) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }

    return {
        props: {
            session,
            // termsurl,
            query,
            vmDetails,
        },
    }
}
