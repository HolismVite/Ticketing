import {
    List,
    Text,
    Enum,
    ListAction,
    ItemAction,
    ValueWithTitle,
    Chip,
    DatePart,
    TimePart,
    post,
    app
} from '@List';
import DoneIcon from '@mui/icons-material/Done';
import MessageIcon from '@mui/icons-material/Message';
import CreateTicket from './Create';

const filters =
    <>
        <Text column='title' placeholder='Title' />
        <Enum column='stateId' placeholder='State' entityType='TicketState' />
    </>

const sorts = [
    {
        caption: "Newest",
        column: "date",
        direction: "desc"
    },
    {
        caption: "Most important",
        key: "MostImportant"
    }
]

const listActions = () => {
    const closeAll = () => {
        console.log('close all');
    };

    return <>
        <ListAction
            title='Close all'
            icon={DoneIcon}
            click={() => closeAll()} />
    </>
}

const itemActions = (item) => {
    const closeTicket = ({ setProgress, setItem }) => {
        setProgress(true);
        post(`/ticket/close?ticketId=${item.id}`)
            .then(data => {
                app.success('Ticket is closed');
                setProgress(false);
                setItem(data);
            }, error => {
                app.error(error);
                setProgress(false);
            });
    }

    return <>
        <ItemAction
            title='View'
            icon={<MessageIcon />}
            goTo={`/ticket/view?ticketId=${item.id}`}
        />
        {
            item.stateKey === 'Closed'
                ?
                null
                :
                <ItemAction
                    title='Close'
                    icon={DoneIcon}
                    click={(params) => closeTicket(params)}
                />
        }
    </>
}

const headers =
    <>
        <th>#</th>
        <th>Title</th>
        <th>Creation date</th>
        <th>State</th>
    </>

const row = (item) => {
    let stateStyle = "";
    switch (item.stateKey) {
        case "New":
        default:
            stateStyle = "bg-blue-400 text-white";
            break;
        case "Closed":
        case "WaitingForUserResponse":
            stateStyle = "bg-green-400";
            break;
        case "WaitingForBusinessResponse":
            stateStyle = "bg-yellow-400 text-blue-900"
            break;
        case "UnderInvestigation":
            stateStyle = "bg-red-600 text-white";
            break;
    }
    return <>
        <td>{item.id}</td>
        <td>{item.title}</td>
        <td>
            <ValueWithTitle
                value={<>
                    <DatePart value={item.utcDate} />
                    <br />
                    <TimePart value={item.utcDate} />
                </>}
                title={item.relatedItems.timeAgo + ' ago'}
            />
        </td>
        <td>
            <Chip
                text={item.relatedItems.titleizedStateKey}
                className={stateStyle}
            />
        </td>
    </>
}

const Tickets = () => {

    return <List
        title="Tickets"
        entityType="ticket"
        filters={filters}
        sorts={sorts}
        listActions={listActions}
        headers={headers}
        row={row}
        create={CreateTicket}
        itemActions={itemActions}
    />
}

export default Tickets;