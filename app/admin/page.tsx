import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Briefcase, MessageSquare, TrendingUp, Image, Menu, Layout } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch stats
  const [servicesResult, testimonialsResult, pagesResult] = await Promise.all([
    supabase.from("services").select("*", { count: "exact", head: true }),
    supabase.from("testimonials").select("*", { count: "exact", head: true }),
    supabase.from("pages").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    {
      title: "Total Services",
      value: servicesResult.count || 0,
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Testimonials",
      value: testimonialsResult.count || 0,
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Pages",
      value: pagesResult.count || 0,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Views",
      value: "12.5K",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's an overview of your website.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="/admin/navbar"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <Menu className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium">Manage Navbar</div>
                <div className="text-xs text-muted-foreground">
                  Customize logo, menu items, and CTA button
                </div>
              </div>
            </a>
            <a
              href="/admin/footer"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <Layout className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium">Manage Footer</div>
                <div className="text-xs text-muted-foreground">
                  Update footer links and social media
                </div>
              </div>
            </a>
            <a
              href="/admin/hero"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <Image className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium">Manage Hero Section</div>
                <div className="text-xs text-muted-foreground">
                  Update homepage hero content and image
                </div>
              </div>
            </a>
            <a
              href="/admin/services"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <Briefcase className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium">Manage Services</div>
                <div className="text-xs text-muted-foreground">
                  Add, edit, or remove services
                </div>
              </div>
            </a>
            <a
              href="/admin/testimonials"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <MessageSquare className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium">Manage Testimonials</div>
                <div className="text-xs text-muted-foreground">
                  Update client testimonials
                </div>
              </div>
            </a>
            <a
              href="/admin/pages"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium">Edit Pages</div>
                <div className="text-xs text-muted-foreground">
                  Modify page content
                </div>
              </div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div>
                  <div className="font-medium">Service updated</div>
                  <div className="text-xs text-muted-foreground">
                    Web Development - 2 hours ago
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div>
                  <div className="font-medium">New testimonial added</div>
                  <div className="text-xs text-muted-foreground">
                    Sarah Johnson - 5 hours ago
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2" />
                <div>
                  <div className="font-medium">Page published</div>
                  <div className="text-xs text-muted-foreground">
                    About page - Yesterday
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
