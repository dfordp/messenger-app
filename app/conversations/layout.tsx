import Sidebar from "../components/sidebar/Sidebar";
import getConversations from "../actions/getConversations";
import getUsers from "../actions/getUsers";
import CoversationList from "./components/ConversationList";


export default async function ConversationLayout ({
    children
}:{
    children : React.ReactNode,
}) {

    const conversations = await getConversations();
    const users = await getUsers();

    return(
        <Sidebar>
            <div className="h-full">
                 <CoversationList
                    users={users} 
                    title="Messages" 
                    initialItems={conversations}
                 />
                 {children}
            </div>
        </Sidebar>
    )
}