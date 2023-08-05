interface IParams {
    conversationId : string
}

const ChatId = async ({ params }: { params: IParams }) => {
    return(
        <div>
            ConversationID
        </div>
    )
}


export default ChatId;