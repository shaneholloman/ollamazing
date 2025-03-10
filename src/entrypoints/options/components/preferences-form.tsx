import languages from "@/assets/languages.json";
import { Combobox } from "@/components/combobox";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { preferencesState } from "@/lib/states/preferences.state";
import { zodResolver } from "@hookform/resolvers/zod";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useSnapshot } from "valtio";
import * as z from "zod";

const formSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("system"),
  lang: z.enum(["en", "vi"]).default("en"),
  translateToLanguage: z.string().default("English"),
});

export function PreferencesForm() {
  const { t, i18n } = useTranslation();

  const snap = useSnapshot(preferencesState);

  const themeOptions = useMemo(
    () => [
      { label: t("system"), value: "system", icon: MonitorIcon },
      { label: t("dark"), value: "dark", icon: MoonIcon },
      { label: t("light"), value: "light", icon: SunIcon },
    ],
    [t],
  );

  const langOptions = useMemo(
    () => [
      { label: "English", value: "en" },
      { label: "Tiếng Việt", value: "vi" },
    ],
    [],
  );

  const translateToLanguageOptions = useMemo(
    () =>
      languages.map((language) => ({
        label: `${language.name} (${language.native})`,
        value: language.name,
      })),
    [],
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      theme: snap.theme,
      lang: snap.lang,
      translateToLanguage: snap.translateToLanguage,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    preferencesState.theme = values.theme;
    preferencesState.lang = values.lang;
    preferencesState.translateToLanguage = values.translateToLanguage;

    await i18n.changeLanguage(values.lang);
    toast.success(t("preferences updated"));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("theme")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("select a theme")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {themeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <option.icon />
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lang"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("display language")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {langOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="translateToLanguage"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t("translate to language")}</FormLabel>
              <Combobox
                selectItemMsg={t("select language")}
                searchPlaceholder={`${t("search")}...`}
                noResultsMsg={t("no language found")}
                items={translateToLanguageOptions}
                value={field.value}
                onSelect={(value) => field.onChange(value)}
              />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit">{t("save")}</Button>
        </div>
      </form>
    </Form>
  );
}
