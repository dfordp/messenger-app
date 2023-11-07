'use client';


import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { FiVideo, FiVideoOff, FiMic, FiMicOff, FiPhoneOff } from 'react-icons/fi';
import Modal from '@/app/components/modals/Modal';
import Button from '@/app/components/Button';
import Pusher from 'pusher-js';

interface Message {
    id: string;
    createdAt: Date;
    lastMessageAt: Date;
  }
  
  interface UserData {
    id: string;
    createdAt: Date;
    lastMessageAt: Date;
    name: string | null;
    isGroup: boolean | null;
    messages: Message[];
    userIds: string[];
  }
  
  interface CallModalProps {
    isOpen?: boolean;
    onClose: () => void;
    userData: UserData;
  }

  interface Participant {
    userId: string;
  }
  
  

  const CallModal: React.FC<CallModalProps> = ({ isOpen, onClose , userData }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const { userIds, name: groupName } = userData;


    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
    if (!pusherKey) {
      throw new Error('PUSHER_APP_KEY is not defined in the environment variables');
    }

    let pusher = new Pusher(pusherKey, {
    cluster: 'ap2'
    });

    const channelName = `group-${groupName}`;
    const channel = pusher.subscribe(channelName);


    useEffect(() => {
      const pusher = new Pusher(pusherKey, { cluster: 'ap2' });
      const channelName = `group-${groupName}`;
      const channel = pusher.subscribe(channelName);
  
      channel.bind('user-joined', (data: any) => {
        const { userId } = data;
        setParticipants(prevParticipants => [...prevParticipants, userId]);
      });
  
      channel.bind('disconnected', () => {
        if (videoRef.current && videoRef.current.srcObject) {
          let stream = videoRef.current.srcObject as MediaStream;
          let tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
      });
      return () => {
        channel.unsubscribe();
        pusher.disconnect();
      };
    }, [groupName]);
    
    useEffect(() => {
      if (isOpen) {
        navigator.mediaDevices.getUserMedia({ audio: true, video: !isVideoOff })
          .then(stream => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          })
          .catch(err => {
            console.log('Error: ', err);
          });
      }

      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          let stream = videoRef.current.srcObject as MediaStream;
          let tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
      };
    }, [isOpen, isVideoOff]);

      
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="mx-auto">
            <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
            Video Call
            </Dialog.Title>
            <div className="mt-2">
            <p className="text-sm text-gray-500">
                You are currently in a call.
            </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userIds && userIds.map((user: any, index: number) => (
            <div key={index} className="m-2 bg-gray-200 p-2 rounded-lg w-64 h-64">
                <div className="relative w-full h-full mx-auto">
                {isVideoOff ? (
                    <div className="w-full h-full bg-gray-500" />
                ) : (
                    <div className="w-full h-full">
                    <video ref={videoRef} autoPlay muted={isMuted} className="w-full h-full object-cover" />
                    </div>
                )}
                </div>
            </div>
            ))}
                        </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <Button onClick={() => setIsMuted(!isMuted)}>
                {isMuted ? <FiMicOff /> : <FiMic />}
            </Button>
            <Button onClick={() => setIsVideoOff(!isVideoOff)}>
                {isVideoOff ? <FiVideoOff /> : <FiVideo />}
            </Button>
            <Button onClick={onClose}>
                <FiPhoneOff />
            </Button>
            </div>
        </div>
      </Modal>
    );
  };

export default CallModal;