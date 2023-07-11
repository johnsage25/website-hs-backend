import React, { useEffect, useRef } from 'react'
import { XTerm } from 'xterm-for-react'
import { FitAddon } from 'xterm-addon-fit';
import { AttachAddon } from 'xterm-addon-attach';
import { VncScreen } from 'react-vnc';

const TerminalConsole = (props: any) => {
    const ref:any = useRef();
    let xtermRef = React.useRef(null)
    const fitAddon = new FitAddon();

    let socket = new WebSocket(props.url, 'binary');
    // useEffect(() => {
    //     // You can call any method in XTerm.js by using 'xterm xtermRef.current.terminal.[What you want to call]
    //     xtermRef.current.terminal.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')

    // }, [])

    socket.onopen = (e) => {
        console.log(e);

    }

    console.log(props);



    return (
        <div>
            <VncScreen
                url={props.url}
                scaleViewport
                background="#000000"
                style={{
                    width: '75vw',
                    height: '75vh',
                }}
                ref={ref}
            />
        </div>
    )
}

export default TerminalConsole