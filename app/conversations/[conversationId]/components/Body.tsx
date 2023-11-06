'use client'

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import MessageBox from "./MessageBox";
import {find} from "lodash"
import { pusherClient } from "@/app/libs/pusher";
import { format , isThisYear } from 'date-fns';



interface BodyProps {
    initialMessages: FullMessageType[];
}


const Body: React.FC<BodyProps> = ({ initialMessages = [] }) => {

    const [messages,setMessages] = useState(initialMessages)
    const bottomRef = useRef<HTMLDivElement>(null);

    const { conversationId } = useConversation();


    const messagesByDate = messages.reduce((groups: { [key: string]: FullMessageType[] }, message) => {
      const messageDate = new Date(message.createdAt);
      const dateFormat = isThisYear(messageDate) ? 'dd MMMM' : 'dd MMMM yyyy';
      const date = format(messageDate, dateFormat);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});
    

    useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`);
      }, [conversationId]);
    
      
      
      useEffect(()=>{

        pusherClient.subscribe(conversationId)
        bottomRef?.current?.scrollIntoView();

        const messageHandler = (message: FullMessageType) => {
            axios.post(`/api/conversations/${conversationId}/seen`);
      
            setMessages((current) => {
              if (find(current, { id: message.id })) {
                return current;
              }
      
              return [...current, message]
            });
            
            bottomRef?.current?.scrollIntoView();
          };

          const updateMessageHandler = (newMessage: FullMessageType) => {
            setMessages((current) => current.map((currentMessage) => {
              if (currentMessage.id === newMessage.id) {
                return newMessage;
              }
        
              return currentMessage;
            }))
          };

        pusherClient.bind('messages:new', messageHandler)
        pusherClient.bind('message:update', updateMessageHandler);


        return () => {
           pusherClient.unsubscribe(conversationId)
           pusherClient.unbind('messages:new', messageHandler)
           pusherClient.unbind('message:update', updateMessageHandler)
        }
      },[conversationId])


      

      return(
        <div className="h-[585px] overflow-y-auto">
          <div className="flex justify-center items-center">
            <div className="mt-2 mb-2 bg-gray-200 text-center rounded inline-block">
              <p className="px-2 py-1 text-gray-500 text-xs">
                Messages & Calls are end-to-end encrypted
              </p>
            </div>
          </div>
          {Object.entries(messagesByDate).map(([date, messages]) => (
          <div key={date}>
            <div className="flex justify-center items-center">
              <div className="mt-2 bg-gray-200 text-center rounded inline-block">
                  <p className="px-2 py-1 text-gray-500 text-xs">
                      {date}
                  </p>
              </div>
            </div>
            {messages.map((message, i) => (
              <MessageBox
                isLast={i === messages.length - 1}
                key={message.id}
                data={message}
              />
            ))}
          </div>
        ))}
        <div className="pt-24" ref={bottomRef} />
        </div>
    )
}

export default Body;