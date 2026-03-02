/**
 * Edit Service Client Component
 *
 * Full-page form for editing an existing service
 */

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { serviceUpdateSchema } from "@/lib/services/validations";
import type { ServiceUpdateInput } from "@/lib/services/validations";
import { ServiceStatus } from "@/lib/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, ArrowLeft, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Service {
  id: string;
  slug: string;
  icon: string;
  name: string;
  description: string;
  categoryId: string;
  badge?: string | null;
  stats?: string | null;
  showInMenu: boolean;
  order: number;
  isIntegrated: boolean;
  detailedDescription?: string | null;
  requirements?: string[] | null;
  process?: string[] | null;
  duration?: string | null;
  cost?: string | null;
  contactInfo?: {
    office: string;
    phone: string;
    email: string;
  } | null;
  faqs?: {
    question: string;
    answer: string;
  }[] | null;
  downloadForms?: {
    type: "file" | "url";
    name: string;
    value: string;
    fileId?: string;
  }[] | null;
  relatedServices?: string[] | null;
  status: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface EditServiceContentProps {
  serviceId: string;
  initialService: Service;
  categories: Category[];
}

export function EditServiceContent({ serviceId, initialService, categories }: EditServiceContentProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const form = useForm<ServiceUpdateInput>({
    resolver: zodResolver(serviceUpdateSchema) as any,
    mode: "onBlur",
    defaultValues: {
      slug: initialService.slug,
      icon: initialService.icon,
      name: initialService.name,
      description: initialService.description,
      categoryId: initialService.categoryId,
      badge: initialService.badge ?? "",
      stats: initialService.stats ?? "",
      showInMenu: initialService.showInMenu,
      order: initialService.order,
      isIntegrated: initialService.isIntegrated,
      status: initialService.status as ServiceStatus,
      detailedDescription: initialService.detailedDescription ?? "",
      duration: initialService.duration ?? "",
      cost: initialService.cost ?? "",
      requirements: initialService.requirements ?? [],
      process: initialService.process ?? [],
      contactInfo: initialService.contactInfo ?? {
        office: "",
        phone: "",
        email: "",
      },
      faqs: initialService.faqs ?? [],
      downloadForms: initialService.downloadForms ?? [],
      relatedServices: initialService.relatedServices ?? [],
    },
  });

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

  const { errors } = form.formState;

  const handleSubmit = async (data: ServiceUpdateInput) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update service");
      }

      toast.success("Service updated successfully");
      router.push("/services");
      router.refresh();
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update service");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors: any) => {
    console.error("Form validation errors:", errors);
    toast.error("Please fix the errors in the form");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Service</h1>
            <p className="text-muted-foreground">Update service details for {initialService.name}</p>
          </div>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit as any, onError)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic" className="data-[state=active]:bg-background">
              Basic
            </TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-background">
              Details
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-background">
              Contact
            </TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-background">
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Required information for the service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Service Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g., E-KTP"
                      {...form.register("name")}
                      className={cn(errors.name && "border-destructive")}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">
                      Slug <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="slug"
                      value={form.watch("slug")}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">Slug cannot be changed after creation</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="categoryId">
                      Category <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      onValueChange={(value) => form.setValue("categoryId", value)}
                      value={form.watch("categoryId")}
                    >
                      <SelectTrigger className={cn(errors.categoryId && "border-destructive")}>
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
                    {errors.categoryId && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.categoryId.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="icon">
                      Icon Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="icon"
                      placeholder="e.g., User, FileText, Settings"
                      {...form.register("icon")}
                      className={cn(errors.icon && "border-destructive")}
                    />
                    {errors.icon && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.icon.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">Lucide icon name</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the service (shown in cards)"
                    rows={3}
                    {...form.register("description")}
                    className={cn(errors.description && "border-destructive resize-none")}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="badge">Badge</Label>
                    <Input
                      id="badge"
                      placeholder="e.g., Popular"
                      {...form.register("badge")}
                    />
                    <p className="text-xs text-muted-foreground">Optional badge label</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stats">Stats Label</Label>
                    <Input
                      id="stats"
                      placeholder="e.g., 10k+ users"
                      {...form.register("stats")}
                    />
                    <p className="text-xs text-muted-foreground">Optional stats</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="order">Display Order</Label>
                    <Input
                      id="order"
                      type="number"
                      min="0"
                      {...form.register("order", { valueAsNumber: true })}
                    />
                    <p className="text-xs text-muted-foreground">Default: 0</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      onValueChange={(value: "DRAFT" | "PUBLISHED" | "ARCHIVED") =>
                        form.setValue("status", value)
                      }
                      value={form.watch("status")}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showInMenu"
                      checked={form.watch("showInMenu")}
                      onCheckedChange={(checked) => form.setValue("showInMenu", checked as boolean)}
                    />
                    <label htmlFor="showInMenu" className="text-sm font-medium cursor-pointer flex items-center gap-1">
                      {form.watch("showInMenu") ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      Show in Menu
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isIntegrated"
                      checked={form.watch("isIntegrated")}
                      onCheckedChange={(checked) => form.setValue("isIntegrated", checked as boolean)}
                    />
                    <label htmlFor="isIntegrated" className="text-sm font-medium cursor-pointer">
                      Integrated Service
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Information</CardTitle>
                <CardDescription>Additional details shown on the service page</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="detailedDescription">Full Description</Label>
                  <Textarea
                    id="detailedDescription"
                    placeholder="Complete description of the service"
                    rows={5}
                    {...form.register("detailedDescription")}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">Optional - shown on service detail page</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Processing Time</Label>
                    <Input
                      id="duration"
                      placeholder="e.g., 1-2 working days"
                      {...form.register("duration")}
                    />
                    <p className="text-xs text-muted-foreground">Optional</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost</Label>
                    <Input
                      id="cost"
                      placeholder="e.g., Free or Rp 50.000"
                      {...form.register("cost")}
                    />
                    <p className="text-xs text-muted-foreground">Optional</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Requirements</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => requirementsArray.append("" as any)}
                      className="gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {requirementsArray.fields.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">No requirements added</p>
                    ) : (
                      requirementsArray.fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2">
                          <Input
                            {...form.register(`requirements.${index}`)}
                            placeholder="e.g., Original KTP"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => requirementsArray.remove(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Process Steps</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => processArray.append("" as any)}
                      className="gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {processArray.fields.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">No steps added</p>
                    ) : (
                      processArray.fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2">
                          <div className="flex items-center justify-center w-8 h-10 rounded-md bg-muted text-sm font-medium shrink-0">
                            {index + 1}
                          </div>
                          <Input
                            {...form.register(`process.${index}`)}
                            placeholder="Describe this step"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => processArray.remove(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Office contact details for this service (optional)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactOffice">Office Name</Label>
                    <Input
                      id="contactOffice"
                      placeholder="e.g., Dinas Kependudukan"
                      {...form.register("contactInfo.office")}
                    />
                    <p className="text-xs text-muted-foreground">Optional</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Phone Number</Label>
                    <Input
                      id="contactPhone"
                      placeholder="e.g., (021) 1234-5678"
                      {...form.register("contactInfo.phone")}
                    />
                    <p className="text-xs text-muted-foreground">Optional</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email Address</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="e.g., layanan@example.com"
                      {...form.register("contactInfo.email")}
                    />
                    {errors.contactInfo?.email && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.contactInfo.email.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">Optional</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>Add common questions about this service</CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => faqsArray.append({ question: "", answer: "" } as any)}
                    className="gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add FAQ
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqsArray.fields.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic py-4">No FAQs added</p>
                ) : (
                  faqsArray.fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">FAQ {index + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => faqsArray.remove(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Input
                          {...form.register(`faqs.${index}.question`)}
                          placeholder="Question"
                        />
                        <Textarea
                          {...form.register(`faqs.${index}.answer`)}
                          placeholder="Answer"
                          rows={2}
                          className="resize-none"
                        />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Download Forms</CardTitle>
                <CardDescription>Add downloadable forms or links related to this service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => downloadFormsArray.append({ type: "url", name: "", value: "" } as any)}
                    className="gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add Form
                  </Button>
                  <div className="space-y-2">
                    {downloadFormsArray.fields.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">No forms added</p>
                    ) : (
                      downloadFormsArray.fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 items-start p-4 border rounded-lg">
                          <Select
                            onValueChange={(value: "file" | "url") =>
                              form.setValue(`downloadForms.${index}.type`, value)
                            }
                            value={form.watch(`downloadForms.${index}.type`)}
                          >
                            <SelectTrigger className="w-28">
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
                            className="flex-1"
                          />
                          <Input
                            {...form.register(`downloadForms.${index}.value`)}
                            placeholder={form.watch(`downloadForms.${index}.type`) === "url" ? "https://..." : "File ID"}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => downloadFormsArray.remove(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Related Services</CardTitle>
                <CardDescription>Link to other related services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="relatedServices">Related Service IDs</Label>
                  <Input
                    id="relatedServices"
                    placeholder="e.g., service-id-1, service-id-2"
                    {...form.register("relatedServices")}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter comma-separated service IDs (this feature will be improved with a service selector)
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-end gap-3 p-4 bg-muted/50 rounded-lg border sticky bottom-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Update Service
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
