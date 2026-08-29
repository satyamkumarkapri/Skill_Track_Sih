"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  GraduationCap,
  Briefcase,
  Clock,
  Store,
  IndianRupee,
  Wrench,
  Target,
  Building2,
  MapPin,
  BarChart3,
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronRight,
  ArrowUpRight,
  LucideIcon,
  Brain,
  Sparkles,
} from "lucide-react";

// ===== CARD =====
export function Card({
  className,
  children,
  hover = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-300",
        hover && "card-hover cursor-pointer",
        !hover && "hover:shadow-md hover:border-primary/20",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-4 pt-4 pb-2", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-sm font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs text-muted-foreground mt-0.5", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-4 pb-4 pt-2", className)} {...props} />;
}

// ===== BUTTON =====
type ButtonVariant = "default" | "secondary" | "outline" | "ghost" | "destructive" | "saffron" | "success" | "premium";
type ButtonSize = "default" | "sm" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const buttonVariants: Record<ButtonVariant, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md",
  premium: "bg-gradient-to-r from-primary to-blue-800 text-white hover:from-primary/90 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300",
  saffron: "bg-gradient-to-r from-saffron to-orange-600 text-white hover:from-saffron/90 hover:to-orange-500 shadow-lg hover:shadow-xl transition-all duration-300",
  success: "bg-gradient-to-r from-india-green to-emerald-700 text-white hover:from-india-green/90 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-300",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
};

const buttonSizes: Record<ButtonSize, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-8 px-3 text-xs",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10",
};

export function Button({
  className,
  variant = "default",
  size = "default",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

// ===== BADGE =====
type BadgeVariant = "default" | "secondary" | "success" | "warning" | "destructive" | "outline";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const badgeVariants: Record<BadgeVariant, string> = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  destructive: "bg-red-100 text-red-800",
  outline: "border border-border text-foreground",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}

// ===== STATUS BADGE =====
export function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { variant: BadgeVariant; label: string }> = {
    employed: { variant: "success", label: "Employed" },
    "self-employed": { variant: "warning", label: "Self-Employed" },
    apprentice: { variant: "default", label: "Apprentice" },
    seeking: { variant: "warning", label: "Seeking" },
    "not-working": { variant: "destructive", label: "Not Working" },
    completed: { variant: "success", label: "Completed" },
    "in-progress": { variant: "warning", label: "In Progress" },
    enrolled: { variant: "default", label: "Enrolled" },
    dropped: { variant: "destructive", label: "Dropped" },
    passed: { variant: "success", label: "Passed" },
    failed: { variant: "destructive", label: "Failed" },
    pending: { variant: "warning", label: "Pending" },
    "not-attempted": { variant: "secondary", label: "Not Attempted" },
    verified: { variant: "success", label: "Verified" },
    unverified: { variant: "secondary", label: "Unverified" },
    "trainee-confirmed": { variant: "warning", label: "Trainee Confirmed" },
    "employer-confirmed": { variant: "warning", label: "Employer Confirmed" },
    active: { variant: "success", label: "Active" },
    inactive: { variant: "secondary", label: "Inactive" },
    recommended: { variant: "default", label: "Recommended" },
    approved: { variant: "success", label: "Approved" },
    measured: { variant: "default", label: "Measured" },
    responded: { variant: "success", label: "Responded" },
    sent: { variant: "warning", label: "Sent" },
    "no-response": { variant: "destructive", label: "No Response" },
    escalated: { variant: "destructive", label: "Escalated" },
    high: { variant: "destructive", label: "High" },
    medium: { variant: "warning", label: "Medium" },
    low: { variant: "success", label: "Low" },
  };

  const c = config[status] || { variant: "secondary" as BadgeVariant, label: status };
  return <Badge variant={c.variant}>{c.label}</Badge>;
}

// ===== KPI CARD =====
const iconMap: Record<string, LucideIcon> = {
  Users, GraduationCap, Briefcase, Clock, Store, IndianRupee, Wrench, Target,
  Building2, MapPin, BarChart3, Shield, FileText, AlertTriangle,
};

interface KPICardProps {
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: string;
  trend?: "up" | "down" | "neutral";
  delay?: number;
}

export function KPICard({ label, value, change, changeLabel, icon, trend, delay = 0 }: KPICardProps) {
  const Icon = iconMap[icon] || BarChart3;

  return (
    <Card className="border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 card-hover bg-white/60 backdrop-blur-md overflow-hidden relative group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl -mr-8 -mt-8 transition-transform group-hover:scale-150" />
      <CardContent className="p-5 relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {label}
            </p>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              {value}
            </p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 p-3 shadow-inner border border-white">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
        {change !== undefined && (
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border/50">
            {trend === "up" ? (
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
            ) : trend === "down" ? (
              <TrendingDown className="h-3.5 w-3.5 text-red-500" />
            ) : (
              <Minus className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            <span
              className={cn(
                "text-xs font-medium",
                trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-500" : "text-muted-foreground"
              )}
            >
              {change > 0 ? "+" : ""}{change}%
            </span>
            <span className="text-xs text-muted-foreground">{changeLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ===== SKELETON =====
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("skeleton", className)} {...props} />;
}

export function KPISkeleton() {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-20" />
          </div>
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-56 mt-1" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[280px] w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-40" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Skeleton className="h-8 w-full" />
          {Array.from({ length: rows }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ===== EMPTY STATE =====
interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon = FileText, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
      {action}
    </div>
  );
}

// ===== ERROR STATE =====
export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-red-50 p-4 mb-4">
        <XCircle className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} size="sm">
          Try Again
        </Button>
      )}
    </div>
  );
}

// ===== PROGRESS BAR =====
export function ProgressBar({
  value,
  max = 100,
  label,
  color = "bg-primary",
  className,
}: {
  value: number;
  max?: number;
  label?: string;
  color?: string;
  className?: string;
}) {
  const percentage = Math.min(100, (value / max) * 100);

  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-medium">{percentage.toFixed(1)}%</span>
        </div>
      )}
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ===== SCORE RING =====
export function ScoreRing({
  score,
  label,
  size = 80,
  strokeWidth = 6,
}: {
  score: number;
  label: string;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 75) return "#059669";
    if (s >= 50) return "#d97706";
    return "#dc2626";
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getColor(score)}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold">{score}%</span>
        </div>
      </div>
      <span className="text-xs text-muted-foreground text-center">{label}</span>
    </div>
  );
}

// ===== CONFIDENCE SCORE =====
export function ConfidenceScore({ score }: { score: number }) {
  const segments = [
    { label: "Employer", max: 40, color: "bg-primary" },
    { label: "Trainee", max: 30, color: "bg-saffron" },
    { label: "Evidence", max: 15, color: "bg-india-green" },
    { label: "Repeated", max: 15, color: "bg-purple-500" },
  ];

  const filled = score;
  let remaining = filled;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Employment Confidence</span>
        <span className="text-lg font-bold">{score}/100</span>
      </div>
      <div className="flex h-3 rounded-full overflow-hidden bg-muted">
        {segments.map((seg) => {
          const segValue = Math.min(remaining, seg.max);
          remaining -= segValue;
          const width = (segValue / 100) * 100;
          return (
            <div
              key={seg.label}
              className={cn("h-full transition-all duration-500", seg.color)}
              style={{ width: `${width}%` }}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1">
            <div className={cn("h-2 w-2 rounded-full", seg.color)} />
            <span>{seg.label} ({seg.max})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== INPUT =====
export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/50 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

// ===== TEXTAREA =====
export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

// ===== SELECT =====
export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

// ===== LABEL =====
export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
}

// ===== SEPARATOR =====
export function Separator({ className }: { className?: string }) {
  return <div className={cn("h-px bg-border", className)} />;
}

// ===== AVATAR =====
export function Avatar({
  name,
  src,
  size = "md",
}: {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-14 w-14 text-base" };
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        "rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center flex-shrink-0",
        sizes[size]
      )}
    >
      {src ? (
        <img src={src} alt={name} className="rounded-full h-full w-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}

// ===== DEMO BADGE =====
export function DemoBadge() {
  return (
    <span className="demo-badge animate-pulse-subtle">
      Demo Environment
    </span>
  );
}

// ===== TABS =====
interface TabsProps {
  tabs: { id: string; label: string; icon?: LucideIcon }[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex items-center gap-1 bg-muted rounded-lg p-1", className)}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

// ===== DATA TABLE =====
interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = "No data available",
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <EmptyState
        title="No Data"
        description={emptyMessage}
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col, i) => (
              <th
                key={i}
                className={cn(
                  "text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              onClick={() => onRowClick?.(row)}
              className={cn(
                "border-b border-border/50 transition-colors",
                onRowClick && "cursor-pointer hover:bg-muted/50"
              )}
            >
              {columns.map((col, i) => (
                <td key={i} className={cn("py-3 px-4", col.className)}>
                  {typeof col.accessor === "function"
                    ? col.accessor(row)
                    : (row[col.accessor] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ===== PAGINATION =====
export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border">
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

// ===== FILTER BAR =====
interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  filters: {
    id: string;
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
  }[];
}

export function FilterBar({ filters }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-card rounded-lg border border-border">
      {filters.map((filter) => (
        <div key={filter.id} className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">
            {filter.label}
          </label>
          <Select
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className="h-8 text-xs min-w-[140px]"
          >
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
      ))}
    </div>
  );
}

// ===== AI PREDICTION CARD =====
export function AIPredictionCard({ prediction }: { prediction: any }) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "medium": return "text-amber-600 bg-amber-50 border-amber-200";
      case "high": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-muted-foreground bg-muted border-border";
    }
  };

  const riskClasses = getRiskColor(prediction.riskLevel);

  return (
    <Card className="border-primary/20 overflow-hidden shadow-sm">
      <div className="bg-primary/5 px-4 py-2 border-b border-primary/10 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
          AI-Assisted Decision Support
        </span>
      </div>
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">{prediction.title}</h3>
            <p className={cn("text-xl font-bold rounded px-2.5 py-1 inline-block border", riskClasses)}>
              {prediction.prediction}
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs text-muted-foreground mb-1">Confidence Score</p>
            <div className="flex items-center sm:justify-end gap-2">
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${prediction.confidence * 100}%` }}
                />
              </div>
              <span className="text-sm font-bold">{(prediction.confidence * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Top Contributing Factors</p>
            <div className="space-y-2">
              {(prediction.factors || []).map((f: any, i: number) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className={f.impact === "positive" ? "text-emerald-500 font-bold" : "text-red-500 font-bold"}>
                    {f.impact === "positive" ? "+" : "-"}
                  </span>
                  <span className="text-muted-foreground">{f.factor}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-4 border-t border-border">
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Recommended Action</p>
            <div className="flex items-start gap-2">
              <Target className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium text-foreground">{prediction.recommendation}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

