import HelpIcon from '@mui/icons-material/Help';
import Tickets from './List'
import ViewTicket from './View'

const TicketingRoutes = [
    {
        path: "/tickets",
        component: Tickets
    },
    {
        path: "/ticket/view",
        component: ViewTicket
    },
]

const TicketingMenu = [
    {
        title: "Tickets",
        "icon": HelpIcon,
        url: "/tickets"
    }
]

export { TicketingMenu }
export { TicketingRoutes }