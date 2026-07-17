import { useRef, useState } from "react";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Loader2, Copy } from "lucide-react";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Media() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.media.list.useQuery();

  const uploadMutation = trpc.media.upload.useMutation({
    onSuccess: () => { toast.success("Uploaded"); utils.media.list.invalidate(); },
    onError: (err) => toast.error(err.message),
  });
  const deleteMutation = trpc.media.delete.useMutation({
    onSuccess: () => { toast.success("Deleted"); utils.media.list.invalidate(); },
    onError: (err) => toast.error(err.message),
  });

  const handleFile = async (file: File) => {
    setIsUploading(true);
    try {
      const base64Data = await fileToBase64(file);
      await uploadMutation.mutateAsync({ filename: file.name, mimeType: file.type, base64Data });
    } finally {
      setIsUploading(false);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied");
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Media Library</h1>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
        <Button onClick={() => inputRef.current?.click()} disabled={isUploading}>
          {isUploading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Upload className="w-4 h-4 mr-1" />}
          Upload File
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-[13px]">Loading...</p>
      ) : data?.length === 0 ? (
        <p className="text-muted-foreground text-[13px] py-10 text-center">No media uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {data?.map((item) => (
            <div key={item.id} className="bg-white rounded-lg border overflow-hidden group relative">
              <div className="aspect-square bg-muted">
                {item.mimeType?.startsWith("image/") ? (
                  <img src={item.url} alt={item.altText || item.filename} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[11px] text-muted-foreground p-2 text-center">
                    {item.filename}
                  </div>
                )}
              </div>
              <div className="p-2 flex items-center justify-between gap-1">
                <p className="text-[10px] truncate flex-1" title={item.filename}>{item.filename}</p>
                <button onClick={() => copyUrl(item.url)} className="text-muted-foreground hover:text-foreground">
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => { if (confirm("Delete this file?")) deleteMutation.mutate({ id: item.id }); }}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
