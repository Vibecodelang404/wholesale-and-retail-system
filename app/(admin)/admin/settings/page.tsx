"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Store, Bell, Shield, Palette, Receipt, Save } from "lucide-react"

interface BusinessHours {
  day: string
  open: string
  close: string
  enabled: boolean
}

const defaultBusinessHours: BusinessHours[] = [
  { day: "Monday", open: "08:00", close: "21:00", enabled: true },
  { day: "Tuesday", open: "08:00", close: "21:00", enabled: true },
  { day: "Wednesday", open: "08:00", close: "21:00", enabled: true },
  { day: "Thursday", open: "08:00", close: "21:00", enabled: true },
  { day: "Friday", open: "08:00", close: "21:00", enabled: true },
  { day: "Saturday", open: "08:00", close: "21:00", enabled: true },
  { day: "Sunday", open: "08:00", close: "21:00", enabled: false },
]

export default function SettingsPage() {
  // Store Information
  const [storeName, setStoreName] = useState("My Store")
  const [storeAddress, setStoreAddress] = useState("123 Main Street, Manila, Philippines")
  const [storePhone, setStorePhone] = useState("+63 917 123 4567")
  const [storeEmail, setStoreEmail] = useState("contact@mystore.ph")
  const [currency, setCurrency] = useState("PHP")
  const [timezone, setTimezone] = useState("Asia/Manila")
  
  // Business Hours
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>(defaultBusinessHours)
  
  // Notification Settings
  const [lowStockThreshold, setLowStockThreshold] = useState("10")
  const [enableNotifications, setEnableNotifications] = useState(true)
  const [enableEmailAlerts, setEnableEmailAlerts] = useState(true)
  const [autoReorderEnabled, setAutoReorderEnabled] = useState(false)
  
  // POS Settings
  const [autoPrintReceipt, setAutoPrintReceipt] = useState(true)
  const [quickAddMode, setQuickAddMode] = useState(true)
  const [showProductImages, setShowProductImages] = useState(true)
  
  // Payment Methods
  const [cashEnabled, setCashEnabled] = useState(true)
  const [gcashEnabled, setGcashEnabled] = useState(true)
  const [mayaEnabled, setMayaEnabled] = useState(true)
  
  // Security Settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState("30")
  const [loginAttempts, setLoginAttempts] = useState("5")
  const [autoBackup, setAutoBackup] = useState(true)
  const [dataRetention, setDataRetention] = useState("365")
  
  const [showSaveDialog, setShowSaveDialog] = useState(false)

  // Update business hours
  const updateBusinessHours = (index: number, field: keyof BusinessHours, value: string | boolean) => {
    setBusinessHours(prev => prev.map((hours, i) => 
      i === index ? { ...hours, [field]: value } : hours
    ))
  }

  const handleSave = () => {
    // Settings would be persisted to backend/database in production
    setShowSaveDialog(false)
    toast.success("Settings saved successfully")
  }

  return (
    <DashboardShell title="Settings" description="Manage your store configuration" allowedRoles={['admin']}>
      <Tabs defaultValue="store" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px] lg:grid-cols-4">
          <TabsTrigger value="store" className="gap-2">
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline">Store</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="pos" className="gap-2">
            <Receipt className="h-4 w-4" />
            <span className="hidden sm:inline">POS</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Basic information about your store that appears on receipts and reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Phone Number</Label>
                  <Input
                    id="storePhone"
                    value={storePhone}
                    onChange={(e) => setStorePhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeEmail">Email Address</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={storeEmail}
                  onChange={(e) => setStoreEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeAddress">Address</Label>
                <Textarea
                  id="storeAddress"
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  rows={3}
                />
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PHP">Philippine Peso (₱)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Manila">Asia/Manila (UTC+8)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>
                Set your store operating hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {businessHours.map((hours, index) => (
                  <div key={hours.day} className="flex items-center justify-between">
                    <span className="w-24 font-medium">{hours.day}</span>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="time" 
                        value={hours.open} 
                        onChange={(e) => updateBusinessHours(index, "open", e.target.value)}
                        disabled={!hours.enabled}
                        className="w-32" 
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input 
                        type="time" 
                        value={hours.close} 
                        onChange={(e) => updateBusinessHours(index, "close", e.target.value)}
                        disabled={!hours.enabled}
                        className="w-32" 
                      />
                    </div>
                    <Switch 
                      checked={hours.enabled} 
                      onCheckedChange={(checked) => updateBusinessHours(index, "enabled", checked)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive in-app notifications for important events
                  </p>
                </div>
                <Switch
                  checked={enableNotifications}
                  onCheckedChange={setEnableNotifications}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for critical alerts
                  </p>
                </div>
                <Switch
                  checked={enableEmailAlerts}
                  onCheckedChange={setEnableEmailAlerts}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Alerts</CardTitle>
              <CardDescription>
                Configure stock-related notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(e.target.value)}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">units</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Alert when stock falls below this quantity
                </p>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-Reorder Suggestions</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically suggest reorders for low stock items
                  </p>
                </div>
                <Switch
                  checked={autoReorderEnabled}
                  onCheckedChange={setAutoReorderEnabled}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pos" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>POS Settings</CardTitle>
              <CardDescription>
                Configure point-of-sale behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-print Receipt</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically print receipt after each transaction
                    </p>
                  </div>
                  <Switch checked={autoPrintReceipt} onCheckedChange={setAutoPrintReceipt} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Quick Add Mode</p>
                    <p className="text-sm text-muted-foreground">
                      Single click to add items to cart
                    </p>
                  </div>
                  <Switch checked={quickAddMode} onCheckedChange={setQuickAddMode} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Product Images</p>
                    <p className="text-sm text-muted-foreground">
                      Display product images in POS terminal
                    </p>
                  </div>
                  <Switch checked={showProductImages} onCheckedChange={setShowProductImages} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Enable or disable payment options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                    <span className="text-lg font-bold text-green-500">₱</span>
                  </div>
                  <div>
                    <p className="font-medium">Cash</p>
                    <p className="text-sm text-muted-foreground">Accept cash payments</p>
                  </div>
                </div>
                <Switch checked={cashEnabled} onCheckedChange={setCashEnabled} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <span className="text-sm font-bold text-blue-500">G</span>
                  </div>
                  <div>
                    <p className="font-medium">GCash</p>
                    <p className="text-sm text-muted-foreground">Accept GCash e-wallet</p>
                  </div>
                </div>
                <Switch checked={gcashEnabled} onCheckedChange={setGcashEnabled} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600/10">
                    <span className="text-sm font-bold text-green-600">M</span>
                  </div>
                  <div>
                    <p className="font-medium">Maya</p>
                    <p className="text-sm text-muted-foreground">Accept Maya e-wallet</p>
                  </div>
                </div>
                <Switch checked={mayaEnabled} onCheckedChange={setMayaEnabled} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage security and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for admin accounts
                  </p>
                </div>
                <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Session Timeout</p>
                  <p className="text-sm text-muted-foreground">
                    Auto-logout after inactivity
                  </p>
                </div>
                <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Login Attempts</p>
                  <p className="text-sm text-muted-foreground">
                    Lock account after failed attempts
                  </p>
                </div>
                <Select value={loginAttempts} onValueChange={setLoginAttempts}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 attempts</SelectItem>
                    <SelectItem value="5">5 attempts</SelectItem>
                    <SelectItem value="10">10 attempts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Backup and data retention settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-Backup</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically backup data daily
                  </p>
                </div>
                <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Data Retention Period</Label>
                <Select value={dataRetention} onValueChange={setDataRetention}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">6 months</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="730">2 years</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button onClick={() => setShowSaveDialog(true)} size="lg">
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>

      {/* Save Confirmation Dialog */}
      <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Settings</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to save these changes? This will update your store configuration.
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
    </DashboardShell>
  )
}
