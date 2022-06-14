import { PagePadding, TopContext, get, post, app } from '@Panel'
import { DateTime } from '@List'
import React, { useState, useEffect, useContext } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Collapse from '@mui/material/Collapse'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import Button from '@mui/material/Button'

const ViewTicket = () => {

    const [progress, setProgress] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [ticket, setTicket] = useState()
    const [showForm, setShowForm] = useState(false)
    const [isValid, setIsValid] = useState(false)
    const [message, setMessage] = useState('')

    const { setTitle } = useContext(TopContext)

    const { ticketId } = app.parseQuery()

    const titleStyle = "font-bold mb-1"
    const valueStyle = "border-b border-white mb-2 pb-2"

    const loadTicket = () => {
        setProgress(true)
        get(`/ticket/view?ticketId=${ticketId}`)
            .then((data) => {
                setProgress(false)
                setTicket(data)
            }, (error) => {
                setProgress(false)
                app.error(error)
            })
    }

    const handleSubmit = () => {
        setSubmitting(true)
        post(`/ticket/addUserResponse`, { ticketId: ticketId * 1, message })
            .then((post) => {
                setSubmitting(false)
                setShowForm(false)
                loadTicket()
            }, (error) => {
                setSubmitting(false)
                app.error(error)
            })
    }

    useEffect(() => {
        if (ticketId) {
            loadTicket()
            setTitle('View ticket ')
        }
    }, [])

    useEffect(() => {
        if (message) {
            setIsValid(true)
        }
        else {
            setIsValid(false)
        }
    }, [message])

    useEffect(() => {
        if (showForm) {
            document.querySelector('#postMessage').focus()
        }
    }, [showForm])

    const Ticket = <div className="ticket ">
        <div className="bg-green-200 md:rounded-lg p-6">
            <div className={titleStyle}>{app.t('Ticket')} #{ticket?.ticket?.id}</div>
            <div className={valueStyle}>{ticket?.ticket?.title}</div>
            <div className={titleStyle}>{app.t('Created at')}:</div>
            <div className={valueStyle}><DateTime date={ticket?.ticket?.utcDate} /></div>
            <div className={titleStyle}>{app.t('Last updated at')}:</div>
            <div className={valueStyle}><DateTime date={ticket?.ticket?.latestPostUtcDate} /></div>
            <div className={titleStyle}>{app.t('Importance')}:</div>
            <div className={valueStyle}>{app.t(ticket?.ticket?.priorityKey)}</div>
            <div className={titleStyle}>{app.t('State')}:</div>
            <div className={valueStyle + " border-transparent mb-0 pb-0"}>{app.t(ticket?.ticket?.relatedItems?.titleizedStateKey)}</div>
        </div>
    </div>

    const Form = <div className="mb-6">
        <Collapse in={showForm}>
            <div className="bg-white p-6 ">
                {/* <LongText
                    column="html"
                    placeholder="Please write your response here."
                /> */}
                <textarea
                    id='postMessage'
                    className="w-full p-3"
                    onChange={(e) => setMessage(e.target.value)}
                    rows="10"
                    disabled={submitting}
                >

                </textarea>
                <div className="mt-3 float-right ">
                    {
                        submitting
                            ?
                            <CircularProgress />
                            :
                            null
                    }
                    <Button
                        variant="outlined"
                        className={(isValid ? " bg-green-200" : "")}
                        onClick={handleSubmit}
                        disabled={!isValid}
                    >
                        {app.t('Save')}
                    </Button>
                </div>
                <div className="clear-both"></div>
            </div>
        </Collapse>
        {
            showForm
                ?
                <div className="w-full pt-6 cursor-pointer" onClick={() => setShowForm(false)}>
                    <ExpandLessIcon />
                    <span className="text-sm mx-3 lowercase font-light tracking-wider">{app.t('Hide form')}</span>
                </div>
                :
                <div className="w-full cursor-pointer" onClick={() => setShowForm(true)}>
                    <ExpandMoreIcon />
                    <span className="text-sm mx-3 lowercase font-light tracking-wider">{app.t('Show form')}</span>
                </div>
        }
    </div>

    const Posts = <div className="posts lg:col-span-3 lg:row-start-1">
        {Form}
        {
            ticket?.posts?.map((post, index) => <div key={post.id} className={
                "post bg-white p-6 border-b whitespace-pre-wrap "
                + (index === 0 ? " rounded-tl-lg rounded-tr-lg" : "")
                + (index === ticket.posts.length - 1 ? " rounded-bl-lg rounded-br-lg " : "")
                + (post.isSystemPost ? " bg-gray-300 " : "")
            }>
                <div>
                    <span>{post.utcDate}</span>
                    <span>{post.isSystemPost ? "User" : "System"}</span>
                </div>
                {post.relatedItems.html}
            </div>)
        }
    </div>

    return <div
        className={PagePadding}
    >
        {
            progress
                ?
                <CircularProgress />
                :
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 ">
                    {Ticket}
                    {Posts}
                </div>
        }
    </div>
}

export default ViewTicket