
import React from 'react';
import { 
  Warehouse, Package, Truck, MapPin, BarChart3, 
  Archive, ChevronLeft, ChevronRight, Home, ShoppingCart,
  Move, Target, CheckSquare, Route, Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'warehouses', label: 'Warehouses', icon: Warehouse },
  { id: 'zones', label: 'Zones', icon: MapPin },
  { id: 'aisles', label: 'Aisles', icon: Layers },
  { id: 'racks', label: 'Racks', icon: Archive },
  { id: 'shelves', label: 'Shelves', icon: Package },
  { id: 'bins', label: 'Bins', icon: Package },
  { id: 'bin-coordinates', label: 'Bin Coordinates', icon: Target },
  { id: 'items', label: 'Items', icon: Package },
  { id: 'stock', label: 'Stock', icon: Archive },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'order-items', label: 'Order Items', icon: Package },
  { id: 'inbound-operations', label: 'Inbound Operations', icon: Truck },
  { id: 'outbound-operations', label: 'Outbound Operations', icon: Truck },
  { id: 'picking-tasks', label: 'Picking Tasks', icon: CheckSquare },
  { id: 'picking-paths', label: 'Picking Paths', icon: Route },
  { id: 'putaway-tasks', label: 'Putaway Tasks', icon: Move },
  { id: 'stock-movements', label: 'Stock Movements', icon: Move },
  { id: 'stock-audits', label: 'Stock Audits', icon: CheckSquare },
  { id: 'warehouse-maps', label: 'Warehouse Maps', icon: MapPin },
  { id: 'warehouse-kpis', label: 'Warehouse KPIs', icon: BarChart3 },
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeModule, 
  setActiveModule, 
  collapsed, 
  setCollapsed 
}) => {
  return (
    <div className={cn(
      "bg-slate-800 text-white fixed left-0 top-0 h-screen transition-all duration-300 z-50 flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <Warehouse className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold">WareMS</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-slate-700 rounded"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>
      
      <ScrollArea className="flex-1 mt-4">
        <nav>
          <div className="px-2 space-y-1 pb-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={cn(
                    "w-full flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    activeModule === item.id
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  )}
                >
                  <Icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </div>
        </nav>
      </ScrollArea>
    </div>
  );
};
