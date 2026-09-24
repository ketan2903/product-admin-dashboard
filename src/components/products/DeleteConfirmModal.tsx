"use client";

import React, { useState } from "react";
import { Product } from "@/types/product";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  product: Product | null;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  product,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!product) return null;

  const handleConfirm = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="flex flex-col items-center text-center p-2">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Delete Product</h3>
        <p className="text-sm text-gray-500 mt-2 mb-6 leading-relaxed">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-900">"{product.title}"</span>? This action will
          remove it from your product list.
        </p>

        <div className="flex items-center justify-center gap-3 w-full">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            isLoading={isDeleting}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
