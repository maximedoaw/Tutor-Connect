import { Button } from "../../../components/ui/button"
import { MessageSquare } from "lucide-react"

export default function ChatButton() {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Button className="h-14 w-14 rounded-full shadow-lg flex items-center justify-center">
        <MessageSquare className="h-6 w-6" />
      </Button>
    </div>
  )
}

