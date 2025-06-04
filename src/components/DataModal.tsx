import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface DataModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'view';
  module: string;
  item?: any;
  onSuccess: () => void;
}

export const DataModal: React.FC<DataModalProps> = ({
  isOpen,
  onClose,
  mode,
  module,
  item,
  onSuccess
}) => {
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiUrl = `http://127.0.0.1:8000/api/${module}`;

  useEffect(() => {
    if (item && (mode === 'edit' || mode === 'view')) {
      const filteredItem = { ...item };
      delete filteredItem.created_at;
      delete filteredItem.updated_at;
      setFormData(filteredItem);
    } else {
      setFormData({});
    }
  }, [item, mode]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = mode === 'edit' ? `${apiUrl}/${item.id}` : apiUrl;
      const method = mode === 'edit' ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Item ${mode === 'edit' ? 'updated' : 'created'} successfully`,
        });
        onSuccess();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${mode} item`);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldLabel = (field: string) => {
    const labels: Record<string, string> = {
      warehouse_id: 'Warehouse',
      zone_id: 'Zone',
      aisle_id: 'Aisle',
      rack_id: 'Rack',
      shelf_id: 'Shelf',
      bin_id: 'Bin',
      item_id: 'Item',
      order_id: 'Order',
      customer_id: 'Customer',
      sku: 'SKU',
      name: 'Name',
      description: 'Description',
      location: 'Location',
      code: 'Code',
      label: 'Label',
      level: 'Shelf Level',
      bin_code: 'Bin Code',
      quantity: 'Quantity',
      received_at: 'Received At',
      putaway_bin_id: 'Putaway Bin',
      picked_bin_id: 'Picked Bin',
      status: 'Status',
      requested_at: 'Requested At',
      from_bin_id: 'From Bin',
      to_bin_id: 'To Bin',
      moved_at: 'Moved At',
      system_quantity: 'System Quantity',
      physical_quantity: 'Physical Quantity',
      audit_date: 'Audit Date',
      notes: 'Audit Notes',
      x_coord: 'X Coordinate',
      y_coord: 'Y Coordinate',
      path_sequence: 'Path Sequence',
      order_number: 'Order Number',
      assigned_bin_id: 'Assigned Bin',
      inbound_operation_id: 'Inbound Operation',
      priority_level: 'Priority Level',
      metric_type: 'Metric Type',
      value: 'Value',
      map_name: 'Map Name',
      map_data: 'Map Data',
      version: 'Map Version',
    };
    return labels[field] || field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const getFormFields = () => {
    const moduleFields: Record<string, string[]> = {
      'warehouses': ['name', 'location'],
      'zones': ['warehouse_id', 'name'],
      'aisles': ['zone_id', 'code'],
      'racks': ['aisle_id', 'label'],
      'shelves': ['rack_id', 'level'],
      'bins': ['shelf_id', 'bin_code'],
      'items': ['sku', 'name', 'description'],
      'stock': ['item_id', 'bin_id', 'quantity'],
      'inbound-operations': ['item_id', 'quantity', 'received_at', 'putaway_bin_id', 'status'],
      'outbound-operations': ['item_id', 'quantity', 'requested_at', 'picked_bin_id', 'status'],
      'stock-movements': ['item_id', 'from_bin_id', 'to_bin_id', 'quantity', 'moved_at'],
      'stock-audits': ['item_id', 'bin_id', 'system_quantity', 'physical_quantity', 'audit_date', 'notes'],
      'bin-coordinates': ['bin_id', 'x_coord', 'y_coord'],
      'picking-paths': ['order_id', 'bin_id'],
      'orders': ['order_number', 'customer_id', 'status'],
      'order-items': ['order_id', 'item_id', 'quantity'],
      'putaway-tasks': ['item_id', 'quantity', 'assigned_bin_id', 'inbound_operation_id', 'status'],
      'picking-tasks': ['order_id', 'item_id', 'assigned_bin_id', 'quantity', 'priority_level', 'status'],
      'warehouse-kpis': ['metric_type', 'value'],
      'warehouse-maps': ['map_name', 'map_data', 'version'],
    };

    return moduleFields[module] || ['name', 'description'];
  };

  const renderField = (field: string) => {
    const value = formData[field] || '';
    const isReadonly = mode === 'view';

    if (['description', 'notes', 'path_sequence', 'map_data'].includes(field)) {
      return (
        <Textarea
          value={value}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={`Enter ${getFieldLabel(field)}`}
          readOnly={isReadonly}
          className={isReadonly ? 'bg-gray-50' : ''}
        />
      );
    }

    if (field.includes('_at') || field.includes('date')) {
      const inputType = field.includes('date') && !field.includes('_at') ? 'date' : 'datetime-local';
      return (
        <Input
          type={inputType}
          value={value}
          onChange={(e) => handleInputChange(field, e.target.value)}
          readOnly={isReadonly}
          className={isReadonly ? 'bg-gray-50' : ''}
        />
      );
    }

    if (field.includes('quantity') || field.includes('level') || field.includes('value') || 
        field.includes('_id') || field.includes('coord')) {
      return (
        <Input
          type="number"
          step={field.includes('coord') || field === 'value' ? '0.01' : '1'}
          value={value}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={`Enter ${getFieldLabel(field)}`}
          readOnly={isReadonly}
          className={isReadonly ? 'bg-gray-50' : ''}
        />
      );
    }

    if (field === 'status' && module === 'orders') {
      return (
        <select
          value={value}
          onChange={(e) => handleInputChange(field, e.target.value)}
          disabled={isReadonly}
          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ${isReadonly ? 'bg-gray-50' : ''}`}
        >
          <option value="">Select status</option>
          <option value="pending">Pending</option>
          <option value="picked">Picked</option>
          <option value="packed">Packed</option>
          <option value="shipped">Shipped</option>
        </select>
      );
    }

    if (field === 'status' && (module === 'putaway-tasks' || module === 'picking-tasks')) {
      return (
        <select
          value={value}
          onChange={(e) => handleInputChange(field, e.target.value)}
          disabled={isReadonly}
          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ${isReadonly ? 'bg-gray-50' : ''}`}
        >
          <option value="">Select status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      );
    }

    if (field === 'priority_level') {
      return (
        <select
          value={value}
          onChange={(e) => handleInputChange(field, e.target.value)}
          disabled={isReadonly}
          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ${isReadonly ? 'bg-gray-50' : ''}`}
        >
          <option value="">Select priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      );
    }

    return (
      <Input
        type="text"
        value={value}
        onChange={(e) => handleInputChange(field, e.target.value)}
        placeholder={`Enter ${getFieldLabel(field)}`}
        readOnly={isReadonly}
        className={isReadonly ? 'bg-gray-50' : ''}
      />
    );
  };

  const getModalTitle = () => {
    const moduleTitle = module.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    if (mode === 'create') return `Create New ${moduleTitle}`;
    if (mode === 'edit') return `Edit ${moduleTitle}`;
    return `View ${moduleTitle}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getModalTitle()}</DialogTitle>
          <DialogDescription>
            {mode === 'view'
              ? 'View the details of this record.'
              : mode === 'edit'
                ? 'Modify the fields and click update to save changes.'
                : 'Fill in the required fields to create a new record.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getFormFields().map((field) => (
              <div key={field} className={['description', 'notes', 'path_sequence', 'map_data'].includes(field) ? 'md:col-span-2' : ''}>
                <Label htmlFor={field} className="capitalize">
                  {getFieldLabel(field)}
                </Label>
                {renderField(field)}
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {mode !== 'view' && (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update' : 'Create'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};