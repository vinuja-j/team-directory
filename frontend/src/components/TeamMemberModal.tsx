import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {type TeamMember } from '@/types/TeamMember';

interface TeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: Omit<TeamMember, 'id'>) => void;
  editingMember?: TeamMember | null;
  mode: 'add' | 'edit';
}

const jobTitleOptions = [
  'Software Engineer',
  'UI/UX Designer',
  'QA Engineer',
  'Product Manager',
  'Full Stack Developer'
];

const employmentTypeOptions = [
  'Full-time',
  'Part-time',
  'Intern'
] as const;

export const TeamMemberModal = ({ isOpen, onClose, onSave, editingMember, mode }: TeamMemberModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    employmentType: 'Full-time' as TeamMember['employmentType']
  });

  useEffect(() => {
    if (editingMember && mode === 'edit') {
      setFormData({
        name: editingMember.name,
        email: editingMember.email,
        role: editingMember.role,
        employmentType: editingMember.employmentType
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: '',
        employmentType: 'Full-time'
      });
    }
  }, [editingMember, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.role) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add Team Member' : 'Edit Team Member'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter full name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Job Title</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData(prev => ({ ...prev, jobTitle: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select job title" />
              </SelectTrigger>
              <SelectContent>
                {jobTitleOptions.map((title) => (
                  <SelectItem key={title} value={title}>
                    {title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="employmentType">Employment Type</Label>
            <Select
              value={formData.employmentType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, employmentType: value as TeamMember['employmentType'] }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employment type" />
              </SelectTrigger>
              <SelectContent>
                {employmentTypeOptions.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'add' ? 'Add' : 'Update'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 