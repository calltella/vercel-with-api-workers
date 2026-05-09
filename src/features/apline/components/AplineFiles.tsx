import { Paperclip } from "lucide-react";
import type { AplineAttachFile } from "@/src/features/apline/types/ui";

type Props = {
  files?: AplineAttachFile[];
};

export function AplineFiles({ files }: Props) {
  if (!files || files.length === 0) return null;

  return (
    <div className="w-full px-3 my-2">
      <ul className="space-y-1">
        {files.map((f) => (
          <li key={f.downloadKey} className="flex items-center gap-2">
            <Paperclip className="w-4 h-4" />
            <a
              href={`/apline/files/${f.downloadKey}`}
              download
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              {f.fileName}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}