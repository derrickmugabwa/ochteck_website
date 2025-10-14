"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Page {
  id: string;
  slug: string;
  title: string;
  content: unknown;
  status: "draft" | "published";
  updated_at: string;
}

export default function PagesPage() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  const { data: pages, isLoading } = useQuery({
    queryKey: ["pages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data as Page[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("pages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const newStatus = status === "published" ? "draft" : "published";
      const { error } = await supabase
        .from("pages")
        .update({ status: newStatus })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pages</h1>
          <p className="text-muted-foreground mt-2">
            Manage your website pages and content
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Page
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="space-y-4">
          {pages?.map((page) => (
            <Card key={page.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{page.title}</span>
                    <Badge
                      variant={
                        page.status === "published" ? "default" : "secondary"
                      }
                    >
                      {page.status}
                    </Badge>
                  </div>
                  <div className="text-sm font-normal text-muted-foreground">
                    /{page.slug}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Last updated:{" "}
                  {new Date(page.updated_at).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      toggleStatusMutation.mutate({
                        id: page.id,
                        status: page.status,
                      })
                    }
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    {page.status === "published" ? "Unpublish" : "Publish"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to delete this page?")
                      ) {
                        deleteMutation.mutate(page.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {pages?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No pages yet. Create your first page to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
