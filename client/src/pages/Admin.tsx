import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Users, Video, Mic, Settings, Plus, Upload } from "lucide-react";

export default function Admin() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Navbar />
      
      <main className="pt-32 pb-24 container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary">Ministry Dashboard</h1>
            <p className="text-muted-foreground">Manage your content, events, and registrations.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline"><Settings className="w-4 h-4 mr-2" /> Settings</Button>
             <Button className="bg-primary text-white"><Plus className="w-4 h-4 mr-2" /> New Content</Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">12.4K</div>
               <p className="text-xs text-green-600">+12% from last month</p>
             </CardContent>
           </Card>
           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Podcast Listens</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">3.8K</div>
               <p className="text-xs text-green-600">+8% from last month</p>
             </CardContent>
           </Card>
           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Registrations</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">156</div>
               <p className="text-xs text-muted-foreground">Active participants</p>
             </CardContent>
           </Card>
           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Events</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">4</div>
               <p className="text-xs text-muted-foreground">Next: Proskuneo (Dec 7)</p>
             </CardContent>
           </Card>
        </div>

        <Tabs defaultValue="videos" className="space-y-6">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="videos">Videos & Podcasts</TabsTrigger>
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
                <CardDescription>Add new YouTube videos or Spotify podcast episodes here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4 border p-4 rounded-lg">
                       <div className="flex items-center gap-2 text-primary mb-2">
                          <Video className="w-5 h-5" />
                          <h3 className="font-semibold">Add YouTube Video</h3>
                       </div>
                       <div className="space-y-2">
                          <label className="text-sm font-medium">Video URL or ID</label>
                          <div className="flex gap-2">
                             <Input placeholder="e.g. https://youtube.com/watch?v=..." />
                             <Button size="icon"><Plus className="w-4 h-4" /></Button>
                          </div>
                          <p className="text-xs text-muted-foreground">The system will automatically fetch the thumbnail and title.</p>
                       </div>
                    </div>

                    <div className="space-y-4 border p-4 rounded-lg">
                       <div className="flex items-center gap-2 text-primary mb-2">
                          <Mic className="w-5 h-5" />
                          <h3 className="font-semibold">Update Podcast Feed</h3>
                       </div>
                       <div className="space-y-2">
                          <label className="text-sm font-medium">Spotify Show ID</label>
                          <div className="flex gap-2">
                             <Input placeholder="e.g. 3IMVvqqgDu32UUzue8AM5k" defaultValue="3IMVvqqgDu32UUzue8AM5k" />
                             <Button size="icon"><Upload className="w-4 h-4" /></Button>
                          </div>
                          <p className="text-xs text-muted-foreground">Updating this ID will change the embedded player on the site.</p>
                       </div>
                    </div>
                 </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="registrations">
            <Card>
              <CardHeader>
                <CardTitle>Program Registrations</CardTitle>
                <CardDescription>View and manage sign-ups for your ministries.</CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="bg-secondary/20 p-8 text-center rounded-lg border border-dashed">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">Connect a Database</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                       To view real registration data, this dashboard needs to be connected to a backend database (like PostgreSQL on Replit).
                    </p>
                    <Button>Upgrade to Full Stack</Button>
                 </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
      </main>
      <Footer />
    </div>
  );
}
