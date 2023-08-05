import getCoversationById from "@/app/actions/getCoversationById";
import getMessages from "@/app/actions/getMessages";

import EmptyState from "@/app/components/EmptyState";



interface IParams {
    conversationId: string;
}

const ChatID = async ({ params }: { params: IParams }) =>{ 
    const coversation = await getCoversationById(params.conversationId)
    const messages = await getMessages(params.conversationId);

    if (!coversation) {
        return (
          <div className="lg:pl-80 h-full">
            <div className="h-full flex flex-col">
              <EmptyState />
            </div>
          </div>
        )
      }

      return(
        <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
            ConversatioId
        </div>
        </div>
      )
}


export default ChatID