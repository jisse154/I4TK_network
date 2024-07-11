import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

const NotAuthorized = () => {
  return (
    <div className="h-full flex justify-center items-center w-full ">
        <Alert className="bg-[#F29F05]">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
                You are not authorized! Please contract the administrator.
            </AlertDescription>
        </Alert>
    </div>
  )
}

export default NotAuthorized