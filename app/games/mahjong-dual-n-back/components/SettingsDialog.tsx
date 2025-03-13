import { useState, useEffect, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Settings } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { GAME_CONFIG } from "../config";

// Define the GameSettings type
export type GameSettings = {
    selectedNBack: number;
    voiceType: "male" | "female" | "chinese_female";
    selectedTypes: ("position" | "audio")[];
    trialsPerRound: number;
    trialInterval: number;
};

// Define the form schema
const settingsFormSchema = z.object({
    selectedNBack: z.number().min(1).max(9),
    voiceType: z.enum(["male", "female", "chinese_female"]),
    selectedTypes: z.array(z.enum(["position", "audio"])).min(1),
    trialsPerRound: z.number().min(10).max(50),
    trialInterval: z.number().min(1000).max(8000),
});

type SettingsDialogProps = {
    settings: GameSettings;
    updateSettings: (updater: (prev: GameSettings) => GameSettings) => void;
    isDisabled: boolean;
};

export default function SettingsDialog({
    settings,
    updateSettings,
    isDisabled,
}: SettingsDialogProps) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Create the form
    const form = useForm<z.infer<typeof settingsFormSchema>>({
        resolver: zodResolver(settingsFormSchema),
        defaultValues: settings,
    });

    // Handle form submission
    const onSubmit = useCallback(
        (values: z.infer<typeof settingsFormSchema>) => {
            updateSettings(() => values);
            setIsSettingsOpen(false);
        },
        [updateSettings]
    );

    // Reset form when dialog opens
    useEffect(() => {
        if (isSettingsOpen) {
            form.reset(settings);
        }
    }, [isSettingsOpen, form, settings]);

    return (
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={isDisabled}
                >
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">
                        Settings
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Game Settings</DialogTitle>
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
                                        N-Back Level
                                        <span className="text-sm text-muted-foreground">
                                            {field.value}-Back
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Slider
                                            min={1}
                                            max={
                                                GAME_CONFIG
                                                    .difficulty
                                                    .maxLevel
                                            }
                                            step={1}
                                            value={[field.value]}
                                            onValueChange={(vals) =>
                                                field.onChange(
                                                    vals[0]
                                                )
                                            }
                                            disabled={isDisabled}
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
                                        Voice Type
                                    </FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={
                                                field.onChange
                                            }
                                            value={field.value}
                                            className="flex flex-col space-y-2"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem
                                                    value="male"
                                                    id="male"
                                                />
                                                <Label htmlFor="male">
                                                    English Male
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem
                                                    value="female"
                                                    id="female"
                                                />
                                                <Label htmlFor="female">
                                                    English Female
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem
                                                    value="chinese_female"
                                                    id="chinese_female"
                                                />
                                                <Label htmlFor="chinese_female">
                                                    Chinese Female
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
                                        Training Mode
                                    </FormLabel>
                                    <div className="space-y-2">
                                        {["position", "audio"].map(
                                            (type) => (
                                                <div
                                                    key={type}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <FormField
                                                        control={
                                                            form.control
                                                        }
                                                        name="selectedTypes"
                                                        render={({
                                                            field,
                                                        }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Checkbox
                                                                        id={`mode-${type}`}
                                                                        checked={field.value.includes(
                                                                            type as "position" | "audio"
                                                                        )}
                                                                        onCheckedChange={(
                                                                            checked
                                                                        ) => {
                                                                            const updatedTypes =
                                                                                checked
                                                                                    ? [
                                                                                          ...field.value,
                                                                                          type as "position" | "audio",
                                                                                      ]
                                                                                    : field.value.filter(
                                                                                          (
                                                                                              t
                                                                                          ) =>
                                                                                              t !==
                                                                                              type
                                                                                      );
                                                                            field.onChange(
                                                                                updatedTypes
                                                                            );
                                                                        }}
                                                                        disabled={
                                                                            isDisabled ||
                                                                            (field.value.length ===
                                                                                1 &&
                                                                                field.value.includes(
                                                                                    type as "position" | "audio"
                                                                                ))
                                                                        }
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <Label
                                                        htmlFor={`mode-${type}`}
                                                    >
                                                        {type === "position" 
                                                            ? "Tile Match" 
                                                            : type === "audio"
                                                            ? "Sound Match"
                                                            : type
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                              type.slice(1)
                                                        }
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
                                        Trials Per Round
                                        <span className="text-sm text-muted-foreground">
                                            {field.value} trials
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Slider
                                            min={10}
                                            max={50}
                                            step={5}
                                            value={[field.value]}
                                            onValueChange={(vals) =>
                                                field.onChange(
                                                    vals[0]
                                                )
                                            }
                                            disabled={isDisabled}
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
                                        Trial Speed
                                        <span className="text-sm text-muted-foreground">
                                            {(
                                                field.value / 1000
                                            ).toFixed(1)}
                                            s
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Slider
                                            min={1000}
                                            max={8000}
                                            step={500}
                                            value={[field.value]}
                                            onValueChange={(vals) =>
                                                field.onChange(
                                                    vals[0]
                                                )
                                            }
                                            disabled={isDisabled}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={isDisabled}
                            >
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
} 