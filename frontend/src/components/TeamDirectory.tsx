import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { TeamDirectoryHeader } from './TeamDirectoryHeader';
import { TeamMemberTable } from './TeamMemberTable';
import { TeamMemberModal } from './TeamMemberModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal.tsx';
import CSVUpload from './CSVUpload';
import { 
  GET_TEAM_MEMBERS, 
  CREATE_TEAM_MEMBER, 
  UPDATE_TEAM_MEMBER, 
  REMOVE_TEAM_MEMBER,
  type TeamMember,
  type CreateTeamMemberInput,
  type UpdateTeamMemberInput
} from '@/graphql/queries';

/**
 * Main container component for the Team Directory page.
 * It manages the state of team members and handles adding, editing, and deleting members.
 */
export const TeamDirectory = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<TeamMember | null>(null);
  const [error, setError] = useState<string | null>(null);

  // GraphQL queries and mutations
  const { data, loading, error: queryError } = useQuery(GET_TEAM_MEMBERS);
  const [createTeamMember] = useMutation(CREATE_TEAM_MEMBER, {
    refetchQueries: [{ query: GET_TEAM_MEMBERS }],
  });
  const [updateTeamMember] = useMutation(UPDATE_TEAM_MEMBER, {
    refetchQueries: [{ query: GET_TEAM_MEMBERS }],
  });
  const [removeTeamMember] = useMutation(REMOVE_TEAM_MEMBER, {
    refetchQueries: [{ query: GET_TEAM_MEMBERS }],
  });

  const teamMembers = data?.teamMembers || [];

  const handleAddMember = async (memberData: Omit<TeamMember, 'id'>) => {
    try {
      await createTeamMember({
        variables: { input: memberData as CreateTeamMemberInput },
      });
      setIsAddModalOpen(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding team member');
    }
  };

  const handleEditMember = async (memberData: Omit<TeamMember, 'id'>) => {
    if (editingMember) {
      try {
        await updateTeamMember({
          variables: { 
            id: editingMember.id, 
            input: memberData as UpdateTeamMemberInput 
          },
        });
        setEditingMember(null);
        setIsEditModalOpen(false);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error updating team member');
      }
    }
  };

  const handleDeleteMember = async () => {
    if (deletingMember) {
      try {
        await removeTeamMember({
          variables: { id: deletingMember.id },
        });
        setDeletingMember(null);
        setIsDeleteModalOpen(false);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error deleting team member');
      }
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

  const handleImportCSV = () => {
    setIsCSVModalOpen(true);
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  if (queryError) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-600">Error: {queryError.message}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 text-red-600 hover:text-red-800 text-xs underline"
            >
              Dismiss
            </button>
          </div>
        )}
        
        <TeamDirectoryHeader 
          onAddMember={() => setIsAddModalOpen(true)}
          onImportCSV={handleImportCSV}
        />
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

        <CSVUpload
          open={isCSVModalOpen}
          onClose={() => setIsCSVModalOpen(false)}
        />
      </div>
    </div>
  );
};