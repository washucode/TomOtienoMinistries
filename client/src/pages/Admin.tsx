import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Users, Video, Plus, Trash2, Edit, Loader2, Calendar, Settings, Headphones, Lock, LogOut, RefreshCw, Youtube } from "lucide-react";

type Video = {
  id: string;
  title: string;
  videoId: string;
  category: string;
  thumbnail: string;
  duration: string;
  views: string;
  createdAt: string;
};

type Registration = {
  id: string;
  ministryType: string;
  fullName: string;
  email: string;
  phone: string;
  message: string | null;
  createdAt: string;
};

type MinistrySettings = {
  id: string;
  ministryType: string;
  status: string;
  nextSessionDate: string;
  nextSessionTime: string;
  location: string;
  capacity: number;
  currentRegistrations: number;
};

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [addVideoOpen, setAddVideoOpen] = useState(false);
  const [editVideoOpen, setEditVideoOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [editSettingsOpen, setEditSettingsOpen] = useState(false);
  const [editingSettings, setEditingSettings] = useState<MinistrySettings | null>(null);
  const [editRegOpen, setEditRegOpen] = useState(false);
  const [editingReg, setEditingReg] = useState<Registration | null>(null);
  const [filterMinistry, setFilterMinistry] = useState("all");
  const [videoForm, setVideoForm] = useState({
    title: "",
    videoId: "",
    category: "Sermons & Teachings",
    thumbnail: "",
    duration: "",
    views: "0 views"
  });
  const [settingsForm, setSettingsForm] = useState({
    ministryType: "",
    status: "upcoming",
    nextSessionDate: "",
    nextSessionTime: "",
    location: "",
    capacity: 50,
    currentRegistrations: 0,
    startDate: "",
    endDate: "",
    meetingDays: "",
    meetingMode: "In-person",
    spotifyShowId: "",
  });
  const [podcastForm, setPodcastForm] = useState({
    spotifyShowId: "",
    rssUrl: "",
  });
  const [regForm, setRegForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/check");
      const data = await res.json();
      setIsAuthenticated(data.isAuthenticated);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: loginPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsAuthenticated(true);
        setLoginPassword("");
        toast({ title: "Welcome", description: "You are now logged in." });
      } else {
        toast({ title: "Login Failed", description: data.error || "Invalid password", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to login. Please try again.", variant: "destructive" });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      setIsAuthenticated(false);
      toast({ title: "Logged Out", description: "You have been logged out successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to logout.", variant: "destructive" });
    }
  };

  const { data: videos = [], isLoading: videosLoading, isError: videosError } = useQuery<Video[]>({
    queryKey: ["videos"],
    queryFn: async () => {
      const res = await fetch("/api/videos");
      if (!res.ok) throw new Error("Failed to fetch videos");
      return res.json();
    },
  });

  const { data: registrations = [], isLoading: registrationsLoading, isError: registrationsError } = useQuery<Registration[]>({
    queryKey: ["registrations"],
    queryFn: async () => {
      const res = await fetch("/api/registrations");
      if (!res.ok) throw new Error("Failed to fetch registrations");
      return res.json();
    },
  });

  const { data: ministrySettings = [], isLoading: settingsLoading, isError: settingsError } = useQuery<MinistrySettings[]>({
    queryKey: ["ministry-settings"],
    queryFn: async () => {
      const res = await fetch("/api/ministry-settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json();
    },
  });

  const { data: podcastSettings, isLoading: podcastLoading, refetch: refetchPodcast } = useQuery<{ spotifyShowId: string | null; rssUrl: string | null }>({
    queryKey: ["podcast-settings"],
    queryFn: async () => {
      const res = await fetch("/api/site-settings/podcast");
      if (!res.ok) throw new Error("Failed to fetch podcast settings");
      const data = await res.json();
      setPodcastForm({ spotifyShowId: data.spotifyShowId || "", rssUrl: data.rssUrl || "" });
      return data;
    },
  });

  const updatePodcastMutation = useMutation({
    mutationFn: async (settings: typeof podcastForm) => {
      const res = await fetch("/api/site-settings/podcast", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to update podcast settings");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["podcast-settings"] });
      toast({ title: "Podcast Settings Updated", description: "Your podcast settings have been saved." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update podcast settings.", variant: "destructive" });
    },
  });

  const { data: youtubeStatus } = useQuery<{ configured: boolean; message: string }>({
    queryKey: ["youtube-status"],
    queryFn: async () => {
      const res = await fetch("/api/youtube/status");
      if (!res.ok) throw new Error("Failed to check YouTube status");
      return res.json();
    },
  });

  const syncYoutubeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/youtube/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to sync YouTube videos");
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      toast({ 
        title: "YouTube Sync Complete", 
        description: `Added ${data.added} new videos. ${data.skipped} skipped.` 
      });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Sync Failed", 
        description: error.message || "Failed to sync YouTube videos. Check API key.", 
        variant: "destructive" 
      });
    },
  });

  const addVideoMutation = useMutation({
    mutationFn: async (video: typeof videoForm) => {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(video),
      });
      if (!res.ok) throw new Error("Failed to add video");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      setAddVideoOpen(false);
      setVideoForm({ title: "", videoId: "", category: "Sermon", thumbnail: "", duration: "", views: "0 views" });
      toast({ title: "Video Added", description: "The video has been added successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add video.", variant: "destructive" });
    },
  });

  const updateVideoMutation = useMutation({
    mutationFn: async ({ id, ...video }: { id: string } & typeof videoForm) => {
      const res = await fetch(`/api/videos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(video),
      });
      if (!res.ok) throw new Error("Failed to update video");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      setEditVideoOpen(false);
      setEditingVideo(null);
      toast({ title: "Video Updated", description: "The video has been updated successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update video.", variant: "destructive" });
    },
  });

  const deleteVideoMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/videos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete video");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      toast({ title: "Video Deleted", description: "The video has been removed." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete video.", variant: "destructive" });
    },
  });

  const deleteRegistrationMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/registrations/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete registration");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({ queryKey: ["ministry-settings"] });
      toast({ title: "Registration Deleted", description: "The registration has been removed." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete registration.", variant: "destructive" });
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: typeof settingsForm) => {
      const res = await fetch("/api/ministry-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to update settings");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministry-settings"] });
      setEditSettingsOpen(false);
      setEditingSettings(null);
      toast({ title: "Settings Updated", description: "Ministry settings have been updated." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update settings.", variant: "destructive" });
    },
  });

  const updateRegMutation = useMutation({
    mutationFn: async (reg: { id: string; fullName: string; email: string; phone: string; message?: string }) => {
      const res = await fetch(`/api/registrations/${reg.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: reg.fullName, email: reg.email, phone: reg.phone, message: reg.message }),
      });
      if (!res.ok) throw new Error("Failed to update registration");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      setEditRegOpen(false);
      setEditingReg(null);
      toast({ title: "Registration Updated", description: "Registration has been updated." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update registration.", variant: "destructive" });
    },
  });

  const extractVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : url;
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanVideoId = extractVideoId(videoForm.videoId);
    const payload = {
      title: videoForm.title,
      videoId: cleanVideoId,
      category: videoForm.category,
      thumbnail: videoForm.thumbnail || `https://img.youtube.com/vi/${cleanVideoId}/maxresdefault.jpg`,
      duration: videoForm.duration || "0:00",
      views: videoForm.views || "0 views",
    };
    addVideoMutation.mutate(payload);
  };

  const handleEditVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;
    const cleanVideoId = extractVideoId(videoForm.videoId);
    const payload = {
      id: editingVideo.id,
      title: videoForm.title,
      videoId: cleanVideoId,
      category: videoForm.category,
      thumbnail: videoForm.thumbnail || `https://img.youtube.com/vi/${cleanVideoId}/maxresdefault.jpg`,
      duration: videoForm.duration || "0:00",
      views: videoForm.views || "0 views",
    };
    updateVideoMutation.mutate(payload);
  };

  const openEditDialog = (video: Video) => {
    setEditingVideo(video);
    setVideoForm({
      title: video.title,
      videoId: video.videoId,
      category: video.category,
      thumbnail: video.thumbnail || "",
      duration: video.duration || "",
      views: video.views || "0 views",
    });
    setEditVideoOpen(true);
  };

  const openSettingsDialog = (settings: MinistrySettings) => {
    setEditingSettings(settings);
    setSettingsForm({
      ministryType: settings.ministryType,
      status: settings.status,
      nextSessionDate: settings.nextSessionDate || "",
      nextSessionTime: settings.nextSessionTime || "",
      location: settings.location || "",
      capacity: settings.capacity || 50,
      currentRegistrations: settings.currentRegistrations || 0,
      startDate: (settings as any).startDate || "",
      endDate: (settings as any).endDate || "",
      meetingDays: (settings as any).meetingDays || "",
      meetingMode: (settings as any).meetingMode || "In-person",
      spotifyShowId: (settings as any).spotifyShowId || "",
    });
    setEditSettingsOpen(true);
  };

  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate({
      ...settingsForm,
      currentRegistrations: editingSettings?.currentRegistrations || 0,
    });
  };

  const openRegEditDialog = (reg: Registration) => {
    setEditingReg(reg);
    setRegForm({
      fullName: reg.fullName,
      email: reg.email,
      phone: reg.phone,
      message: reg.message || "",
    });
    setEditRegOpen(true);
  };

  const handleUpdateReg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReg) return;
    updateRegMutation.mutate({
      id: editingReg.id,
      ...regForm,
    });
  };

  const filteredRegistrations = filterMinistry === "all" 
    ? registrations 
    : registrations.filter(r => r.ministryType === filterMinistry);

  const totalRegistrations = registrations.length;
  const totalVideos = videos.length;

  const ministryLabels: Record<string, string> = {
    "deal-to-heal": "Deal to Heal",
    "master-class": "Master Class",
    "proskuneo": "Proskuneo",
    "understanding-dreams": "Understanding Dreams",
    "deliverance": "Deliverance",
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background font-sans text-foreground flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background font-sans text-foreground">
        <Navbar />
        <main className="pt-32 pb-24 container mx-auto px-4 flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="font-serif text-2xl">Admin Login</CardTitle>
              <CardDescription>Enter your password to access the dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter admin password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    data-testid="input-admin-password"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-primary text-white" 
                  disabled={loginLoading}
                  data-testid="button-admin-login"
                >
                  {loginLoading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Logging in...</>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Navbar />
      
      <main className="pt-32 pb-24 container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary" data-testid="text-admin-title">Ministry Dashboard</h1>
            <p className="text-muted-foreground">Manage your content, events, and registrations.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              data-testid="button-admin-logout"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          <Dialog open={addVideoOpen} onOpenChange={setAddVideoOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-white" data-testid="button-add-video">
                <Plus className="w-4 h-4 mr-2" /> Add Video
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="font-serif text-xl">Add New Video</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddVideo} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Video Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter video title"
                    value={videoForm.title}
                    onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                    required
                    data-testid="input-video-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="videoId">YouTube URL or Video ID</Label>
                  <Input
                    id="videoId"
                    placeholder="https://youtube.com/watch?v=... or video ID"
                    value={videoForm.videoId}
                    onChange={(e) => setVideoForm({ ...videoForm, videoId: e.target.value })}
                    required
                    data-testid="input-video-id"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={videoForm.category} onValueChange={(val) => setVideoForm({ ...videoForm, category: val })}>
                      <SelectTrigger data-testid="select-video-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sermons & Teachings">Sermons & Teachings</SelectItem>
                        <SelectItem value="Healing & Deliverance">Healing & Deliverance</SelectItem>
                        <SelectItem value="Family">Family</SelectItem>
                        <SelectItem value="Parenting">Parenting</SelectItem>
                        <SelectItem value="Worship">Worship</SelectItem>
                        <SelectItem value="Church">Church</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      placeholder="e.g. 45:30"
                      value={videoForm.duration}
                      onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                      required
                      data-testid="input-video-duration"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail URL (optional)</Label>
                  <Input
                    id="thumbnail"
                    placeholder="https://... (leave empty to auto-generate)"
                    value={videoForm.thumbnail}
                    onChange={(e) => setVideoForm({ ...videoForm, thumbnail: e.target.value })}
                    data-testid="input-video-thumbnail"
                  />
                </div>
                <Button type="submit" className="w-full bg-primary text-white" disabled={addVideoMutation.isPending} data-testid="button-submit-video">
                  {addVideoMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...</> : "Add Video"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Videos</CardTitle>
            </CardHeader>
            <CardContent>
              {videosLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              ) : videosError ? (
                <div className="text-destructive text-sm">Error loading</div>
              ) : (
                <>
                  <div className="text-2xl font-bold" data-testid="text-total-videos">{totalVideos}</div>
                  <p className="text-xs text-muted-foreground">In your library</p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              {registrationsLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              ) : registrationsError ? (
                <div className="text-destructive text-sm">Error loading</div>
              ) : (
                <>
                  <div className="text-2xl font-bold" data-testid="text-total-registrations">{totalRegistrations}</div>
                  <p className="text-xs text-muted-foreground">Across all programs</p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Programs</CardTitle>
            </CardHeader>
            <CardContent>
              {settingsLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              ) : settingsError ? (
                <div className="text-destructive text-sm">Error loading</div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{ministrySettings.filter(m => m.status === "open").length}</div>
                  <p className="text-xs text-muted-foreground">Currently open</p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              {settingsLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              ) : settingsError ? (
                <div className="text-destructive text-sm">Error loading</div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{ministrySettings.filter(m => m.status === "upcoming").length}</div>
                  <p className="text-xs text-muted-foreground">Coming soon</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="videos" className="space-y-6">
          <TabsList className="grid w-full md:w-[600px] grid-cols-4">
            <TabsTrigger value="videos" data-testid="tab-videos">Videos</TabsTrigger>
            <TabsTrigger value="registrations" data-testid="tab-registrations">Registrations</TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
            <TabsTrigger value="podcast" data-testid="tab-podcast">Podcast</TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="space-y-6">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Youtube className="w-6 h-6 text-red-600" />
                  <div className="flex-1">
                    <CardTitle className="text-base">YouTube Auto-Sync</CardTitle>
                    <CardDescription className="text-xs">
                      {youtubeStatus?.configured 
                        ? "Search and import Rev. Tom Otieno videos from YouTube automatically"
                        : "Add YOUTUBE_API_KEY to secrets to enable automatic video import"
                      }
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => syncYoutubeMutation.mutate()}
                    disabled={!youtubeStatus?.configured || syncYoutubeMutation.isPending}
                    className="bg-red-600 hover:bg-red-700 text-white"
                    data-testid="button-youtube-sync"
                  >
                    {syncYoutubeMutation.isPending ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                    ) : (
                      <><RefreshCw className="w-4 h-4 mr-2" /> Sync from YouTube</>
                    )}
                  </Button>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Video Library</CardTitle>
                <CardDescription>Manage your sermon and teaching videos.</CardDescription>
              </CardHeader>
              <CardContent>
                {videosLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : videosError ? (
                  <div className="text-center py-8 text-destructive">
                    <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Failed to load videos. Please refresh the page.</p>
                  </div>
                ) : videos.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No videos yet. Add your first video above.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {videos.map((video) => (
                        <TableRow key={video.id} data-testid={`row-video-${video.id}`}>
                          <TableCell className="font-medium">{video.title}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{video.category}</Badge>
                          </TableCell>
                          <TableCell>{video.duration}</TableCell>
                          <TableCell>{video.views}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(video)} data-testid={`button-edit-video-${video.id}`}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => deleteVideoMutation.mutate(video.id)}
                              disabled={deleteVideoMutation.isPending}
                              data-testid={`button-delete-video-${video.id}`}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="registrations">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Program Registrations</CardTitle>
                    <CardDescription>View and manage sign-ups for your ministries.</CardDescription>
                  </div>
                  <Select value={filterMinistry} onValueChange={setFilterMinistry}>
                    <SelectTrigger className="w-[200px]" data-testid="select-filter-ministry">
                      <SelectValue placeholder="Filter by ministry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ministries</SelectItem>
                      <SelectItem value="deal-to-heal">Deal to Heal</SelectItem>
                      <SelectItem value="master-class">Master Class</SelectItem>
                      <SelectItem value="proskuneo">Proskuneo</SelectItem>
                      <SelectItem value="understanding-dreams">Understanding Dreams</SelectItem>
                      <SelectItem value="deliverance">Deliverance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {registrationsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : registrationsError ? (
                  <div className="text-center py-8 text-destructive">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Failed to load registrations. Please refresh the page.</p>
                  </div>
                ) : filteredRegistrations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No registrations found.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Ministry</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRegistrations.map((reg) => (
                        <TableRow key={reg.id} data-testid={`row-registration-${reg.id}`}>
                          <TableCell className="font-medium">{reg.fullName}</TableCell>
                          <TableCell>{reg.email}</TableCell>
                          <TableCell>{reg.phone}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{ministryLabels[reg.ministryType] || reg.ministryType}</Badge>
                          </TableCell>
                          <TableCell>{new Date(reg.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openRegEditDialog(reg)}
                              data-testid={`button-edit-registration-${reg.id}`}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => deleteRegistrationMutation.mutate(reg.id)}
                              disabled={deleteRegistrationMutation.isPending}
                              data-testid={`button-delete-registration-${reg.id}`}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Ministry Program Settings</CardTitle>
                <CardDescription>View current status and capacity for each program.</CardDescription>
              </CardHeader>
              <CardContent>
                {settingsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : settingsError ? (
                  <div className="text-center py-8 text-destructive">
                    <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Failed to load ministry settings. Please refresh the page.</p>
                  </div>
                ) : ministrySettings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No ministry settings found.</p>
                  </div>
                ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {ministrySettings.map((setting) => (
                    <Card key={setting.id} className="border" data-testid={`card-ministry-${setting.ministryType}`}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{ministryLabels[setting.ministryType] || setting.ministryType}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant={setting.status === "open" ? "default" : setting.status === "upcoming" ? "secondary" : "outline"}>
                              {setting.status}
                            </Badge>
                            <Button variant="ghost" size="icon" onClick={() => openSettingsDialog(setting)} data-testid={`button-edit-settings-${setting.ministryType}`}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{setting.nextSessionDate} at {setting.nextSessionTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>{setting.currentRegistrations} / {setting.capacity} registered</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Settings className="w-4 h-4" />
                          <span>{setting.location}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="podcast">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="w-5 h-5" />
                  Podcast Settings
                </CardTitle>
                <CardDescription>Configure your podcast feed. The Spotify embed will appear on your homepage.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {podcastLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); updatePodcastMutation.mutate(podcastForm); }} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="spotify-show-id">Spotify Show ID</Label>
                      <Input
                        id="spotify-show-id"
                        placeholder="e.g. 5qXqJngdCfVGHlQKB6Fl0x"
                        value={podcastForm.spotifyShowId}
                        onChange={(e) => setPodcastForm({ ...podcastForm, spotifyShowId: e.target.value })}
                        data-testid="input-spotify-show-id"
                      />
                      <p className="text-xs text-muted-foreground">
                        Find your Show ID in your Spotify for Podcasters dashboard or from your podcast URL (open.spotify.com/show/YOUR_SHOW_ID)
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="podcast-rss">Podcast RSS Feed URL</Label>
                      <Input
                        id="podcast-rss"
                        placeholder="https://anchor.fm/s/xxx/podcast/rss"
                        value={podcastForm.rssUrl}
                        onChange={(e) => setPodcastForm({ ...podcastForm, rssUrl: e.target.value })}
                        data-testid="input-podcast-rss"
                      />
                      <p className="text-xs text-muted-foreground">
                        Optional: Add your podcast RSS feed URL for future episode list integration
                      </p>
                    </div>
                    
                    {podcastForm.spotifyShowId && (
                      <div className="space-y-2">
                        <Label>Preview</Label>
                        <div className="rounded-lg overflow-hidden border">
                          <iframe
                            src={`https://open.spotify.com/embed/show/${podcastForm.spotifyShowId}?utm_source=generator&theme=0`}
                            width="100%"
                            height="352"
                            frameBorder="0"
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                            title="Spotify Podcast Preview"
                          />
                        </div>
                      </div>
                    )}
                    
                    <Button type="submit" className="w-full bg-primary text-white" disabled={updatePodcastMutation.isPending} data-testid="button-save-podcast">
                      {updatePodcastMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Podcast Settings"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={editVideoOpen} onOpenChange={setEditVideoOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">Edit Video</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditVideo} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Video Title</Label>
                <Input
                  id="edit-title"
                  placeholder="Enter video title"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-videoId">YouTube URL or Video ID</Label>
                <Input
                  id="edit-videoId"
                  placeholder="https://youtube.com/watch?v=... or video ID"
                  value={videoForm.videoId}
                  onChange={(e) => setVideoForm({ ...videoForm, videoId: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select value={videoForm.category} onValueChange={(val) => setVideoForm({ ...videoForm, category: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sermons & Teachings">Sermons & Teachings</SelectItem>
                      <SelectItem value="Healing & Deliverance">Healing & Deliverance</SelectItem>
                      <SelectItem value="Family">Family</SelectItem>
                      <SelectItem value="Parenting">Parenting</SelectItem>
                      <SelectItem value="Worship">Worship</SelectItem>
                      <SelectItem value="Church">Church</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">Duration</Label>
                  <Input
                    id="edit-duration"
                    placeholder="e.g. 45:30"
                    value={videoForm.duration}
                    onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-thumbnail">Thumbnail URL</Label>
                <Input
                  id="edit-thumbnail"
                  placeholder="https://..."
                  value={videoForm.thumbnail}
                  onChange={(e) => setVideoForm({ ...videoForm, thumbnail: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full bg-primary text-white" disabled={updateVideoMutation.isPending}>
                {updateVideoMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</> : "Update Video"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={editSettingsOpen} onOpenChange={setEditSettingsOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">Edit Ministry Settings</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateSettings} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="settings-status">Status</Label>
                <Select value={settingsForm.status} onValueChange={(val) => setSettingsForm({ ...settingsForm, status: val })}>
                  <SelectTrigger data-testid="select-settings-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="settings-date">Next Session Date</Label>
                  <Input
                    id="settings-date"
                    placeholder="e.g. December 15, 2024"
                    value={settingsForm.nextSessionDate}
                    onChange={(e) => setSettingsForm({ ...settingsForm, nextSessionDate: e.target.value })}
                    data-testid="input-settings-date"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-time">Session Time</Label>
                  <Input
                    id="settings-time"
                    placeholder="e.g. 10:00 AM - 4:00 PM"
                    value={settingsForm.nextSessionTime}
                    onChange={(e) => setSettingsForm({ ...settingsForm, nextSessionTime: e.target.value })}
                    data-testid="input-settings-time"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-location">Location</Label>
                <Input
                  id="settings-location"
                  placeholder="e.g. Nairobi, Kenya"
                  value={settingsForm.location}
                  onChange={(e) => setSettingsForm({ ...settingsForm, location: e.target.value })}
                  data-testid="input-settings-location"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-capacity">Capacity</Label>
                <Input
                  id="settings-capacity"
                  type="number"
                  placeholder="50"
                  value={settingsForm.capacity}
                  onChange={(e) => setSettingsForm({ ...settingsForm, capacity: parseInt(e.target.value) || 0 })}
                  data-testid="input-settings-capacity"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="settings-start-date">Start Date</Label>
                  <Input
                    id="settings-start-date"
                    placeholder="e.g. January 15"
                    value={settingsForm.startDate}
                    onChange={(e) => setSettingsForm({ ...settingsForm, startDate: e.target.value })}
                    data-testid="input-settings-start-date"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-end-date">End Date</Label>
                  <Input
                    id="settings-end-date"
                    placeholder="e.g. January 20"
                    value={settingsForm.endDate}
                    onChange={(e) => setSettingsForm({ ...settingsForm, endDate: e.target.value })}
                    data-testid="input-settings-end-date"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-meeting-days">Meeting Days</Label>
                <Input
                  id="settings-meeting-days"
                  placeholder="e.g. Monday, Wednesday, Friday"
                  value={settingsForm.meetingDays}
                  onChange={(e) => setSettingsForm({ ...settingsForm, meetingDays: e.target.value })}
                  data-testid="input-settings-meeting-days"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-meeting-mode">Meeting Mode</Label>
                <Select value={settingsForm.meetingMode} onValueChange={(val) => setSettingsForm({ ...settingsForm, meetingMode: val })}>
                  <SelectTrigger data-testid="select-settings-meeting-mode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="In-person">In-person</SelectItem>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-spotify">Spotify Show ID</Label>
                <Input
                  id="settings-spotify"
                  placeholder="e.g. 5qXqJngdCfVGHlQKB6Fl0x"
                  value={settingsForm.spotifyShowId}
                  onChange={(e) => setSettingsForm({ ...settingsForm, spotifyShowId: e.target.value })}
                  data-testid="input-settings-spotify"
                />
              </div>
              <Button type="submit" className="w-full bg-primary text-white" disabled={updateSettingsMutation.isPending} data-testid="button-update-settings">
                {updateSettingsMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</> : "Update Settings"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={editRegOpen} onOpenChange={setEditRegOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">Edit Registration</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateReg} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="reg-name">Full Name</Label>
                <Input
                  id="reg-name"
                  placeholder="Full name"
                  value={regForm.fullName}
                  onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                  required
                  data-testid="input-reg-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="email@example.com"
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  required
                  data-testid="input-reg-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-phone">Phone</Label>
                <Input
                  id="reg-phone"
                  placeholder="+254..."
                  value={regForm.phone}
                  onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                  required
                  data-testid="input-reg-phone"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-message">Message</Label>
                <Input
                  id="reg-message"
                  placeholder="Optional message"
                  value={regForm.message}
                  onChange={(e) => setRegForm({ ...regForm, message: e.target.value })}
                  data-testid="input-reg-message"
                />
              </div>
              <Button type="submit" className="w-full bg-primary text-white" disabled={updateRegMutation.isPending} data-testid="button-update-registration">
                {updateRegMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</> : "Update Registration"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
}
