'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddApplicationForm } from '@/components/tracker/AddApplicationForm';
import { PlusCircle } from 'lucide-react';

export function AddApplicationDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Manual Application
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Application</DialogTitle>
          <DialogDescription>
            Manually add a job application you found elsewhere to your tracker.
          </DialogDescription>
        </DialogHeader>
        <AddApplicationForm onFormSubmit={() => setIsDialogOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
