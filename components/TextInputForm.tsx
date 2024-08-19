import { FC, FormEvent, HTMLAttributes, useEffect, useRef } from "react";
import SaveDialog from "./SaveDialog";

interface TextInputFormProps extends HTMLAttributes<HTMLDivElement> {
  handleSubmit: any
  setText: any
  setName: (name: string) => void
  flashcards: any
  saveFlashcards: any
  open: boolean
  setOpen: any
  disabled?: boolean
}

const TextInputForm: FC<TextInputFormProps> = ({ className, handleSubmit, setText, flashcards, saveFlashcards, open, setOpen, disabled, setName, ...props }) => {

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [disabled]);


  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div {...props} className={className}>
      {!disabled && flashcards.length > 0 && (
            <SaveDialog setName={setName} saveFlashcards={saveFlashcards} open={open} setOpen={setOpen} className="flex justify-center"/>
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="chat" className="sr-only">Enter a topic</label>
        <div className="flex items-center px-3 py-2 rounded-lg bg-secondary dark:bg-primary-foreground">
          <textarea
            id="chat"
            ref={textareaRef}
            rows={1}
            onKeyDown={handleKeyDown}
            className="block mx-4 p-2.5 w-full text-gray-900 bg-white dark:bg-muted rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-primary dark:placeholder-primary dark:text-foreground dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-none text-md"
            placeholder="Enter a topic (e.g. Deep Sea)"
            onChange={(e) => setText(e.target.value)}
            disabled={disabled}
          ></textarea>
          <button
            onClick={handleSubmit}
            className="inline-flex justify-center p-2 text-primary rounded-full cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-600"
            disabled={disabled}
          >
            <svg className="w-5 h-5 rotate-90 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
              <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z"/>
            </svg>
            <span className="sr-only">Send message</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default TextInputForm;