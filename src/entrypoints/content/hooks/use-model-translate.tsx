import { useOllama } from "@/hooks/use-ollama";
import { ollamaState } from "@/lib/states/ollama.state";
import { useMutation } from "@tanstack/react-query";
import { useSnapshot } from "valtio";

interface UseModelTranslateProps {
  onSuccess?: (data: { translatedContent: string }) => void;
  onError?: (error: any) => void;
  onSettled?: (data: any, error: any) => void;
}

export function useModelTranslate({ onSuccess, onError, onSettled }: UseModelTranslateProps) {
  const { translationModel, languageToTranslate } = useSnapshot(ollamaState);

  const ollama = useOllama();

  const { mutate: handleTranslate, isPending } = useMutation({
    mutationFn: async (content: string) => {
      if (!translationModel || !languageToTranslate) return;

      const response = await ollama.generate({
        model: translationModel,
        prompt: content,
        format: {
          type: "object",
          properties: {
            translatedContent: {
              type: "string",
            },
          },
          required: ["translatedContent"],
        },
        system: `Translate this content to ${languageToTranslate}`,
      });

      return JSON.parse(response.response);
    },
    onSuccess,
    onError,
    onSettled,
  });

  return { handleTranslate, isPending };
}
