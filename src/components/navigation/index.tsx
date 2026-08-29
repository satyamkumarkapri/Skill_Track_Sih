"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { DemoBadge } from "@/components/ui";
import { logoutUser } from "@/actions/auth";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Briefcase,
  Building2,
  MapPin,
  Target,
  BarChart3,
  FileText,
  AlertTriangle,
  Shield,
  Settings,
  LogOut,
  User,
  Menu,
  X,
  ChevronLeft,
  Bell,
  Search,
  Lightbulb,
  BookOpen,
  ClipboardList,
  Store,
  UserCheck,
  MessageSquare,
  FileBarChart,
  Wrench,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const govNavItems: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Trainees", href: "/dashboard/trainees", icon: Users },
  { label: "Training", href: "/dashboard/training", icon: GraduationCap },
  { label: "Employment", href: "/dashboard/employment", icon: Briefcase },
  { label: "Providers", href: "/dashboard/providers", icon: Building2 },
  { label: "Employers", href: "/dashboard/employers", icon: Store },
  { label: "Districts", href: "/dashboard/districts", icon: MapPin },
  { label: "Skills", href: "/dashboard/skills", icon: Target },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Interventions", href: "/dashboard/interventions", icon: Lightbulb, badge: "3" },
  { label: "Reports", href: "/dashboard/reports", icon: FileText },
  { label: "Audit Logs", href: "/dashboard/audit-logs", icon: Shield },
  { label: "Admin Panel", href: "/dashboard/manage-users", icon: Wrench, badge: "🔒" },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const traineeNavItems: NavItem[] = [
  { label: "Dashboard", href: "/trainee/dashboard", icon: LayoutDashboard },
  { label: "My Profile", href: "/trainee/profile", icon: Users },
  { label: "Training", href: "/trainee/training", icon: GraduationCap },
  { label: "Employment", href: "/trainee/employment", icon: Briefcase },
  { label: "Certificates", href: "/trainee/certificates", icon: BookOpen },
  { label: "Follow-ups", href: "/trainee/follow-ups", icon: MessageSquare },
  { label: "Consent", href: "/trainee/consent", icon: Shield },
  { label: "Feedback", href: "/trainee/feedback", icon: ClipboardList },
];

const providerNavItems: NavItem[] = [
  { label: "Dashboard", href: "/provider/dashboard", icon: LayoutDashboard },
  { label: "Trainees", href: "/provider/trainees", icon: Users },
  { label: "Courses", href: "/provider/courses", icon: BookOpen },
  { label: "Outcomes", href: "/provider/outcomes", icon: BarChart3 },
  { label: "Analytics", href: "/provider/analytics", icon: FileBarChart },
];

const employerNavItems: NavItem[] = [
  { label: "Dashboard", href: "/employer/dashboard", icon: LayoutDashboard },
  { label: "Job Openings", href: "/employer/jobs", icon: Briefcase },
  { label: "Employees", href: "/employer/employees", icon: Users },
  { label: "Verification", href: "/employer/verification", icon: UserCheck },
];

export function getNavItems(role: string): NavItem[] {
  switch (role) {
    case "government_admin":
    case "government_officer":
      return govNavItems;
    case "trainee":
      return traineeNavItems;
    case "training_provider":
      return providerNavItems;
    case "employer":
      return employerNavItems;
    default:
      return govNavItems;
  }
}

interface SidebarProps {
  role?: string;
  userName?: string;
  userRole?: string;
}

export function Sidebar({ role = "government_admin", userName = "Rajesh Deshmukh", userRole = "Government Admin" }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = getNavItems(role);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn("px-4 py-5 border-b border-border/10", collapsed && "px-2")}>
        <Link href="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
            <Target className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">SkillTrack</h1>
              <p className="text-[10px] text-white/60 leading-tight">Maharashtra</p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 overflow-hidden group",
                isActive
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/70 hover:text-white hover:bg-white/10",
                collapsed && "justify-center px-2"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-saffron rounded-r-full shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
              )}
              <Icon className={cn("h-[18px] w-[18px] flex-shrink-0 transition-transform duration-200 group-hover:scale-110", isActive && "text-white")} />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="bg-saffron text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-[0_0_5px_rgba(249,115,22,0.5)]">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className={cn("px-3 py-4 border-t border-border/10", collapsed && "px-2")}>
        <div className={cn("flex items-center gap-3 px-3 py-2", collapsed && "justify-center px-0")}>
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-white">
            {userName.split(" ").map(n => n[0]).join("")}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{userName}</p>
              <p className="text-[10px] text-white/50 truncate">{userRole}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-primary text-white p-2 rounded-lg shadow-lg"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-[#0f172a] transform transition-transform duration-200 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-white/70 hover:text-white"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col fixed inset-y-0 left-0 z-40 bg-slate-950/80 backdrop-blur-xl border-r border-white/10 transition-all duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.2)]",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {sidebarContent}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 bg-background border border-border rounded-full p-1 shadow-sm hover:bg-muted transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            className={cn(
              "h-3.5 w-3.5 text-muted-foreground transition-transform",
              collapsed && "rotate-180"
            )}
          />
        </button>
      </aside>
    </>
  );
}

// ===== HEADER =====
interface HeaderProps {
  userName?: string;
  userRole?: string;
  collapsed?: boolean;
  onSearch?: (query: string) => void;
  notifications?: number;
}

import { toast } from "sonner";

export function DashboardHeader({
  userName = "Rajesh Deshmukh",
  userRole = "Government Admin",
  collapsed = false,
  notifications = 3,
}: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <header className="sticky top-0 z-30 lg:pl-64 h-16 glass-header flex items-center justify-between px-4 sm:px-6 transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-india-green/10 text-india-green border border-india-green/20 px-2.5 py-1 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-india-green animate-pulse" />
            Live · SIH26135
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 h-9 px-3 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors text-sm"
        >
          <Search className="h-4 w-4" />
          <span className="hidden md:inline">Search</span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 rounded bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground border border-border">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <Link
          href="/dashboard/interventions"
          className="relative p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          {notifications > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-saffron text-white text-[10px] font-bold flex items-center justify-center">
              {notifications}
            </span>
          )}
        </Link>

        {/* User Dropdown */}
        <div className="relative flex items-center pl-2 border-l border-border">
          <button 
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 text-left rounded-lg p-1 hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
              {userName.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium leading-tight">{userName}</p>
              <p className="text-[10px] text-muted-foreground leading-tight">{userRole}</p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {userMenuOpen && (
            <>
              {/* Invisible backdrop to click away */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setUserMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border bg-card p-1 shadow-lg z-50 animate-fade-in-up">
                <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground border-b border-border/50 mb-1">
                  My Account
                </div>
                <button 
                  onClick={() => { router.push('/dashboard/settings'); setUserMenuOpen(false); }}
                  className="w-full flex items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  Profile
                </button>
                <button 
                  onClick={() => { router.push('/dashboard/settings'); setUserMenuOpen(false); }}
                  className="w-full flex items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  Settings
                </button>
                <div className="my-1 h-px bg-border/50" />
                <button 
                  onClick={async () => { 
                    await logoutUser();
                    setUserMenuOpen(false);
                    router.push('/'); 
                  }}
                  className="w-full flex items-center gap-2 rounded-md px-2 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-24">
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
            onClick={() => setSearchOpen(false)} 
          />
          <div className="relative w-full max-w-lg transform overflow-hidden rounded-xl border border-border bg-background shadow-2xl transition-all">
            <div className="flex items-center border-b border-border px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                autoFocus
                className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                placeholder="Search trainees, courses, or districts..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    toast.info("Global search is coming soon!");
                    setSearchOpen(false);
                  }
                }}
              />
              <button 
                onClick={() => setSearchOpen(false)} 
                className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground hover:bg-muted/80"
              >
                ESC
              </button>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Suggestions</p>
              <div className="space-y-1">
                <button onClick={() => { router.push('/dashboard/trainees'); setSearchOpen(false); }} className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-muted transition-colors text-left">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  View all trainees
                </button>
                <button onClick={() => { router.push('/dashboard/interventions'); setSearchOpen(false); }} className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-muted transition-colors text-left">
                  <Lightbulb className="h-4 w-4 text-muted-foreground" />
                  View interventions
                </button>
                <button onClick={() => { router.push('/dashboard/districts'); setSearchOpen(false); }} className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-muted transition-colors text-left">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  District Intelligence
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
