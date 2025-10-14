"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Eye, EyeOff, Save, Mail, Clock, CheckCircle, Archive } from "lucide-react";
import { useState } from "react";

interface ContactInfo {
  id: string;
  email: string;
  phone?: string;
  location?: string;
  business_hours?: string;
  response_time_text?: string;
  is_active: boolean;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order_index: number;
  visible: boolean;
}

interface Submission {
  id: string;
  name: string;
  email: string;
  service?: string;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  notes?: string;
  created_at: string;
}

export default function ContactAdminPage() {
  const [activeTab, setActiveTab] = useState<"info" | "faqs" | "submissions">("info");
  const [contactData, setContactData] = useState<Partial<ContactInfo>>({});
  const [newFaq, setNewFaq] = useState({ question: "", answer: "", order_index: 0 });
  const queryClient = useQueryClient();
  const supabase = createClient();

  // Fetch contact info
  const { data: contactInfo } = useQuery({
    queryKey: ["contact-info"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_info")
        .select("*")
        .eq("is_active", true)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) setContactData(data);
      return data as ContactInfo | null;
    },
  });

  // Fetch FAQs
  const { data: faqs } = useQuery({
    queryKey: ["contact-faqs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_faqs")
        .select("*")
        .order("order_index");
      if (error) throw error;
      return data as FAQ[];
    },
  });

  // Fetch submissions
  const { data: submissions } = useQuery({
    queryKey: ["contact-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Submission[];
    },
  });

  // Save contact info
  const saveContactInfoMutation = useMutation({
    mutationFn: async () => {
      if (contactInfo?.id) {
        const { error } = await supabase
          .from("contact_info")
          .update(contactData)
          .eq("id", contactInfo.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("contact_info")
          .insert([{ ...contactData, is_active: true }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-info"] });
      alert("Contact info saved!");
    },
  });

  // Add FAQ
  const addFaqMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("contact_faqs")
        .insert([newFaq]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-faqs"] });
      setNewFaq({ question: "", answer: "", order_index: 0 });
    },
  });

  // Delete FAQ
  const deleteFaqMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("contact_faqs")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-faqs"] });
    },
  });

  // Toggle FAQ visibility
  const toggleFaqVisibilityMutation = useMutation({
    mutationFn: async ({ id, visible }: { id: string; visible: boolean }) => {
      const { error } = await supabase
        .from("contact_faqs")
        .update({ visible: !visible })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-faqs"] });
    },
  });

  // Update submission status
  const updateSubmissionStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-submissions"] });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "read": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "replied": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "archived": return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      default: return "";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contact Page Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage contact information, FAQs, and form submissions
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("info")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "info"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Contact Info
        </button>
        <button
          onClick={() => setActiveTab("faqs")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "faqs"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          FAQs
        </button>
        <button
          onClick={() => setActiveTab("submissions")}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === "submissions"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Submissions
          {submissions && submissions.filter(s => s.status === "new").length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {submissions.filter(s => s.status === "new").length}
            </span>
          )}
        </button>
      </div>

      {/* Contact Info Tab */}
      {activeTab === "info" && (
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email *</label>
                <input
                  type="email"
                  value={contactData.email || ""}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="contact@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <input
                  type="text"
                  value={contactData.phone || ""}
                  onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <textarea
                value={contactData.location || ""}
                onChange={(e) => setContactData({ ...contactData, location: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
                rows={2}
                placeholder="San Francisco, CA&#10;United States"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Business Hours</label>
              <input
                type="text"
                value={contactData.business_hours || ""}
                onChange={(e) => setContactData({ ...contactData, business_hours: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Mon - Fri: 9:00 AM - 6:00 PM PST"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Response Time Text</label>
              <textarea
                value={contactData.response_time_text || ""}
                onChange={(e) => setContactData({ ...contactData, response_time_text: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
                rows={3}
                placeholder="We typically respond within 24 hours..."
              />
            </div>

            <Button onClick={() => saveContactInfoMutation.mutate()}>
              <Save className="w-4 h-4 mr-2" />
              Save Contact Info
            </Button>
          </CardContent>
        </Card>
      )}

      {/* FAQs Tab */}
      {activeTab === "faqs" && (
        <div className="space-y-6">
          {/* Add New FAQ */}
          <Card>
            <CardHeader>
              <CardTitle>Add New FAQ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Question</label>
                <input
                  type="text"
                  value={newFaq.question}
                  onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="What's your typical project timeline?"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Answer</label>
                <textarea
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  rows={3}
                  placeholder="Most projects take 4-8 weeks..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Order Index</label>
                <input
                  type="number"
                  value={newFaq.order_index}
                  onChange={(e) => setNewFaq({ ...newFaq, order_index: parseInt(e.target.value) })}
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>

              <Button onClick={() => addFaqMutation.mutate()}>
                <Plus className="w-4 h-4 mr-2" />
                Add FAQ
              </Button>
            </CardContent>
          </Card>

          {/* Existing FAQs */}
          <div className="grid gap-4 md:grid-cols-2">
            {faqs?.map((faq) => (
              <Card key={faq.id}>
                <CardHeader>
                  <CardTitle className="flex items-start justify-between text-base">
                    <span>{faq.question}</span>
                    {faq.visible ? (
                      <Eye className="w-4 h-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toggleFaqVisibilityMutation.mutate({
                          id: faq.id,
                          visible: faq.visible,
                        })
                      }
                    >
                      {faq.visible ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this FAQ?")) {
                          deleteFaqMutation.mutate(faq.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Submissions Tab */}
      {activeTab === "submissions" && (
        <div className="space-y-4">
          {submissions?.map((submission) => (
            <Card key={submission.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{submission.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      <Mail className="w-3 h-3 inline mr-1" />
                      {submission.email}
                      {submission.service && ` • ${submission.service}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(submission.status)}`}>
                      {submission.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {new Date(submission.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Message:</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{submission.message}</p>
                </div>

                <div className="flex gap-2">
                  {submission.status === "new" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateSubmissionStatusMutation.mutate({
                          id: submission.id,
                          status: "read",
                        })
                      }
                    >
                      Mark as Read
                    </Button>
                  )}
                  {submission.status === "read" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateSubmissionStatusMutation.mutate({
                          id: submission.id,
                          status: "replied",
                        })
                      }
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Mark as Replied
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateSubmissionStatusMutation.mutate({
                        id: submission.id,
                        status: "archived",
                      })
                    }
                  >
                    <Archive className="w-4 h-4 mr-1" />
                    Archive
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {submissions?.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No submissions yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
