import SupportIcon from '@mui/icons-material/Support';
import Tickets from './Ticket/List'
import ViewTicket from './Ticket/View'

const TicketingRoutes = [
    {
        path: "/tickets",
        component: Tickets
    },
    {
        path: "/ticket/view",
        component: ViewTicket
    }
]

const TicketingMenu = [
    {
        title: "Tickets",
        "icon": SupportIcon,
        url: "/tickets",
    }
]

export { TicketingMenu }
export { TicketingRoutes }
export { Tickets }
export { ViewTicket }