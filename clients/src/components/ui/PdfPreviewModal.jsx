// src/components/ui/PdfPreviewModal.jsx
import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';
import { forceDownloadUrl, getFilenameFromUrl } from '../../utils/logics';

function PdfPreviewModal({ isOpen, onClose, pdfUrl }) {
  if (!pdfUrl) {
    return null;
  }

  const filename = getFilenameFromUrl(pdfUrl);
  const downloadUrl = forceDownloadUrl(pdfUrl);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{filename}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <iframe
            src={pdfUrl}
            title="PDF Preview"
            width="100%"
            height="600px"
            style={{ border: 'none' }}
          ></iframe>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} as="a" href={downloadUrl}>
            Download
          </Button>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default PdfPreviewModal;