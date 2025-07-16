import { useState } from 'react';
import { TeamDirectoryHeader } from './TeamDirectoryHeader';
import { TeamMemberTable } from './TeamMemberTable';
import { TeamMemberModal } from './TeamMemberModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal.tsx';
import { type TeamMember } from '@/types/TeamMember';

// Sample data without start date
const initialTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Maya Fernandez',
    email: 'maya.fernandez@gmail.com',
    role: 'Software Engineer',
    employmentType: 'Full-time'
  },
  {
    id: '2',
    name: 'Sara Fernandez',
    email: 'sara.fernandez@gmail.com',
    role: 'UI/UX Designer',
    employmentType: 'Full-time'
  },
  {
    id: '3',
    name: 'Yunal Fernandez',
    email: 'yunal.fernandez@gmail.com',
    role: 'QA Engineer',
    employmentType: 'Part-time'
  },
  {
    id: '4',
    name: 'Dinil Fernandez',
    email: 'dinil.fernandez@gmail.com',
    role: 'Product Manager',
    employmentType: 'Intern'
  },
  {
    id: '5',
    name: 'Maya Fernandez',
    email: 'maya.fernandez@gmail.com',
    role: 'Full Stack Developer',
    employmentType: 'Part-time'
  },
  {
    id: '6',
    name: 'Maya Fernandez',
    email: 'maya.fernandez@gmail.com',
    role: 'Software Engineer',
    employmentType: 'Full-time'
  },
  {
    id: '7',
    name: 'Maya Fernandez',
    email: 'maya.fernandez@gmail.com',
    role: 'Software Engineer',
    employmentType: 'Intern'
  },
  {
    id: '8',
    name: 'Maya Fernandez',
    email: 'maya.fernandez@gmail.com',
    role: 'Software Engineer',
    employmentType: 'Part-time'
  },
  {
    id: '9',
    name: 'Maya Fernandez',
    email: 'maya.fernandez@gmail.com',
    role: 'Software Engineer',
    employmentType: 'Full-time'
  }
];

/**
 * Main container component for the Team Directory page.
 * It manages the state of team members and handles adding, editing, and deleting members.
 */
export const TeamDirectory = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<TeamMember | null>(null);

  const handleAddMember = (memberData: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: (teamMembers.length + 1).toString()
    };
    setTeamMembers(prev => [...prev, newMember]);
  };

  const handleEditMember = (memberData: Omit<TeamMember, 'id'>) => {
    if (editingMember) {
      setTeamMembers(prev => 
        prev.map(member => 
          member.id === editingMember.id 
            ? { ...memberData, id: editingMember.id }
            : member
        )
      );
      setEditingMember(null);
    }
  };

  const handleDeleteMember = () => {
    if (deletingMember) {
      setTeamMembers(prev => prev.filter(member => member.id !== deletingMember.id));
      setDeletingMember(null);
      setIsDeleteModalOpen(false);
    }
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (member: TeamMember) => {
    setDeletingMember(member);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TeamDirectoryHeader onAddMember={() => setIsAddModalOpen(true)} />
        <TeamMemberTable 
          members={teamMembers}
          onEditMember={openEditModal}
          onDeleteMember={openDeleteModal}
        />
        
        <TeamMemberModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddMember}
          mode="add"
        />
        
        <TeamMemberModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingMember(null);
          }}
          onSave={handleEditMember}
          editingMember={editingMember}
          mode="edit"
        />
        
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingMember(null);
          }}
          onConfirm={handleDeleteMember}
        />
      </div>
    </div>
  );
};