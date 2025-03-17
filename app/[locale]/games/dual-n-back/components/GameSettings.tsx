'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { GAME_CONFIG } from "../config";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Settings } from "lucide-react";

// 游戏设置类型
export type GameSettings = {
    selectedNBack: number;
    voiceType: "male" | "female";
    selectedTypes: ("position" | "audio")[];
    trialsPerRound: number;
    trialInterval: number;
};

// 设置表单的验证模式
const settingsFormSchema = z.object({
    selectedNBack: z.number().min(1).max(GAME_CONFIG.difficulty.maxLevel),
    voiceType: z.enum(["male", "female"]),
    selectedTypes: z.array(z.enum(["position", "audio"])).min(1),
    trialsPerRound: z.number().min(10).max(100),
    trialInterval: z.number().min(1000).max(5000),
});

interface GameSettingsProps {
    settings: GameSettings;
    onSettingsChange: (settings: GameSettings) => void;
    disabled?: boolean;
}

export default function GameSettings({ settings, onSettingsChange, disabled = false }: GameSettingsProps) {
    const t = useTranslations('games.dualNBack.gameUI');
    const tMessages = useTranslations('games.dualNBack.gameMessages');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // 设置表单
    const form = useForm<z.infer<typeof settingsFormSchema>>({
        resolver: zodResolver(settingsFormSchema),
        defaultValues: {
            selectedNBack: settings.selectedNBack,
            voiceType: settings.voiceType,
            selectedTypes: settings.selectedTypes,
            trialsPerRound: settings.trialsPerRound,
            trialInterval: settings.trialInterval,
        },
    });

    // 提交表单时更新设置
    const onSubmit = (values: z.infer<typeof settingsFormSchema>) => {
        onSettingsChange(values);
        setIsSettingsOpen(false);
    };

    return (
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={disabled}
                >
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">
                        {t('settings')}
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('gameSettings')}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="selectedNBack"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className="flex items-center justify-between">
                                        {t('nBackLevel')}
                                        <span className="text-sm text-muted-foreground">
                                            {t('back', { level: field.value })}
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Slider
                                            min={1}
                                            max={GAME_CONFIG.difficulty.maxLevel}
                                            step={1}
                                            value={[field.value]}
                                            onValueChange={(vals) =>
                                                field.onChange(vals[0])
                                            }
                                            disabled={disabled}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="voiceType"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>
                                        {t('voiceType')}
                                    </FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            className="flex space-x-4"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem
                                                    value="male"
                                                    id="male"
                                                />
                                                <Label htmlFor="male">
                                                    {t('male')}
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem
                                                    value="female"
                                                    id="female"
                                                />
                                                <Label htmlFor="female">
                                                    {t('female')}
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="selectedTypes"
                            render={() => (
                                <FormItem className="space-y-3">
                                    <FormLabel>
                                        {t('trainingMode')}
                                    </FormLabel>
                                    <div className="space-y-2">
                                        {["position", "audio"].map(
                                            (type) => (
                                                <div
                                                    key={type}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Checkbox
                                                        id={`mode-${type}`}
                                                        checked={form
                                                            .watch("selectedTypes")
                                                            .includes(
                                                                type as "position" | "audio"
                                                            )}
                                                        onCheckedChange={(checked) => {
                                                            const currentTypes = form.getValues("selectedTypes");
                                                            const newTypes = checked
                                                                ? [...currentTypes, type as "position" | "audio"]
                                                                : currentTypes.filter((t) => t !== type);

                                                            if (newTypes.length === 0) {
                                                                toast(tMessages('keepOneMode'));
                                                                return;
                                                            }

                                                            form.setValue("selectedTypes", newTypes);
                                                        }}
                                                        disabled={
                                                            disabled ||
                                                            (form.watch("selectedTypes").length === 1 &&
                                                                form.watch("selectedTypes").includes(
                                                                    type as "position" | "audio"
                                                                ))
                                                        }
                                                    />
                                                    <Label htmlFor={`mode-${type}`}>
                                                        {t(`${type}`)}
                                                    </Label>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="trialsPerRound"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className="flex items-center justify-between">
                                        {t('trialsPerRound')}
                                        <span className="text-sm text-muted-foreground">
                                            {t('trials', { count: field.value })}
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Slider
                                            min={10}
                                            max={50}
                                            step={5}
                                            value={[field.value]}
                                            onValueChange={(vals) =>
                                                field.onChange(vals[0])
                                            }
                                            disabled={disabled}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="trialInterval"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className="flex items-center justify-between">
                                        {t('trialSpeed')}
                                        <span className="text-sm text-muted-foreground">
                                            {t('seconds', { seconds: (field.value / 1000).toFixed(1) })}
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Slider
                                            min={1500}
                                            max={4000}
                                            step={250}
                                            value={[field.value]}
                                            onValueChange={(vals) =>
                                                field.onChange(vals[0])
                                            }
                                            disabled={disabled}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={disabled}
                            >
                                {t('saveChanges')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
} 