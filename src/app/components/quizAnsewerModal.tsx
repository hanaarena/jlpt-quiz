import { Modal, ModalBody, ModalContent, useDisclosure } from "@heroui/react";

type QuizAnswerModalProps = {
  text?: string;
  children?: React.ReactNode;
};

export default function QuizAnswerModal({
  text = "Detail",
  children,
}: QuizAnswerModalProps) {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  return (
    <>
      <p className="underline" onClick={onOpen}>
        {text}
      </p>
      <Modal
        isOpen={isOpen}
        placement="bottom"
        scrollBehavior={"inside"}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {() => (
            <>
              <ModalBody className="max-h-90 bg-[url('/bg-3.png')] bg-cover bg-center bg-blend-lighten bg-white bg-opacity-80">
                {children}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
