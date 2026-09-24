"use client";

import React, { useState, useEffect } from "react";
import { Category, Product, ProductFormData } from "@/types/product";
import { Modal } from "@/components/common/Modal";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  initialData?: Product | null;
  categories: Category[];
}

interface FormErrors {
  title?: string;
  description?: string;
  category?: string;
  price?: string;
  stock?: string;
}

export function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories,
}: ProductFormModalProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    description: "",
    category: "",
    price: 0,
    discountPercentage: 0,
    rating: 4.5,
    stock: 10,
    brand: "",
    thumbnail: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        category: initialData.category || "",
        price: initialData.price || 0,
        discountPercentage: initialData.discountPercentage || 0,
        rating: initialData.rating || 4.5,
        stock: initialData.stock || 0,
        brand: initialData.brand || "",
        thumbnail: initialData.thumbnail || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        category: categories[0]?.slug || "beauty",
        price: 99.99,
        discountPercentage: 0,
        rating: 4.5,
        stock: 25,
        brand: "",
        thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
      });
    }
    setErrors({});
  }, [initialData, categories, isOpen]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Product title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Product description is required";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (formData.price === undefined || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (formData.stock === undefined || isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = "Stock cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        discountPercentage: Number(formData.discountPercentage) || 0,
        rating: Number(formData.rating) || 4.5,
        thumbnail:
          formData.thumbnail.trim() ||
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
      });
      onClose();
    } catch {
      // Error handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Product" : "Add New Product"}
      description={
        initialData
          ? "Update product specifications and inventory"
          : "Fill in the details to list a new product in the dashboard"
      }
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Product Title *"
          placeholder="e.g. Wireless Noise Canceling Headphones"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={errors.title}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Brand"
            placeholder="e.g. Sony, Apple, Nike"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1.5 text-xs text-rose-600">{errors.category}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Price ($) *"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="99.99"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            error={errors.price}
          />

          <Input
            label="Discount (%)"
            type="number"
            step="0.1"
            min="0"
            max="100"
            placeholder="10"
            value={formData.discountPercentage}
            onChange={(e) =>
              setFormData({ ...formData, discountPercentage: parseFloat(e.target.value) })
            }
          />

          <Input
            label="Stock Quantity *"
            type="number"
            min="0"
            placeholder="50"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value, 10) })}
            error={errors.stock}
          />
        </div>

        <Input
          label="Thumbnail Image URL"
          placeholder="https://example.com/image.jpg"
          value={formData.thumbnail}
          onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
          helperText="Leave empty to use a high-quality default product image"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Description *
          </label>
          <textarea
            rows={3}
            placeholder="Detailed description of features, materials, and warranty..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          {errors.description && (
            <p className="mt-1.5 text-xs text-rose-600">{errors.description}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="secondary" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isSubmitting}>
            {initialData ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
