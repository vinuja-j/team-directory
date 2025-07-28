import { Upload, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TeamDirectoryHeaderProps {
  onAddMember: () => void;
  onImportCSV: () => void;
}

/**
 * Header section for the Team Directory page.
 * Displays the title, description, and action buttons for importing CSV and adding team members.
 * @param { onAddMember } - Callback function to handle adding a new team member.
 * @param { onImportCSV } - Callback function to handle importing CSV.
 */
export const TeamDirectoryHeader = ({ onAddMember, onImportCSV }: TeamDirectoryHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Directory</h1>
          <p className="text-gray-600">View team members, roles, and contact details at a glance.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:text-accent-foreground h-10 px-4 py-2 hover:bg-gray-50 transition-colors"
            onClick={onImportCSV}
          >
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          <Button
            onClick={onAddMember}
            className="flex items-center gap-2 justify-center whitespace-nowrap rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Team Member
          </Button>
        </div>
      </div>
    </div>
  );
}; 