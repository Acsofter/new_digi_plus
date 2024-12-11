import { TicketTable } from "../Home/components/Table"
import MetricsHome from "../Home/components/MetricsHome"
import { TicketPayment } from "../Home/components/TicketPayment"
import { HomeProvider } from "../Home/contexts/HomeContext"
import { TicketDetails } from "../Home/components/TicketDetails"

export const Home = () => {
  return (
   <HomeProvider>
    <MetricsHome />
    <TicketTable />
    <TicketPayment />
    <TicketDetails />
   </HomeProvider>
  )
}
