import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  Database,
  Server,
  Shield,
  Code,
  Vote,
  Settings,
  Hexagon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Overview", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Oracle Requests", icon: Activity, path: "/dashboard/requests" },
  { name: "Data Feeds", icon: Database, path: "/data-feeds" },
  { name: "Node Operators", icon: Server, path: "/nodes" },
  { name: "SLA & Reputation", icon: Shield, path: "/dashboard/sla" },
  { name: "API Management", icon: Code, path: "/developers" },
  { name: "Governance", icon: Vote, path: "/governance" },
  { name: "Settings", icon: Settings, path: "/dashboard/settings" },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 border-r border-border/50 bg-card/50 backdrop-blur-xl transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <Hexagon className="w-7 h-7 text-primary" />
            <span className="font-heading font-bold text-lg text-gradient-primary">
              OracleNet
            </span>
          </Link>
        )}
        {collapsed && (
          <Link to="/" className="mx-auto">
            <Hexagon className="w-7 h-7 text-primary" />
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto scrollbar-thin">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "nav-link",
                    isActive && "nav-link-active",
                    collapsed && "justify-center px-3"
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-border/50">
        <Button
          variant="ghost"
          size="sm"
          className={cn("w-full", collapsed && "px-0")}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 mr-2" />
              Collapse
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
