export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
    employmentType: 'Full-time' | 'Part-time' | 'Intern';
}

/**
 * Returns the CSS classes for the badge based on the employment type.
 * @param type - The employment type of the team member.
 * @returns CSS classes for the badge.
 */
export const getEmploymentTypeColor = (type: TeamMember['employmentType']) => {
  switch (type) {
    case 'Full-time':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Part-time':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Intern':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
