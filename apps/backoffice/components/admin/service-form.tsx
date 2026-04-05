"use client";

/**
 * Service Form Component
 *
 * Form for creating and editing services with all fields
 * Supports tabs for organizing the many fields
 */

import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { EnhancedImageUploader } from "@/components/ui/image-upload/enhanced-image-uploader";
import type { UploadedImage } from "@/lib/image-upload/types";
import { toast } from "sonner";
import { serviceCreateSchema, serviceUpdateSchema } from "@/lib/services/validations";
import { ServiceStatus } from "@/lib/services/types";
import type { ServiceInput, ServiceUpdateInput } from "@/lib/services/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Add01Icon, Delete01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface FAQ {
  question: string;
  answer: string;
}

interface DownloadForm {
  type: "file" | "url";
  name: string;
  value: string;
  fileId?: string;
}

interface ServiceFormProps {
  mode: "create" | "edit";
  initialData?: Partial<ServiceInput> | Partial<ServiceUpdateInput>;
  onSubmit: (data: ServiceInput | ServiceUpdateInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  categories: Array<{ id: string; name: string; slug: string }>;
}

export function ServiceForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  categories,
}: ServiceFormProps) {
  const schema = mode === "create" ? serviceCreateSchema : serviceUpdateSchema;

  // State for image uploader (manages full UploadedImage objects)
  const [images, setImages] = useState<UploadedImage[]>([]);

  const form = useForm<ServiceInput | ServiceUpdateInput>({
    resolver: zodResolver(schema) as any,
    mode: "onSubmit",
    defaultValues: initialData || {
      slug: "",
      icon: "",
      name: "",
      description: "",
      categoryId: "",
      showInMenu: true,
      order: 0,
      isIntegrated: false,
      status: "DRAFT",
      requirements: [],
      process: [],
      faqs: [],
      downloadForms: [],
      relatedServices: [],
      imageIds: [],
    },
  });

  // Field arrays for dynamic fields - use any to work with union type
  const requirementsArray = useFieldArray({
    control: form.control,
    name: "requirements" as any,
  });

  const processArray = useFieldArray({
    control: form.control,
    name: "process" as any,
  });

  const faqsArray = useFieldArray({
    control: form.control,
    name: "faqs" as any,
  });

  const downloadFormsArray = useFieldArray({
    control: form.control,
    name: "downloadForms" as any,
  });

  // Sync images state with form's imageIds
  useEffect(() => {
    const imageIds = images
      .filter(img => img.status === 'success' && img.serverResponse?.id)
      .map(img => img.serverResponse!.id);
    form.setValue('imageIds', imageIds);
  }, [images, form]);

  // Reset form when initialData changes
  useEffect(() => {
    console.log("initialData changed:", initialData);
    if (initialData) {
      console.log("Resetting form with initialData");
      form.reset(initialData);

      // Load existing images in edit mode
      const existingImageIds = (initialData as any).imageIds || [];
      if (existingImageIds.length > 0) {
        // Convert image IDs to UploadedImage objects
        const uploadedImages: UploadedImage[] = existingImageIds.map((id: string) => ({
          id,
          file: new File([], ""), // Empty file for existing images
          preview: "", // Will be loaded from server
          status: 'success',
          progress: 100,
          serverResponse: {
            id,
            cdnUrl: '',
            serveUrl: '',
          },
        }));
        setImages(uploadedImages);
      } else {
        setImages([]);
      }
    }
  }, [initialData, form]);

  const handleSubmit = async (data: any) => {
    console.log("handleSubmit called with data:", data);
    try {
      await onSubmit(data);
      console.log("onSubmit completed successfully");
    } catch (error) {
      console.error("Submit error:", error);
      throw error;
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("Form submit event triggered");
        console.log("Form errors:", form.formState.errors);
        console.log("Form is valid:", form.formState.isValid);

        form.handleSubmit(handleSubmit)(e).catch((err) => {
          console.error("handleSubmit error:", err);
        });
      }}
      className="space-y-6"
    >
      <Tabs defaultValue="basic" className="w-full space-y-6">
        {/* Tabs List */}
        <TabsList className="w-full flex flex-row flex-wrap justify-start bg-muted/50 p-1 rounded-lg gap-1">
          <TabsTrigger value="basic" className="flex-1 min-w-max data-active:bg-background data-active:text-foreground">
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="details" className="flex-1 min-w-max data-active:bg-background data-active:text-foreground">
            Details
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex-1 min-w-max data-active:bg-background data-active:text-foreground">
            Contact
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex-1 min-w-max data-active:bg-background data-active:text-foreground">
            Advanced
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <div className="w-full">
          {/* Basic Info Tab */}
          <TabsContent value="basic" className="mt-0">
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="name">Service Name *</FieldLabel>
                <FieldContent>
                  <Input
                    id="name"
                    placeholder="e.g., E-KTP"
                    {...form.register("name")}
                    disabled={isLoading}
                  />
                </FieldContent>
                <FieldError errors={form.formState.errors.name ? [form.formState.errors.name] : undefined} />
              </Field>

              <Field>
                <FieldLabel htmlFor="slug">Slug *</FieldLabel>
                <FieldContent>
                  <Input
                    id="slug"
                    placeholder="e-ktp"
                    {...form.register("slug")}
                    disabled={isLoading || mode === "edit"}
                  />
                </FieldContent>
                <FieldError errors={form.formState.errors.slug ? [form.formState.errors.slug] : undefined} />
              </Field>

              <Field>
                <FieldLabel htmlFor="icon">Icon</FieldLabel>
                <FieldContent>
                  <Input
                    id="icon"
                    placeholder="e.g., UserCardIcon"
                    {...form.register("icon")}
                    disabled={isLoading}
                  />
                </FieldContent>
                <FieldError errors={form.formState.errors.icon ? [form.formState.errors.icon] : undefined} />
              </Field>

              <Field>
                <FieldLabel htmlFor="categoryId">Category *</FieldLabel>
                <FieldContent>
                  <Select
                    onValueChange={(value) => form.setValue("categoryId", value)}
                    value={form.watch("categoryId")}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldContent>
                <FieldError
                  errors={form.formState.errors.categoryId ? [form.formState.errors.categoryId] : undefined}
                />
              </Field>
            </div>

            <Field>
              <FieldLabel>Images</FieldLabel>
              <FieldContent>
                <EnhancedImageUploader
                  value={images}
                  onChange={setImages}
                  multiple={true}
                  category="SERVICES"
                />
              </FieldContent>
              <p className="text-xs text-muted-foreground mt-1">
                Upload up to 10 images. Max 5MB per image. Images will be auto-compressed.
              </p>
              <FieldError
                errors={form.formState.errors.imageIds ? [form.formState.errors.imageIds] : undefined}
              />
            </Field>


            <Field>
              <FieldLabel htmlFor="description">Description *</FieldLabel>
              <FieldContent>
                <Textarea
                  id="description"
                  placeholder="Brief description of the service"
                  rows={2}
                  {...form.register("description")}
                  disabled={isLoading}
                />
              </FieldContent>
              <FieldError
                errors={form.formState.errors.description ? [form.formState.errors.description] : undefined}
              />
            </Field>

            <div className="grid grid-cols-3 gap-4">
              <Field>
                <FieldLabel htmlFor="badge">Badge</FieldLabel>
                <FieldContent>
                  <Input
                    id="badge"
                    placeholder="e.g., Popular"
                    {...form.register("badge")}
                    disabled={isLoading}
                  />
                </FieldContent>
                <FieldError errors={form.formState.errors.badge ? [form.formState.errors.badge] : undefined} />
              </Field>

              <Field>
                <FieldLabel htmlFor="stats">Stats</FieldLabel>
                <FieldContent>
                  <Input
                    id="stats"
                    placeholder="e.g., 10k+ users"
                    {...form.register("stats")}
                    disabled={isLoading}
                  />
                </FieldContent>
                <FieldError errors={form.formState.errors.stats ? [form.formState.errors.stats] : undefined} />
              </Field>

              <Field>
                <FieldLabel htmlFor="order">Display Order</FieldLabel>
                <FieldContent>
                  <Input
                    id="order"
                    type="number"
                    {...form.register("order", { valueAsNumber: true })}
                    disabled={isLoading}
                  />
                </FieldContent>
                <FieldError errors={form.formState.errors.order ? [form.formState.errors.order] : undefined} />
              </Field>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showInMenu"
                  checked={form.watch("showInMenu")}
                  onCheckedChange={(checked) => form.setValue("showInMenu", checked as boolean)}
                  disabled={isLoading}
                />
                <label htmlFor="showInMenu" className="text-sm font-medium">
                  Show in Menu
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isIntegrated"
                  checked={form.watch("isIntegrated")}
                  onCheckedChange={(checked) => form.setValue("isIntegrated", checked as boolean)}
                  disabled={isLoading}
                />
                <label htmlFor="isIntegrated" className="text-sm font-medium">
                  Integrated Service
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="statusPublished"
                  checked={form.watch("status") === "PUBLISHED"}
                  onCheckedChange={(checked) =>
                    form.setValue("status", checked ? "PUBLISHED" : "DRAFT")
                  }
                  disabled={isLoading}
                />
                <label htmlFor="statusPublished" className="text-sm font-medium">
                  Published
                </label>
              </div>
            </div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="mt-0">
            <Field>
              <FieldLabel htmlFor="detailedDescription">Detailed Description</FieldLabel>
              <FieldContent>
                <Textarea
                  id="detailedDescription"
                  placeholder="Full description of the service"
                  rows={4}
                  {...form.register("detailedDescription")}
                  disabled={isLoading}
                />
              </FieldContent>
              <FieldError
                errors={
                  form.formState.errors.detailedDescription
                    ? [form.formState.errors.detailedDescription]
                    : undefined
                }
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="duration">Duration</FieldLabel>
                <FieldContent>
                  <Input
                    id="duration"
                    placeholder="e.g., 1-2 days"
                    {...form.register("duration")}
                    disabled={isLoading}
                  />
                </FieldContent>
                <FieldError
                  errors={form.formState.errors.duration ? [form.formState.errors.duration] : undefined}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="cost">Cost</FieldLabel>
                <FieldContent>
                  <Input
                    id="cost"
                    placeholder="e.g., Free or Rp 50.000"
                    {...form.register("cost")}
                    disabled={isLoading}
                  />
                </FieldContent>
                <FieldError errors={form.formState.errors.cost ? [form.formState.errors.cost] : undefined} />
              </Field>
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FieldLabel>Requirements</FieldLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => requirementsArray.append("" as any)}
                >
                  <HugeiconsIcon icon={Add01Icon} className="h-4 w-4 mr-1" />
                  Add Requirement
                </Button>
              </div>
              <div className="space-y-2">
                {requirementsArray.fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <Input
                      {...form.register(`requirements.${index}`)}
                      placeholder="e.g., KTP asli"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => requirementsArray.remove(index)}
                      disabled={isLoading}
                    >
                      <HugeiconsIcon icon={Delete01Icon} className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Process Steps */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FieldLabel>Process Steps</FieldLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => processArray.append("" as any)}
                >
                  <HugeiconsIcon icon={Add01Icon} className="h-4 w-4 mr-1" />
                  Add Step
                </Button>
              </div>
              <div className="space-y-2">
                {processArray.fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <Input
                      {...form.register(`process.${index}`)}
                      placeholder={`Step ${index + 1}`}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => processArray.remove(index)}
                      disabled={isLoading}
                    >
                      <HugeiconsIcon icon={Delete01Icon} className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="mt-0">
            <Field>
              <FieldLabel htmlFor="contactOffice">Office Name</FieldLabel>
              <FieldContent>
                <Input
                  id="contactOffice"
                  placeholder="e.g., Dinas Kependudukan"
                  {...form.register("contactInfo.office")}
                  disabled={isLoading}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="contactPhone">Phone</FieldLabel>
              <FieldContent>
                <Input
                  id="contactPhone"
                  placeholder="e.g., (021) 1234-5678"
                  {...form.register("contactInfo.phone")}
                  disabled={isLoading}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="contactEmail">Email</FieldLabel>
              <FieldContent>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="e.g., layanan@example.com"
                  {...form.register("contactInfo.email")}
                  disabled={isLoading}
                />
              </FieldContent>
            </Field>

            {/* FAQs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FieldLabel>FAQs</FieldLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => faqsArray.append({ question: "", answer: "" } as any)}
                >
                  <HugeiconsIcon icon={Add01Icon} className="h-4 w-4 mr-1" />
                  Add FAQ
                </Button>
              </div>
              <div className="space-y-4">
                {faqsArray.fields.map((field, index) => (
                  <div key={field.id} className="space-y-2 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">FAQ {index + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => faqsArray.remove(index)}
                        disabled={isLoading}
                      >
                        <HugeiconsIcon icon={Delete01Icon} className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      {...form.register(`faqs.${index}.question`)}
                      placeholder="Question"
                      disabled={isLoading}
                    />
                    <Textarea
                      {...form.register(`faqs.${index}.answer`)}
                      placeholder="Answer"
                      rows={2}
                      disabled={isLoading}
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="mt-0">
            {/* Download Forms */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FieldLabel>Download Forms</FieldLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => downloadFormsArray.append({ type: "url", name: "", value: "" } as any)}
                >
                  <HugeiconsIcon icon={Add01Icon} className="h-4 w-4 mr-1" />
                  Add Form
                </Button>
              </div>
              <div className="space-y-2">
                {downloadFormsArray.fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-start p-4 border rounded-lg">
                    <Select
                      onValueChange={(value: "file" | "url") =>
                        form.setValue(`downloadForms.${index}.type`, value)
                      }
                      value={form.watch(`downloadForms.${index}.type`)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="url">URL</SelectItem>
                        <SelectItem value="file">File</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      {...form.register(`downloadForms.${index}.name`)}
                      placeholder="Form name"
                      disabled={isLoading}
                    />
                    <Input
                      {...form.register(`downloadForms.${index}.value`)}
                      placeholder={form.watch(`downloadForms.${index}.type`) === "url" ? "URL" : "File ID"}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => downloadFormsArray.remove(index)}
                      disabled={isLoading}
                    >
                      <HugeiconsIcon icon={Delete01Icon} className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Services */}
            <Field>
              <FieldLabel>Related Services</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="Comma-separated service IDs (to be implemented with selector)"
                  {...form.register("relatedServices")}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter service IDs separated by commas
                </p>
              </FieldContent>
            </Field>
          </TabsContent>
        </div>
      </Tabs>

      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : mode === "create" ? "Create Service" : "Update Service"}
        </Button>
      </div>
    </form>
  );
}
