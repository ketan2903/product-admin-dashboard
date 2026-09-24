"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Category, Product, ProductFormData } from "@/types/product";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { CustomSelect, OptionItem } from "@/components/common/CustomSelect";
import {
  Tag,
  DollarSign,
  Package,
  Percent,
  Image as ImageIcon,
  Sparkles,
  FileText,
  Building2,
  CheckCircle2,
} from "lucide-react";

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
    price: 99.99,
    discountPercentage: 0,
    rating: 4.5,
    stock: 25,
    brand: "",
    thumbnail: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryOptions: OptionItem[] = useMemo(() => {
    return categories.map((cat) => ({
      value: cat.slug,
      label: cat.name,
      icon: <Tag className="w-3.5 h-3.5 text-blue-500" />,
    }));
  }, [categories]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        category: initialData.category || (categories[0]?.slug || "beauty"),
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
        discountPercentage: 10,
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
      newErrors.price = "Price must be greater than $0";
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
      // Error handled by parent ToastContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Product Details" : "Create New Product"}
      description={
        initialData
          ? `Updating "${initialData.title}" in inventory`
          : "Configure product specifications, live pricing, and media"
      }
      icon={
        initialData ? (
          <Sparkles className="w-5 h-5 text-indigo-600" />
        ) : (
          <Package className="w-5 h-5 text-blue-600" />
        )
      }
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Section 1: General Product Information */}
        <div className="space-y-3.5">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>General Information</span>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Product Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Wireless Noise Canceling Headphones"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 text-sm font-semibold rounded-2xl border border-slate-200 bg-slate-50/70 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-900"
            />
            {errors.title && (
              <p className="mt-1.5 text-xs text-rose-600 font-semibold">{errors.title}</p>
            )}
          </div>

          {/* Brand & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Brand / Manufacturer
              </label>
              <div className="relative flex items-center">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Sony, Apple, Nike"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 text-sm font-semibold rounded-2xl border border-slate-200 bg-slate-50/70 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <CustomSelect
                options={categoryOptions}
                value={formData.category}
                onChange={(val) => setFormData({ ...formData, category: val })}
                className="w-full"
                dropdownClassName="w-full"
              />
              {errors.category && (
                <p className="mt-1.5 text-xs text-rose-600 font-semibold">{errors.category}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Inventory */}
        <div className="space-y-3.5 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pricing & Stock Availability</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Price */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Price (USD) <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 font-bold text-slate-400">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="99.99"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full pl-8 pr-4 py-2.5 text-sm font-black rounded-2xl border border-slate-200 bg-slate-50/70 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-900"
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.price}</p>
              )}
            </div>

            {/* Discount */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Discount (%)
              </label>
              <div className="relative flex items-center">
                <Percent className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="10"
                  value={formData.discountPercentage}
                  onChange={(e) =>
                    setFormData({ ...formData, discountPercentage: parseFloat(e.target.value) })
                  }
                  className="w-full pl-9 pr-4 py-2.5 text-sm font-black rounded-2xl border border-slate-200 bg-slate-50/70 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-900"
                />
              </div>
            </div>

            {/* Stock */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Stock Quantity <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Package className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="number"
                  min="0"
                  placeholder="50"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value, 10) })}
                  className="w-full pl-10 pr-4 py-2.5 text-sm font-black rounded-2xl border border-slate-200 bg-slate-50/70 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-900"
                />
              </div>
              {errors.stock && (
                <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.stock}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Media */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
            <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
            <span>Product Media</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Thumbnail Image URL
            </label>
            <div className="relative flex items-center">
              <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 text-xs font-mono rounded-2xl border border-slate-200 bg-slate-50/70 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-900"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Leave empty to use default placeholder image.
            </p>
          </div>
        </div>

        {/* Section 4: Description */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700">
            Product Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="Detailed description of features, materials, warranty, and specifications..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm font-normal text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
          />
          {errors.description && (
            <p className="text-xs text-rose-600 font-semibold">{errors.description}</p>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            variant="secondary"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-2xl px-5 font-bold"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
            className="rounded-2xl px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/25 font-bold"
          >
            {initialData ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

