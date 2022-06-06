import { Form, Text, Enum, LongText, Browse } from '@Form';
import UserBrowser from '../../Accounts/User/Browser'

const fields =
    <>
        <Browse
            column='UserGuid'
            placeholder='User'
            required='Please select a user'
            browser={UserBrowser}
            display={user => user.displayName}
            choose={user => user.guid}
        />
        <Text
            column='title'
            placeholder='Title'
            required='Please write the title.'
        />
        <Enum
            column='priorityId'
            entityType='ticketingPriority'
            placeholder='Priority'
            required='Please choose the priority for this ticket. Choose less importance if it is less urgent.'
        />
        <LongText
            column='body'
            placeholder='Please describe the problem!'
            required='We need to know the problem to be able to help.'
        />
    </>

const CreateTicket = (props) => {
    return <Form
        entityType='ticket'
        inputs={fields}
    />
}

export default CreateTicket;