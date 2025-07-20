import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const RoleSelector = ({ role, setRole }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="role" className="text-sm font-medium text-gray-700">
        Select Role
      </Label>
      <Select value={role} onValueChange={(value) => setRole(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="patient">Patient</SelectItem>
          <SelectItem value="doctor">Doctor</SelectItem>
          <SelectItem value="admin">Hospital Admin</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default RoleSelector;
