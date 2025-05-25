import React from "react";
import { Modal, Button } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import "./ConfirmDialog.css";

const ConfirmDialog = ({ 
  show, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  size = "md"
}) => {
  return (
    <AnimatePresence>
      {show && (
        <Modal 
          show={show} 
          onHide={onClose} 
          centered 
          size={size}
          className="confirm-dialog"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <Modal.Header closeButton className="border-0">
              <Modal.Title className="fw-bold">{title || "Confirm Action"}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-4">
              <p className="mb-0 text-muted">{message || "Are you sure you want to proceed?"}</p>
            </Modal.Body>
            <Modal.Footer className="border-0">
              <Button 
                variant="light" 
                onClick={onClose}
                className="px-4"
              >
                {cancelText}
              </Button>
              <Button 
                variant={variant} 
                onClick={onConfirm}
                className="px-4"
              >
                {confirmText}
              </Button>
            </Modal.Footer>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
