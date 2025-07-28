import React, { useState } from "react";
import Papa from "papaparse";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Upload } from "lucide-react";
import { useMutation } from "@apollo/client";
import { CREATE_BULK_TEAM_MEMBERS, GET_TEAM_MEMBERS } from "../graphql/queries";

// Define the expected CSV row structure
interface CSVRow {
  name: string;
  email: string;
  role: string;
  employmentType: 'FullTime' | 'PartTime' | 'Intern';
}

// Props for the CSVUpload modal
interface CSVUploadProps {
  open: boolean;
  onClose: () => void;
}

/**
 * CSVUpload modal for uploading and previewing team members from a CSV file.
 * Uses shadcn/ui and Tailwind for UI, papaparse for parsing.
 */
const CSVUpload: React.FC<CSVUploadProps> = ({ open, onClose }) => {
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // GraphQL mutation for bulk creation
  const [createBulkTeamMembers] = useMutation(CREATE_BULK_TEAM_MEMBERS, {
    refetchQueries: [{ query: GET_TEAM_MEMBERS }],
  });

  // Handle file upload and parse CSV
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError("");
    setLoading(true);

    Papa.parse(file, {
      complete: (results) => {
        setLoading(false);
        try {
          const data = results.data as string[][];
          // Skip header row and filter out empty rows
          const rows = data.slice(1).filter(row => row.some(cell => cell && cell.trim()));
          // Map CSV columns to our team member structure
          // Expected CSV format: name, email, role, employmentType
          const parsedData: CSVRow[] = rows.map((row, index) => {
            if (row.length < 4) {
              throw new Error(`Row ${index + 2} is missing required fields (name, email, role, employmentType)`);
            }
            
            const employmentType = row[3]?.trim();
            if (!['FullTime', 'PartTime', 'Intern'].includes(employmentType)) {
              throw new Error(`Row ${index + 2} has invalid employmentType: "${employmentType}". Must be "FullTime", "PartTime", or "Intern"`);
            }
            
            return {
              name: row[0]?.trim() || '',
              email: row[1]?.trim() || '',
              role: row[2]?.trim() || '',
              employmentType: employmentType as 'FullTime' | 'PartTime' | 'Intern',
            };
          });
          // Validate required fields
          const invalidRows = parsedData.filter(row => !row.name || !row.email || !row.role || !row.employmentType);
          if (invalidRows.length > 0) {
            throw new Error(`${invalidRows.length} rows are missing required fields`);
          }
          setCsvData(parsedData);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Error parsing CSV file');
        }
      },
      header: false,
      skipEmptyLines: true,
      error: (error) => {
        setLoading(false);
        setError(`Error reading file: ${error.message}`);
      },
    });
  };

  // Submit parsed data to backend
  const handleSubmit = async () => {
    if (csvData.length === 0) return;
    setLoading(true);
    try {
      console.log('Uploading CSV data:', csvData);
      await createBulkTeamMembers({
        variables: { input: { inputs: csvData } },
      });
      // Reset and close
      setCsvData([]);
      setFileName("");
      setError("");
      onClose();
    } catch (err) {
      console.error('Error uploading CSV:', err);
      setError(err instanceof Error ? err.message : 'Error uploading team members');
    } finally {
      setLoading(false);
    }
  };

  // Reset state and close modal
  const handleClose = () => {
    setCsvData([]);
    setFileName("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Team Members (CSV)
          </DialogTitle>
        </DialogHeader>
        {/* Instructions and expected format */}
        <div className="mb-3">
          <p className="text-sm text-muted-foreground mb-2">
            Upload a CSV file with team member information. Expected format:
          </p>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="bg-primary text-primary-foreground rounded px-2 py-1 text-xs">name</span>
            <span className="bg-primary text-primary-foreground rounded px-2 py-1 text-xs">email</span>
            <span className="bg-primary text-primary-foreground rounded px-2 py-1 text-xs">role</span>
            <span className="bg-primary text-primary-foreground rounded px-2 py-1 text-xs">employmentType</span>
          </div>
          <p className="text-xs text-muted-foreground">
            employmentType must be: "FullTime", "PartTime", or "Intern"
          </p>
        </div>
        {/* File input */}
        <Input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="mb-2"
        />
        {fileName && (
          <p className="text-xs mb-2">Selected file: <span className="font-medium">{fileName}</span></p>
        )}
        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm mb-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
        {/* Loading state */}
        {loading && (
          <p className="text-sm text-muted-foreground">Processing...</p>
        )}
        {/* Preview table */}
        {csvData.length > 0 && (
          <div className="mt-2">
            <p className="font-semibold mb-1 text-sm">Preview ({csvData.length} team members):</p>
            <div className="overflow-x-auto max-h-64 border rounded">
              <table className="min-w-full text-xs">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-2 py-1 text-left">Name</th>
                    <th className="px-2 py-1 text-left">Email</th>
                    <th className="px-2 py-1 text-left">Role</th>
                    <th className="px-2 py-1 text-left">Employment Type</th>
                  </tr>
                </thead>
                <tbody>
                  {csvData.slice(0, 10).map((row, idx) => (
                    <tr key={idx} className="even:bg-muted/50">
                      <td className="px-2 py-1">{row.name}</td>
                      <td className="px-2 py-1">{row.email}</td>
                      <td className="px-2 py-1">{row.role}</td>
                      <td className="px-2 py-1">{row.employmentType}</td>
                    </tr>
                  ))}
                  {csvData.length > 10 && (
                    <tr>
                      <td colSpan={4} className="text-center py-1">... and {csvData.length - 10} more rows</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleClose} type="button">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={csvData.length === 0 || loading}
            type="button"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload{csvData.length > 0 ? ` ${csvData.length} Members` : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CSVUpload; 