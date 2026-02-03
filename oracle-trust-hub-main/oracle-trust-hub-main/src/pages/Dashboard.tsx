import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { LiveStats } from "@/components/dashboard/LiveStats";
import { RequestsTable } from "@/components/dashboard/RequestsTable";
import { NodeStatus } from "@/components/dashboard/NodeStatus";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen w-full">
      <DashboardSidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor your oracle network in real-time
            </p>
          </div>

          {/* Live Stats */}
          <div className="mb-8">
            <LiveStats />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Requests Table - Takes 2 columns */}
            <div className="xl:col-span-2">
              <RequestsTable />
            </div>

            {/* Node Status - Takes 1 column */}
            <div className="xl:col-span-1">
              <NodeStatus />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
