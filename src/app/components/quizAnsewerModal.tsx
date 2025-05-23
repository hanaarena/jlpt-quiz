import { Modal, ModalBody, ModalContent, useDisclosure } from "@heroui/react";

type QuizAnswerModalProps = {
  text?: string;
  className?: string;
  children?: React.ReactNode;
  modalClassName?: string;
};

export default function QuizAnswerModal({
  text = "Explanation",
  className = "",
  modalClassName = "",
  children,
}: QuizAnswerModalProps) {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  return (
    <>
      <p className={`underline cursor-pointer ${className}`} onClick={onOpen}>
        {text}
      </p>
      <Modal
        isOpen={isOpen}
        placement="bottom"
        scrollBehavior={"inside"}
        onOpenChange={onOpenChange}
        className={`max-w-full m-0`}
      >
        <ModalContent>
          {() => (
            <>
              <ModalBody className={`max-h-90 w-full bg-[url('/bg-3.png')] bg-cover bg-center bg-blend-lighten bg-white bg-opacity-80 ${modalClassName}`}>
                {children}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
