import { TicketTable } from "../Home/components/Table"
import MetricsHome from "../Home/components/MetricsHome"
import { TicketPayment } from "../Home/components/TicketPayment"
import { HomeProvider } from "../Home/contexts/HomeContext"
import { TicketDetails } from "../Home/components/TicketDetails"
import { FiltersHome } from "../Home/components/FiltersHome"

export const Home = () => {
  return (
   <HomeProvider>
    <MetricsHome />
    <FiltersHome />
    <TicketTable />
    <TicketPayment />
    <TicketDetails />
   </HomeProvider>
  )
}
