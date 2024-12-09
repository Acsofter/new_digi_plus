import { Table } from "lucide-react"
import MetricsHome from "../Home/components/MetricsHome"
import { TicketPayment } from "../Home/components/TicketPayment"

export const Home = () => {
  return (
   <>
    <MetricsHome />
    <Table />
    <TicketPayment />
   </>
  )
}
