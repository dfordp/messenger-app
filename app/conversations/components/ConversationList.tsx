'use client';

import { User } from "@prisma/client";
import { FullConversationType } from "@/app/types";
import useConversation from "@/app/hooks/useConversation";


import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";



interface ConversationListProps {
    initialItems: FullConversationType[];
    users: User[];
    title?: string;
}

const ConversationList: React.FC<ConversationListProps>  = ({ 
    initialItems, 
    users
  }) => {

    const [items, setItems] = useState(initialItems);

    const router = useRouter();
    const session = useSession();

    const { conversationId, isOpen } = useConversation();

    return (
        <div>
        CoversationList
        </div>
    )
}

export default ConversationList
