
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type Address = {
  id: string;
  label: string;
  address: string;
  isDefault: boolean;
};

type AddressFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address?: Address;
  onSave: (address: Omit<Address, 'id'>) => void;
};

const AddressForm = ({ open, onOpenChange, address, onSave }: AddressFormProps) => {
  const [formData, setFormData] = useState({
    label: address?.label || "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    isDefault: address?.isDefault || false,
  });

  // Parse existing address if editing
  React.useEffect(() => {
    if (address) {
      const parts = address.address.split(', ');
      setFormData({
        label: address.label,
        streetAddress: parts[0] || "",
        city: parts[1] || "",
        state: parts[2]?.split(' ')[0] || "",
        zipCode: parts[2]?.split(' ')[1] || "",
        isDefault: address.isDefault,
      });
    } else {
      setFormData({
        label: "",
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
        isDefault: false,
      });
    }
  }, [address, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullAddress = `${formData.streetAddress}, ${formData.city}, ${formData.state} ${formData.zipCode}`;
    onSave({
      label: formData.label,
      address: fullAddress,
      isDefault: formData.isDefault,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{address ? "Edit Address" : "Add New Address"}</DialogTitle>
          <DialogDescription>
            {address ? "Update your address details below." : "Add a new delivery address to your account."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="label">Address Label</Label>
            <Select value={formData.label} onValueChange={(value) => setFormData({...formData, label: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select address type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Home">Home</SelectItem>
                <SelectItem value="Work">Work</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="streetAddress">Street Address</Label>
            <Input
              id="streetAddress"
              value={formData.streetAddress}
              onChange={(e) => setFormData({...formData, streetAddress: e.target.value})}
              placeholder="123 Main Street"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                placeholder="City"
                required
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
                placeholder="State"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              id="zipCode"
              value={formData.zipCode}
              onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
              placeholder="12345"
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
            />
            <Label htmlFor="isDefault">Set as default address</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-brand-orange hover:bg-brand-orange/90">
              {address ? "Update Address" : "Add Address"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddressForm;
