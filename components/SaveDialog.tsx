import { FC, HTMLAttributes, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SaveDialogProps extends HTMLAttributes<HTMLDivElement> {
  setName: (name: string) => void
  saveFlashcards: () => void
  open: boolean
  setOpen: any
}

const SaveDialog: FC<SaveDialogProps> = ({ setName, saveFlashcards, className, open, setOpen, ...props}) => {

  return (
    <div {...props} className={className}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default" className="my-4">Save Flashcards</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save Flashcards</DialogTitle>
            <DialogDescription>
              Add Flashcards to your Collection
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="name">
                Collection Name
              </Label>
              <Input 
                id="name" 
                className="col-span-3 flex-1" 
                autoFocus 
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={saveFlashcards}>Save Collection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SaveDialog;