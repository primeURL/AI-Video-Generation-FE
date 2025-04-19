import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface GenerationStatusProps {
  progress: number;
  status: string;
  onCancel: () => void;
}

export function GenerationStatus({ progress, status, onCancel }: GenerationStatusProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium text-slate-900 mb-4">Generating Your Video</h3>
        <div className="mb-4">
          <Progress value={progress} className="h-2 w-full" />
          <p className="mt-2 text-sm text-slate-500">{status}</p>
        </div>
        <div className="flex justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
