import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { CREATE_TEAM_MEMBER, REMOVE_TEAM_MEMBER, GET_TEAM_MEMBERS, UPDATE_TEAM_MEMBER } from '../graphql/queries';
import { TeamDirectoryHeader } from './TeamDirectoryHeader';
import { TeamMemberTable } from './TeamMemberTable';
import { TeamMemberModal } from './TeamMemberModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal.tsx';
import { type TeamMember } from '@/types/TeamMember';
import CSVUpload from './CSVUpload';

/**
 * Main container component for the Team Directory page.
 * It manages the state of team members and handles adding, editing, and deleting members.
 */
export const TeamDirectory = () => {
  // Fetch team members from backend
  const { data, loading, error } = useQuery(GET_TEAM_MEMBERS);

  // Add and delete mutations
  const [createTeamMember] = useMutation(CREATE_TEAM_MEMBER, {
    refetchQueries: [{ query: GET_TEAM_MEMBERS }],
  });
  const [removeTeamMember] = useMutation(REMOVE_TEAM_MEMBER, {
    refetchQueries: [{ query: GET_TEAM_MEMBERS }],
  });
  const [updateTeamMember] = useMutation(UPDATE_TEAM_MEMBER, {
    refetchQueries: [{ query: GET_TEAM_MEMBERS }],
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<TeamMember | null>(null);
  const [csvUploadOpen, setCsvUploadOpen] = useState(false);

  // These handlers are now only for modal state, not for updating the table directly
  const handleAddMember = async (memberData: Omit<TeamMember, 'id'>) => {
    try {
      console.log('Adding member:', memberData);
      await createTeamMember({ variables: { input: memberData } });
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Error adding member:', err);
      // Optionally handle error
      setIsAddModalOpen(false);
    }
  };

  const handleEditMember = async (memberData: Omit<TeamMember, 'id'>) => {
    if (editingMember) {
      try {
        await updateTeamMember({ variables: { id: editingMember.id, input: memberData } });
        setIsEditModalOpen(false);
        setEditingMember(null);
      } catch (err) {
        setIsEditModalOpen(false);
      setEditingMember(null);
      }
    }
  };

  const handleDeleteMember = async () => {
    if (deletingMember) {
      try {
        await removeTeamMember({ variables: { id: deletingMember.id } });
      } catch (err) {
        // Optionally handle error
      }
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
        <TeamDirectoryHeader onAddMember={() => setIsAddModalOpen(true)} onImportCSV={() => setCsvUploadOpen(true)} />
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading team members...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">Error loading team members.</div>
        ) : (
        <TeamMemberTable 
            members={data?.teamMembers || []}
          onEditMember={openEditModal}
          onDeleteMember={openDeleteModal}
        />
        )}
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
        <CSVUpload open={csvUploadOpen} onClose={() => setCsvUploadOpen(false)} />
      </div>
    </div>
  );
};