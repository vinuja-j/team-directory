// src/components/TeamDirectory.tsx
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Alert,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import {
  GET_TEAM_MEMBERS,
  CREATE_TEAM_MEMBER,
  UPDATE_TEAM_MEMBER,
  DELETE_TEAM_MEMBER,
  TeamMember,
  CreateTeamMemberInput,
  UpdateTeamMemberInput,
} from '../graphql/queries';

const TeamDirectory: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<CreateTeamMemberInput>({
    name: '',
    email: '',
    role: '',
  });

  // GraphQL hooks
  const { loading, error, data } = useQuery(GET_TEAM_MEMBERS);
  const [createTeamMember] = useMutation(CREATE_TEAM_MEMBER, {
    refetchQueries: [{ query: GET_TEAM_MEMBERS }],
  });
  const [updateTeamMember] = useMutation(UPDATE_TEAM_MEMBER, {
    refetchQueries: [{ query: GET_TEAM_MEMBERS }],
  });
  const [deleteTeamMember] = useMutation(DELETE_TEAM_MEMBER, {
    refetchQueries: [{ query: GET_TEAM_MEMBERS }],
  });

  const handleOpen = (member?: TeamMember) => {
    if (member) {
      setEditingMember(member);
      setFormData({ name: member.name, email: member.email, role: member.role });
    } else {
      setEditingMember(null);
      setFormData({ name: '', email: '', role: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingMember(null);
    setFormData({ name: '', email: '', role: '' });
  };

  const handleSubmit = async () => {
    try {
      if (editingMember) {
        await updateTeamMember({
          variables: {
            id: editingMember.id,
            input: formData,
          },
        });
      } else {
        await createTeamMember({
          variables: {
            input: formData,
          },
        });
      }
      handleClose();
    } catch (err) {
      console.error('Error saving team member:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await deleteTeamMember({
          variables: { id },
        });
      } catch (err) {
        console.error('Error deleting team member:', err);
      }
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Alert severity="error">Error: {error.message}</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Team Directory</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add Team Member
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.teamMembers?.map((member: TeamMember) => (
              <TableRow key={member.id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(member)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(member.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Role"
            fullWidth
            variant="outlined"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingMember ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeamDirectory;