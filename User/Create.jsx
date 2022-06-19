import { DialogForm, Text, Enum, LongText } from '@Form';

const fields =
    <>
        <Text
            column='title'
            placeholder='Title'
            required='Please write the title'
        />
        <LongText
            column='body'
            placeholder='Please describe the problem'
            required='We need to know the problem to be able to help'
        />
    </>

const CreateTicket = <DialogForm
    entityType='ticket'
    inputs={fields}
/>

export default CreateTicket;