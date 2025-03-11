import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// This would come from the database
const pendingResources = [
  {
    id: 1,
    title: "Calculus Study Guide",
    course: "MATH 121",
    submittedBy: "John Doe",
    submittedAt: "2024-01-31",
    type: "PDF",
  },
  {
    id: 2,
    title: "Physics Lab Report Template",
    course: "PHYS 117",
    submittedBy: "Jane Smith",
    submittedAt: "2024-01-30",
    type: "DOCX",
  },
];

export default function PendingContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pending Resources</h1>
        <p className="text-muted-foreground">Review and approve submitted resources</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pending Approval</CardTitle>
          <CardDescription>Resources waiting for administrator review</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-medium">{resource.title}</TableCell>
                  <TableCell>{resource.course}</TableCell>
                  <TableCell>{resource.submittedBy}</TableCell>
                  <TableCell>{resource.submittedAt}</TableCell>
                  <TableCell>{resource.type}</TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
                      Approve
                    </Button>
                    <Button variant="destructive" size="sm">
                      Deny
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
