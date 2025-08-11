import { type Action } from "@/lib/dojo_bindings/typescript/models.gen";
import { type ChangeEvent } from "react";
import { BigNumberish } from "starknet";
import { useEditorData } from "../../data/editor.data";
import { ConditionSelector } from "../ConditionSelector";
import { EffectSelector } from "../EffectsSelector";
import {
  formatKeyAsDecimal,
  Input,
  TagInput,
  TextAreaArray,
  Toggle,
} from "../FormComponents";
import { TriggerSelector } from "../TriggerSelector";
import type { ComponentInspector } from "./useInspector";
import { useInspector } from "./useInspector";

export const ActionInspector: ComponentInspector<Action> = ({
  componentObject,
  ...props
}) => {
  const { handleInputChange, Inspector } = useInspector<Action>({
    componentObject,
    ...props,
    inputHandlers: {
      name: (e, updatedObject) => {
        updatedObject.name = e.target.value;
      },
      description: (e, updatedObject) => {
        updatedObject.description = e.target.value;
      },
      is_enabled: (e, updatedObject) => {
        const event = e as ChangeEvent<HTMLInputElement>;
        updatedObject.is_enabled = event.target.checked;
      },
      triggers: (e, updatedObject) => {
        const val = e.target.value as unknown as Array<[string, BigNumberish]>;
        updatedObject.trigger = val
          .filter(
            ([a, b]) => a !== "__placeholder__" && b !== "__placeholder__"
          )
          .map(([a, b]) => [a, b]) as [BigNumberish, BigNumberish][];
      },
      conditions: (e, updatedObject) => {
        const val = e.target.value as unknown as Array<[string, BigNumberish]>;
        updatedObject.conditions = val
          .filter(
            ([a, b]) => a !== "__placeholder__" && b !== "__placeholder__"
          )
          .map(([a, b]) => [a, b]) as [BigNumberish, BigNumberish][];
      },
      effects: (e, updatedObject) => {
        const val = e.target.value as unknown as Array<[string, BigNumberish]>;
        updatedObject.effects = val
          .filter(
            ([a, b]) => a !== "__placeholder__" && b !== "__placeholder__"
          )
          .map(([a, b]) => [a, b]) as [BigNumberish, BigNumberish][];
      },
      tags: (e, updatedObject) => {
        const val = e.target.value;
        let entries: string[];

        if (Array.isArray(val)) {
          entries = val
            .map((line) => line.trim())
            .filter((line) => line !== "");
        } else if (typeof val === "string") {
          entries = val
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line !== "");
        } else {
          entries = [];
        }

        updatedObject.tags = entries;
      },
      executed: (e, updatedObject) => {
        updatedObject.executed = e.target.checked;
      },
      failing_response: (e, updatedObject) => {
        const val = e.target.value as unknown as string[];
        updatedObject.failing_response = val;
      },
      success_response: (e, updatedObject) => {
        const val = e.target.value as unknown as string[];
        updatedObject.success_response = val;
      },
    },
  });
  if (!componentObject) return <div>Action not found</div>;

  return (
    <Inspector>
      <Input
        id="inst"
        value={componentObject.inst.toString()}
        onChange={handleInputChange(undefined)}
        readOnly={true}
      />
      <Input
        id="key"
        value={formatKeyAsDecimal(componentObject.key)}
        onChange={handleInputChange(undefined)}
        readOnly={true}
      />
      <Input
        id="name"
        value={componentObject.name}
        onChange={handleInputChange(undefined)}
      />
      <Input
        id="description"
        value={componentObject.description}
        onChange={handleInputChange(undefined)}
      />
      <Toggle
        id="is_enabled"
        value={componentObject.is_enabled}
        onChange={handleInputChange(undefined)}
      />
      <TriggerSelector
        id="triggers"
        value={componentObject.trigger.map(([a, b]) => [a.toString(), b])}
        onChange={handleInputChange(undefined)}
        dataPool={useEditorData().dataPool}
      />
      <ConditionSelector
        id="conditions"
        value={componentObject.conditions.map(([a, b]) => [a.toString(), b])}
        onChange={handleInputChange(undefined)}
        dataPool={useEditorData().dataPool}
      />
      <EffectSelector
        id="effects"
        value={componentObject.effects.map(([a, b]) => [a.toString(), b])}
        onChange={handleInputChange(undefined)}
        dataPool={useEditorData().dataPool}
      />
      <TextAreaArray
        id="failing_response"
        value={componentObject.failing_response}
        onChange={handleInputChange(undefined)}
        rows={1}
      />
      <TextAreaArray
        id="success_response"
        value={componentObject.success_response}
        onChange={handleInputChange(undefined)}
        rows={1}
      />
      <TagInput
        id="tags"
        value={componentObject.tags?.join(",") || ""}
        onChange={handleInputChange(undefined)}
      />
      <Toggle
        id="executed"
        value={componentObject.executed}
        onChange={handleInputChange(undefined)}
      />
    </Inspector>
  );
};
