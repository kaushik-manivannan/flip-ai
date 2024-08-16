import { FC, FormEvent, HTMLAttributes } from "react";
import SaveDialog from "./SaveDialog";

interface TextInputFormProps extends HTMLAttributes<HTMLDivElement> {
  handleSubmit: any
  setText: any
  setName: (name: string) => void
  flashcards: any
  saveFlashcards: any
  open: boolean
  setOpen: any
}

const TextInputForm: FC<TextInputFormProps> = ({ className, handleSubmit, setText, flashcards, saveFlashcards, open, setOpen, setName, ...props }) => {


  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div {...props} className={className}>
      {flashcards.length > 0 && (
            <SaveDialog setName={setName} saveFlashcards={saveFlashcards} open={open} setOpen={setOpen} className="flex justify-center"/>
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="chat" className="sr-only">Enter a topic</label>
        <div className="flex items-center px-3 py-2 rounded-lg bg-secondary dark:bg-muted">
          <textarea
            id="chat"
            autoFocus
            rows={1}
            onKeyDown={handleKeyDown}
            className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-muted dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-none"
            placeholder="Enter a topic..."
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <button
            onClick={handleSubmit}
            className="inline-flex justify-center p-2 text-primary rounded-full cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-600"
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