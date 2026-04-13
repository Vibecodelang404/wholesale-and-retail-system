"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { Shield, Package, ShoppingCart, BarChart3, Settings, Users, Save, RotateCcw, CheckSquare, XSquare } from "lucide-react"
import type { UserRole } from "@/lib/types"

interface ModulePermission {
  module: string
  icon: React.ReactNode
  label: string
  description: string
  actions: {
    id: string
    label: string
    description: string
  }[]
}

const modules: ModulePermission[] = [
  {
    module: "inventory",
    icon: <Package className="h-5 w-5" />,
    label: "Inventory Management",
    description: "Products, categories, suppliers, and stock operations",
    actions: [
      { id: "view", label: "View", description: "View products and stock levels" },
      { id: "create", label: "Create", description: "Add new products and categories" },
      { id: "edit", label: "Edit", description: "Modify product information" },
      { id: "delete", label: "Delete", description: "Remove products and categories" },
      { id: "receive", label: "Receive Stock", description: "Record incoming inventory" },
      { id: "breakdown", label: "Breakdown", description: "Convert wholesale to retail units" },
      { id: "transfer", label: "Transfer", description: "Move stock between tiers" },
      { id: "adjust", label: "Adjustments", description: "Make stock adjustments" },
    ],
  },
  {
    module: "pos",
    icon: <ShoppingCart className="h-5 w-5" />,
    label: "Point of Sale",
    description: "Transaction processing and sales",
    actions: [
      { id: "view", label: "View", description: "Access POS terminal" },
      { id: "process", label: "Process Sales", description: "Complete transactions" },
      { id: "discount", label: "Apply Discounts", description: "Add discounts to transactions" },
      { id: "void", label: "Void Items", description: "Remove items from transactions" },
      { id: "refund", label: "Process Refunds", description: "Handle refund requests" },
    ],
  },
  {
    module: "analytics",
    icon: <BarChart3 className="h-5 w-5" />,
    label: "Reports & Analytics",
    description: "Sales reports, inventory reports, and insights",
    actions: [
      { id: "view_sales", label: "View Sales Reports", description: "Access sales data" },
      { id: "view_inventory", label: "View Inventory Reports", description: "Access stock reports" },
      { id: "view_profit", label: "View Profit Reports", description: "Access profit margins" },
      { id: "export", label: "Export Reports", description: "Download report data" },
    ],
  },
  {
    module: "users",
    icon: <Users className="h-5 w-5" />,
    label: "User Management",
    description: "User accounts and permissions",
    actions: [
      { id: "view", label: "View Users", description: "See user list" },
      { id: "create", label: "Create Users", description: "Add new users" },
      { id: "edit", label: "Edit Users", description: "Modify user details" },
      { id: "delete", label: "Delete Users", description: "Remove users" },
      { id: "permissions", label: "Manage Permissions", description: "Change user permissions" },
    ],
  },
  {
    module: "settings",
    icon: <Settings className="h-5 w-5" />,
    label: "System Settings",
    description: "Store configuration and preferences",
    actions: [
      { id: "view", label: "View Settings", description: "Access settings" },
      { id: "edit", label: "Edit Settings", description: "Modify configuration" },
      { id: "backup", label: "Backup/Restore", description: "Manage data backups" },
    ],
  },
]

// Default permissions by role
const defaultPermissions: Record<UserRole, Record<string, string[]>> = {
  admin: {
    inventory: ["view", "create", "edit", "delete", "receive", "breakdown", "transfer", "adjust"],
    pos: ["view", "process", "discount", "void", "refund"],
    analytics: ["view_sales", "view_inventory", "view_profit", "export"],
    users: ["view", "create", "edit", "delete", "permissions"],
    settings: ["view", "edit", "backup"],
  },
  stockman: {
    inventory: ["view", "receive", "breakdown", "transfer", "adjust"],
    pos: [],
    analytics: ["view_inventory"],
    users: [],
    settings: [],
  },
  cashier: {
    inventory: ["view"],
    pos: ["view", "process", "discount", "void"],
    analytics: ["view_sales"],
    users: [],
    settings: [],
  },
  customer: {
    inventory: [],
    pos: [],
    analytics: [],
    users: [],
    settings: [],
  },
}

const roleColors: Record<UserRole, string> = {
  admin: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  stockman: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  cashier: "bg-green-500/10 text-green-500 border-green-500/20",
  customer: "bg-gray-500/10 text-gray-500 border-gray-500/20",
}

export default function AccessControlPage() {
  const [permissions, setPermissions] = useState(defaultPermissions)
  const [hasChanges, setHasChanges] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)

  const togglePermission = (role: UserRole, module: string, action: string) => {
    setPermissions((prev) => {
      const currentActions = prev[role][module] || []
      const hasAction = currentActions.includes(action)
      
      return {
        ...prev,
        [role]: {
          ...prev[role],
          [module]: hasAction
            ? currentActions.filter((a) => a !== action)
            : [...currentActions, action],
        },
      }
    })
    setHasChanges(true)
  }

  const toggleAllModulePermissions = (role: UserRole, module: string, enable: boolean) => {
    const moduleConfig = modules.find(m => m.module === module)
    if (!moduleConfig) return

    setPermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [module]: enable ? moduleConfig.actions.map(a => a.id) : [],
      },
    }))
    setHasChanges(true)
    toast.success(`${enable ? 'Enabled' : 'Disabled'} all ${moduleConfig.label} permissions for ${role}`)
  }

  const handleSave = () => {
    // Permissions would be persisted to backend/database in production
    setShowSaveDialog(false)
    toast.success("Access control settings saved successfully")
    setHasChanges(false)
  }

  const handleReset = () => {
    setPermissions(defaultPermissions)
    setShowResetDialog(false)
    setHasChanges(false)
    toast.success("Permissions reset to defaults")
  }

  const getModulePermissionCount = (role: UserRole, module: string) => {
    const moduleConfig = modules.find(m => m.module === module)
    if (!moduleConfig) return { enabled: 0, total: 0 }
    const enabled = permissions[role][module]?.length || 0
    return { enabled, total: moduleConfig.actions.length }
  }

  const roles: UserRole[] = ["admin", "stockman", "cashier", "customer"]

  return (
    <DashboardShell title="Access Control" description="Manage role-based permissions and access levels">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {roles.map((role) => (
            <Badge key={role} variant="outline" className={roleColors[role]}>
              <Shield className="mr-1 h-3 w-3" />
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowResetDialog(true)}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button onClick={() => setShowSaveDialog(true)} disabled={!hasChanges}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
            {hasChanges && <span className="ml-1 text-xs">(unsaved)</span>}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="admin" className="w-full">
        <TabsList className="mb-4">
          {roles.filter(r => r !== "customer").map((role) => (
            <TabsTrigger key={role} value={role} className="gap-2">
              <Shield className="h-4 w-4" />
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        {roles.filter(r => r !== "customer").map((role) => (
          <TabsContent key={role} value={role} className="space-y-6">
            {modules.map((module) => (
              <Card key={module.module}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        {module.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{module.label}</CardTitle>
                        <CardDescription>{module.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const { enabled, total } = getModulePermissionCount(role, module.module)
                        return (
                          <Badge variant="secondary" className="text-xs">
                            {enabled}/{total} enabled
                          </Badge>
                        )
                      })()}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleAllModulePermissions(role, module.module, true)}
                        title="Enable all"
                      >
                        <CheckSquare className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleAllModulePermissions(role, module.module, false)}
                        title="Disable all"
                      >
                        <XSquare className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {module.actions.map((action, idx) => {
                      const isEnabled = permissions[role][module.module]?.includes(action.id) || false
                      const isAdmin = role === "admin"
                      
                      return (
                        <div
                          key={action.id}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="space-y-0.5">
                            <p className="text-sm font-medium">{action.label}</p>
                            <p className="text-xs text-muted-foreground">{action.description}</p>
                          </div>
                          <Switch
                            checked={isEnabled}
                            onCheckedChange={() => togglePermission(role, module.module, action.id)}
                            disabled={isAdmin && module.module === "users" && action.id === "permissions"}
                          />
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>

      {/* Save Confirmation Dialog */}
      <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Access Control Settings</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to save these permission changes? This will affect what actions each role can perform in the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSave}>
              Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset to Default Permissions</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset all permissions to their default values? This will discard all custom permission changes you have made.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset} className="bg-destructive hover:bg-destructive/90">
              Reset Permissions
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  )
}
