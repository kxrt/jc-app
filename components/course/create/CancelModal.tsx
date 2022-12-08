import { ButtonGroup, ModalBody, ModalFooter, Text, useDisclosure } from '@chakra-ui/react';
import { Listbox } from '@headlessui/react';
import { Category } from '@prisma/client';
import Image from 'next/image';
import { useController, UseControllerProps } from 'react-hook-form';
import CustomButton from '../../Buttons';
import Modal from '../../Modal';

export const CancelModal = ({ isOpen, onClose }) => {
  return (
    <Modal title='' onClose={onClose} isOpen={isOpen} size='xl'>
      <ModalBody>
        <div className='flex gap-x-4'>
          <Image src={'/icons/Alert.svg'} height={40} width={40} alt='Alert' />
          <div>
            <div className='text-lg font-medium'>Are you sure you want to exit without saving?</div>
            <div className='text-sm text-[#7B7B7B]'>This course will be discarded</div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <ButtonGroup spacing='4'>
          <CustomButton onClick={onClose} variant='black-outline'>
            <Text>Cancel</Text>
          </CustomButton>
          <CustomButton onClick={onClose} variant='black-solid'>
            <Text color='#FFFFFF'>Exit</Text>
          </CustomButton>
        </ButtonGroup>
      </ModalFooter>
    </Modal>
  );
};
