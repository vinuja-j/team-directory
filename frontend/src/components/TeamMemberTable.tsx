import { useState } from 'react';
import { ChevronUp, ChevronDown, Edit, Trash2 } from 'lucide-react';
import { type TeamMember} from '@/types/TeamMember';

interface TeamMemberTableProps {
  members: TeamMember[];
  onEditMember: (member: TeamMember) => void;
  onDeleteMember: (member: TeamMember) => void;
}

type SortField = keyof TeamMember;
type SortDirection = 'asc' | 'desc';


/**
 * Table component to display team members with sorting and action buttons.
 * @param members - Array of team members to display.
 * @param onEditMember - Callback function to handle editing a team member.
 * @param onDeleteMember - Callback function to handle deleting a team member.
 */
export const TeamMemberTable = ({ members, onEditMember, onDeleteMember }: TeamMemberTableProps) => {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedMembers = [...members].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ChevronDown className="h-4 w-4 text-gray-300" />;
    }
    return sortDirection === 'asc' ? 
      <ChevronDown className="h-4 w-4 text-gray-500" /> : 
      <ChevronUp className="h-4 w-4 text-gray-500" />;
  };

  const getBadgeClass = (type: TeamMember['employmentType']) => {
    switch (type) {
      case 'Full-time':
        return 'bg-green-100 text-green-700';
      case 'Part-time':
        return 'bg-blue-100 text-blue-700';
      case 'Intern':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('name')}>
              <div className="flex items-center gap-1">Name <SortIcon field="name" /></div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('email')}>
              <div className="flex items-center gap-1">Email <SortIcon field="email" /></div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('role')}>
              <div className="flex items-center gap-1">Job Title <SortIcon field="role" /></div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('employmentType')}>
              <div className="flex items-center gap-1">Employment Type <SortIcon field="employmentType" /></div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions <SortIcon field={null as any} /></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sortedMembers.map((member) => (
            <tr key={member.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{member.name}</td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{member.email}</td>
              <td className="px-6 py-4 text-gray-900 whitespace-nowrap">{member.role}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgeClass(member.employmentType)}`}>{member.employmentType}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <button
                    className="p-2 rounded hover:bg-gray-100"
                    aria-label="Edit"
                    onClick={() => onEditMember(member)}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 rounded hover:bg-gray-100"
                    aria-label="Delete"
                    onClick={() => onDeleteMember(member)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 