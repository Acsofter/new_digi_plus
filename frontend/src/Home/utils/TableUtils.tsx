import { motion } from "framer-motion";
import { CircleCheck, CircleX, ListCollapse } from "lucide-react";
import { useUserServices } from "../../services/user.services";




export const RenderTickets = ({response, currentWeek, fetchTickets, user, onSelectTicket, color, getStatus}: {response: any, currentWeek: any, fetchTickets: any, user: any, onSelectTicket: any, color: any, getStatus: any}) => {
  const {
    updateTicketStatus
  } = useUserServices();

  

  const approveTicket = async (id: number) => {
    if (currentWeek.is_paid) return;
    try {
      const response = await updateTicketStatus(id, 2);
      if (response) {
        fetchTickets();
      }
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };

  const rejectTicket = async (id: number) => {
    if (currentWeek.is_paid) return;
    try {
      const response = await updateTicketStatus(id, 3);
      if (response) {
        fetchTickets();
      }
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };
    return (response && response.results) && response.results.map((ticket: any, index: number) => (
          <motion.tr
            key={ticket.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            
            className={`  text-gray-500 h-16  border-${color} border-opacity-15 dark:bg-gray-800 dark:border-gray-700  dark:hover:bg-gray-600 ${ticket.week_paid.is_paid ? "bg-slate-100 dark:bg-gray-600" : "bg-white hover:bg-gray-50"} `}
          >
            <td className={`border-l-4  ${color} `}>
              {((response.current || 0) - 1) * 5 + (index + 1)}
            </td>
            <td className="">{getStatus(parseInt(ticket.payment.status))}</td>
            <td className="hidden md:table-cell">{ticket.category.name}</td>
            <td className="">{ticket.payment.amount}</td>
            <td className="text-left ">
              <div
                className="w-6 rounded-full text-[0.5rem] hidden md:inline-flex items-center justify-center text-white "
                style={{ backgroundColor: ticket.collaborator.color }}
              >
                {ticket.collaborator.first_name[0]}
                {ticket.collaborator.last_name[0]}
              </div>{" "}
              {`${ticket.collaborator.username}`}
            </td>
            <td className="">
              <span className="hidden md:inline">
                {new Date(ticket.created_at).toLocaleString("es-EN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>

              <span className="inline md:hidden">
                {
                  new Date(ticket.created_at)
                    .toLocaleString("es-EN")
                    .split(",")[0]
                }
              </span>
            </td>
            <td className={`border-r-2 ${color} border-spacing-0`}>
              <div className="flex flex-wrap justify-center items-center  gap-1 w-full h-full">
                {ticket.week_paid.is_paid || user?.roles.includes("staff") &&
                  ticket.payment.status === "1" && (
                    <>
                      <button
                        disabled={currentWeek.is_paid}
                        className={`text-teal-500 cursor-pointer inline  disabled:text-gray-400 hover:opacity-85 disabled:cursor-default`}
                        onClick={() => approveTicket(ticket.id)}
                      >
                        <CircleCheck className="size-3 sm:size-4" />
                      </button>

                      <button
                        disabled={currentWeek.is_paid}
                        className={` inline  text-rose-500 cursor-pointer hover:opacity-85 disabled:text-gray-400 disabled:cursor-default`}
                        onClick={() => rejectTicket(ticket.id)}
                      >
                        <CircleX className="size-3 sm:size-4" />
                      </button>
                    </>
                  )}
                <div className="inline text-gray-400 cursor-pointer hover:opacity-85">
                  <ListCollapse 
                    className=" size-3 sm:size-4"
                    onClick={() => onSelectTicket(ticket)}
                  />
                </div>
              </div>
            </td>
          </motion.tr>
        )) 
    
}