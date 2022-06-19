import {
    List,
    Text,
    Enum,
    Ascending,
    ListAction,
    EntityAction,
    ValueWithTitle,
    Chip,
    post,
    app
} from '@List';
import DoneIcon from '@mui/icons-material/Done';
import MessageIcon from '@mui/icons-material/Message';
import CreateTicket from './Create';

const filters =
    <>
        <Text column='title' placeholder='Title' />
        <Enum column='stateId' placeholder='State' entityType='ticketState' />
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

const listActions = (itemIds) => {

    const closeAll = ({
        error,
        reloadList,
        setProgress,
        success,
    }) => {
        setProgress(true);
        post('/ticket/closeAll', itemIds).then(data => {
            success('Tickets are closed successfully');
            setProgress(false);
            reloadList();
        }, e => {
            error(e);
            setProgress(false);
        })
    }

    return <>
        <ListAction
            title='Close all'
            icon={DoneIcon}
            click={(params) => closeAll(params)}
            minCardinality={2}
        />
    </>
}

const entityActions = (item) => {
    const closeTicket = ({
        error,
        setEntity,
        setProgress,
        success,
    }) => {
        setProgress(true);
        post(`/ticket/close?ticketId=${item.id}`)
            .then(data => {
                success('Ticket is closed');
                setProgress(false);
                setEntity(data);
            }, e => {
                error(e);
                setProgress(false);
            });
    }

    return <>
        <EntityAction
            title='View'
            icon={<MessageIcon />}
            goTo={`/ticket/view?ticketId=${item.id}`}
        />
        {
            item.stateKey === 'Closed'
                ?
                null
                :
                <EntityAction
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
        <th> User </th>
        <th>Title</th>
        <th>Creation date</th>
        <th>State</th>
    </>

const row = (item) => {
    let stateStyle = "";
    switch (item.stateKey) {
        case "New":
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
        <td>{item.user}</td>
        <td>{item.title}</td>
        <td>
            <ValueWithTitle
                value={new Date(item.date).toDateString()}
                title={item.relatedItems.TimeAgo + ' ago'}
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

const card = (item) => {
    return <div className="ticket bg-orange-200 m-2">
        <div>{item.title}</div>
    </div>
}

const breadcrumbItems = [
    {
        title: 'Home',
        url: '/'
    },
    {
        title: 'Tickets',
        url: '/tickets',
    },
    {
        title: 'List',
        url: '/tickets'
    }
]

const Tickets = (props) => {

    return (
        <List
            title="Tickets"
            entityType="ticket"
            filters={filters}
            sorts={sorts}
            listActions={listActions}
            headers={headers}
            row={row}
            create={CreateTicket}
            entityActions={entityActions}
        />
    )
}

export default Tickets
export { Tickets }