import { Badge } from "@mantine/core"

const StatusBadge = ({ status }: { status?: string }) => {

    switch (status) {
      case "running":
        return (<>
          <Badge color="green" variant="outline">{status}</Badge>
        </>)

      case "stopped":
        return (<>
          <Badge color="red" variant="outline">{status}</Badge>
        </>)

      case "paused":
        return (<>
          <Badge color="orange" variant="outline">{status}</Badge>
        </>)

      case "blocked":
        return (<>
          <Badge color="yellow" variant="pink">{status}</Badge>
        </>)

      case "shutoff":
        return (<>
          <Badge color="gray" variant="outline">{status}</Badge>
        </>)

      default:
        return (<></>)
    }

  }

  export default StatusBadge