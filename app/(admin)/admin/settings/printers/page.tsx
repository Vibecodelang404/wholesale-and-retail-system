"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Printer, Plus, MoreHorizontal, Settings, Trash2, RefreshCw, CheckCircle, XCircle, Wifi, AlertTriangle, Save } from "lucide-react"

interface PrinterDevice {
  id: string
  name: string
  type: "receipt" | "label" | "report"
  connection: "usb" | "network" | "bluetooth"
  ipAddress?: string
  port?: number
  status: "online" | "offline" | "error"
  isDefault: boolean
  paperWidth: "58mm" | "80mm"
  lastUsed?: Date
}

const mockPrinters: PrinterDevice[] = [
  {
    id: "prt_001",
    name: "Receipt Printer - Counter 1",
    type: "receipt",
    connection: "usb",
    status: "online",
    isDefault: true,
    paperWidth: "80mm",
    lastUsed: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "prt_002",
    name: "Receipt Printer - Counter 2",
    type: "receipt",
    connection: "network",
    ipAddress: "192.168.1.50",
    port: 9100,
    status: "online",
    isDefault: false,
    paperWidth: "80mm",
    lastUsed: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "prt_003",
    name: "Label Printer",
    type: "label",
    connection: "usb",
    status: "offline",
    isDefault: false,
    paperWidth: "58mm",
  },
]

const statusConfig = {
  online: {
    label: "Online",
    icon: <CheckCircle className="h-4 w-4" />,
    color: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  offline: {
    label: "Offline",
    icon: <XCircle className="h-4 w-4" />,
    color: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  },
  error: {
    label: "Error",
    icon: <AlertTriangle className="h-4 w-4" />,
    color: "bg-red-500/10 text-red-500 border-red-500/20",
  },
}

const connectionIcons = {
  usb: <Printer className="h-4 w-4" />,
  network: <Wifi className="h-4 w-4" />,
  bluetooth: <Wifi className="h-4 w-4" />,
}

export default function PrintersPage() {
  const [printers, setPrinters] = useState<PrinterDevice[]>(mockPrinters)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingPrinter, setEditingPrinter] = useState<PrinterDevice | null>(null)
  const [deleteConfirmPrinter, setDeleteConfirmPrinter] = useState<PrinterDevice | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showSaveSettingsDialog, setShowSaveSettingsDialog] = useState(false)
  
  // Add printer form state
  const [newPrinterForm, setNewPrinterForm] = useState({
    name: "",
    type: "receipt" as "receipt" | "label" | "report",
    connection: "usb" as "usb" | "network" | "bluetooth",
    ipAddress: "",
    port: "9100",
    paperWidth: "80mm" as "58mm" | "80mm",
  })
  
  // Edit printer form state
  const [editPrinterForm, setEditPrinterForm] = useState({
    name: "",
    type: "receipt" as "receipt" | "label" | "report",
    connection: "usb" as "usb" | "network" | "bluetooth",
    ipAddress: "",
    port: "9100",
    paperWidth: "80mm" as "58mm" | "80mm",
  })
  
  // Print settings state
  const [printSettings, setPrintSettings] = useState({
    autoPrintReceipts: true,
    printCustomerCopy: false,
    includeStoreLogo: true,
    showQRCode: false,
  })

  const handleTestPrint = (printerId: string) => {
    const printer = printers.find((p) => p.id === printerId)
    if (printer?.status === "online") {
      toast.success(`Test page sent to ${printer.name}`)
    } else {
      toast.error("Cannot print: Printer is offline")
    }
  }

  const handleSetDefault = (printerId: string) => {
    setPrinters(
      printers.map((p) => ({
        ...p,
        isDefault: p.id === printerId,
      }))
    )
    toast.success("Default printer updated")
  }

  const handleAddPrinter = (e: React.FormEvent) => {
    e.preventDefault()
    const newPrinter: PrinterDevice = {
      id: `prt_${Date.now()}`,
      name: newPrinterForm.name,
      type: newPrinterForm.type,
      connection: newPrinterForm.connection,
      ipAddress: newPrinterForm.connection === "network" ? newPrinterForm.ipAddress : undefined,
      port: newPrinterForm.connection === "network" ? parseInt(newPrinterForm.port) : undefined,
      status: "offline",
      isDefault: printers.length === 0,
      paperWidth: newPrinterForm.paperWidth,
    }
    setPrinters([...printers, newPrinter])
    setIsAddDialogOpen(false)
    setNewPrinterForm({
      name: "",
      type: "receipt",
      connection: "usb",
      ipAddress: "",
      port: "9100",
      paperWidth: "80mm",
    })
    toast.success("Printer added successfully")
  }

  const openEditDialog = (printer: PrinterDevice) => {
    setEditingPrinter(printer)
    setEditPrinterForm({
      name: printer.name,
      type: printer.type,
      connection: printer.connection,
      ipAddress: printer.ipAddress || "",
      port: printer.port?.toString() || "9100",
      paperWidth: printer.paperWidth,
    })
    setIsEditDialogOpen(true)
  }

  const handleEditPrinter = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPrinter) return
    
    setPrinters(printers.map(p => {
      if (p.id === editingPrinter.id) {
        return {
          ...p,
          name: editPrinterForm.name,
          type: editPrinterForm.type,
          connection: editPrinterForm.connection,
          ipAddress: editPrinterForm.connection === "network" ? editPrinterForm.ipAddress : undefined,
          port: editPrinterForm.connection === "network" ? parseInt(editPrinterForm.port) : undefined,
          paperWidth: editPrinterForm.paperWidth,
        }
      }
      return p
    }))
    setIsEditDialogOpen(false)
    setEditingPrinter(null)
    toast.success("Printer updated successfully")
  }

  const handleRemove = () => {
    if (!deleteConfirmPrinter) return
    setPrinters(printers.filter((p) => p.id !== deleteConfirmPrinter.id))
    setDeleteConfirmPrinter(null)
    toast.success("Printer removed")
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    toast.info("Scanning for printers...")
    setTimeout(() => {
      // Simulate status changes
      setPrinters(printers.map(p => ({
        ...p,
        status: Math.random() > 0.3 ? "online" : p.status,
      })))
      setIsRefreshing(false)
      toast.success("Printer status refreshed")
    }, 1500)
  }

  const handleSaveSettings = () => {
    // Settings would be persisted to backend/database in production
    setShowSaveSettingsDialog(false)
    toast.success("Print settings saved")
  }

  return (
    <DashboardShell title="Printer Setup" description="Configure receipt and label printers">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Scanning..." : "Refresh Status"}
        </Button>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Printer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Printer</DialogTitle>
              <DialogDescription>
                Configure a new printer for receipts or labels
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddPrinter}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Printer Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g., Receipt Printer - Counter 1" 
                    value={newPrinterForm.name}
                    onChange={(e) => setNewPrinterForm({ ...newPrinterForm, name: e.target.value })}
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Printer Type</Label>
                  <Select 
                    value={newPrinterForm.type} 
                    onValueChange={(v) => setNewPrinterForm({ ...newPrinterForm, type: v as "receipt" | "label" | "report" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receipt">Receipt Printer</SelectItem>
                      <SelectItem value="label">Label Printer</SelectItem>
                      <SelectItem value="report">Report Printer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="connection">Connection Type</Label>
                  <Select 
                    value={newPrinterForm.connection} 
                    onValueChange={(v) => setNewPrinterForm({ ...newPrinterForm, connection: v as "usb" | "network" | "bluetooth" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usb">USB</SelectItem>
                      <SelectItem value="network">Network (TCP/IP)</SelectItem>
                      <SelectItem value="bluetooth">Bluetooth</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newPrinterForm.connection === "network" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="ip">IP Address</Label>
                      <Input 
                        id="ip" 
                        placeholder="192.168.1.50" 
                        value={newPrinterForm.ipAddress}
                        onChange={(e) => setNewPrinterForm({ ...newPrinterForm, ipAddress: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="port">Port</Label>
                      <Input 
                        id="port" 
                        placeholder="9100" 
                        value={newPrinterForm.port}
                        onChange={(e) => setNewPrinterForm({ ...newPrinterForm, port: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="paper">Paper Width</Label>
                  <Select 
                    value={newPrinterForm.paperWidth} 
                    onValueChange={(v) => setNewPrinterForm({ ...newPrinterForm, paperWidth: v as "58mm" | "80mm" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="58mm">58mm (Narrow)</SelectItem>
                      <SelectItem value="80mm">80mm (Standard)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Printer</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {printers.map((printer) => {
          const status = statusConfig[printer.status]
          return (
            <Card key={printer.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                      <Printer className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{printer.name}</h3>
                        {printer.isDefault && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          {connectionIcons[printer.connection]}
                          {printer.connection.toUpperCase()}
                        </span>
                        {printer.ipAddress && (
                          <>
                            <span>|</span>
                            <code>{printer.ipAddress}:{printer.port}</code>
                          </>
                        )}
                        <span>|</span>
                        <span>{printer.paperWidth}</span>
                        <span>|</span>
                        <span className="capitalize">{printer.type} printer</span>
                      </div>
                      <div className="mt-2">
                        <Badge variant="outline" className={status.color}>
                          {status.icon}
                          <span className="ml-1">{status.label}</span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestPrint(printer.id)}
                      disabled={printer.status !== "online"}
                    >
                      Test Print
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleSetDefault(printer.id)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Set as Default
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(printer)}>
                          <Settings className="mr-2 h-4 w-4" />
                          Configure
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteConfirmPrinter(printer)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {printers.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Printer className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No Printers Configured</h3>
              <p className="mb-4 text-muted-foreground">
                Add a printer to start printing receipts and labels
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Printer
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Print Settings</CardTitle>
          <CardDescription>Configure default printing behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto-print Receipts</p>
              <p className="text-sm text-muted-foreground">
                Automatically print receipt after each transaction
              </p>
            </div>
            <Switch 
              checked={printSettings.autoPrintReceipts} 
              onCheckedChange={(checked) => setPrintSettings({ ...printSettings, autoPrintReceipts: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Print Customer Copy</p>
              <p className="text-sm text-muted-foreground">
                Print an additional copy for the customer
              </p>
            </div>
            <Switch 
              checked={printSettings.printCustomerCopy} 
              onCheckedChange={(checked) => setPrintSettings({ ...printSettings, printCustomerCopy: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Include Store Logo</p>
              <p className="text-sm text-muted-foreground">
                Print store logo on receipts
              </p>
            </div>
            <Switch 
              checked={printSettings.includeStoreLogo} 
              onCheckedChange={(checked) => setPrintSettings({ ...printSettings, includeStoreLogo: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Show QR Code</p>
              <p className="text-sm text-muted-foreground">
                Include QR code for digital receipt
              </p>
            </div>
            <Switch 
              checked={printSettings.showQRCode} 
              onCheckedChange={(checked) => setPrintSettings({ ...printSettings, showQRCode: checked })}
            />
          </div>
          <Separator />
          <div className="flex justify-end">
            <Button onClick={() => setShowSaveSettingsDialog(true)}>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Settings Confirmation Dialog */}
      <AlertDialog open={showSaveSettingsDialog} onOpenChange={setShowSaveSettingsDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Print Settings</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to save these print settings? This will update the default printing behavior for all transactions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveSettings}>
              Save Settings
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Printer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Configure Printer</DialogTitle>
            <DialogDescription>
              Update printer settings
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditPrinter}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Printer Name</Label>
                <Input 
                  id="edit-name" 
                  placeholder="e.g., Receipt Printer - Counter 1" 
                  value={editPrinterForm.name}
                  onChange={(e) => setEditPrinterForm({ ...editPrinterForm, name: e.target.value })}
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-type">Printer Type</Label>
                <Select 
                  value={editPrinterForm.type} 
                  onValueChange={(v) => setEditPrinterForm({ ...editPrinterForm, type: v as "receipt" | "label" | "report" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receipt">Receipt Printer</SelectItem>
                    <SelectItem value="label">Label Printer</SelectItem>
                    <SelectItem value="report">Report Printer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-connection">Connection Type</Label>
                <Select 
                  value={editPrinterForm.connection} 
                  onValueChange={(v) => setEditPrinterForm({ ...editPrinterForm, connection: v as "usb" | "network" | "bluetooth" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usb">USB</SelectItem>
                    <SelectItem value="network">Network (TCP/IP)</SelectItem>
                    <SelectItem value="bluetooth">Bluetooth</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {editPrinterForm.connection === "network" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-ip">IP Address</Label>
                    <Input 
                      id="edit-ip" 
                      placeholder="192.168.1.50" 
                      value={editPrinterForm.ipAddress}
                      onChange={(e) => setEditPrinterForm({ ...editPrinterForm, ipAddress: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-port">Port</Label>
                    <Input 
                      id="edit-port" 
                      placeholder="9100" 
                      value={editPrinterForm.port}
                      onChange={(e) => setEditPrinterForm({ ...editPrinterForm, port: e.target.value })}
                      required
                    />
                  </div>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="edit-paper">Paper Width</Label>
                <Select 
                  value={editPrinterForm.paperWidth} 
                  onValueChange={(v) => setEditPrinterForm({ ...editPrinterForm, paperWidth: v as "58mm" | "80mm" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="58mm">58mm (Narrow)</SelectItem>
                    <SelectItem value="80mm">80mm (Standard)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmPrinter} onOpenChange={(open) => !open && setDeleteConfirmPrinter(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Printer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove &quot;{deleteConfirmPrinter?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemove} className="bg-destructive hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  )
}
