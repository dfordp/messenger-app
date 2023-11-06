import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { FiVideo, FiVideoOff, FiMic, FiMicOff, FiPhoneOff } from 'react-icons/fi';
import Modal from '@/app/components/modals/Modal';
import Button from '@/app/components/Button';

interface CallModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

const CallModal: React.FC<CallModalProps> = ({ isOpen, onClose }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
        Video Call
      </Dialog.Title>
      <div className="mt-2">
        <p className="text-sm text-gray-500">
          You are currently in a call.
        </p>
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
    </Modal>
  );
};

export default CallModal;