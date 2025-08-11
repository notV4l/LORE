import { stringCairoEnum } from "@/editor/lib/schemas";
import {
  type Condition,
  componentType,
  operator,
} from "@/lib/dojo_bindings/typescript/models.gen";
import { useEffect, useState } from "react";
import { syncPropertyRegistry } from "../../data/editor.data";
import {
  CairoEnumSelect,
  decodeFromFelt,
  encodeToFelt,
  formatKeyAsDecimal,
  Input,
  Select,
} from "../FormComponents";
import { TextAreaStringArray } from "../TextAreaStringArray";
import type { ComponentInspector } from "./useInspector";
import { useInspector } from "./useInspector";

export const ConditionInspector: ComponentInspector<Condition> = ({
  componentObject,
  ...props
}) => {
  const { handleInputChange, Inspector } = useInspector<Condition>({
    componentObject,
    ...props,
    inputHandlers: {
      name: (e, updatedObject) => {
        updatedObject.name = e.target.value as unknown as string;
      },
      target: (e, updatedObject) => {
        updatedObject.target = e.target.value;
      },
      component: (e, updatedObject) => {
        updatedObject.component = stringCairoEnum(e.target.value);
      },
      property: (e, updatedObject) => {
        updatedObject.property = e.target.value;
      },
      operator: (e, updatedObject) => {
        updatedObject.operator = stringCairoEnum(e.target.value);
      },
      value: (e, updatedObject) => {
        let value = e.target.value as unknown as string[];
        let encodedValues = value.map((v) => encodeToFelt(v));
        updatedObject.value = encodedValues;
      },
    },
  });

  const [propertyNames, setPropertyNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      if (!componentObject?.component) return;
      try {
        const properties = await syncPropertyRegistry(
          componentObject.component
        );
        setPropertyNames(properties!);
      } catch (error) {
        console.error("Failed to sync property registry:", error);
      }
    };

    fetchProperties();
  }, [componentObject?.component]);

  // Property options for dropdown
  const propertyOptions = propertyNames.map((name) => ({
    value: name,
    label: name,
  }));

  if (!componentObject) return <div>Condition not found</div>;
  const excludeComponent = [
    "Entity",
    "Action",
    "Trigger",
    "Condition",
    "Effect",
  ];

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
        id="target"
        value={componentObject.target.toString()}
        onChange={handleInputChange(undefined)}
      />
      <CairoEnumSelect
        id="component"
        onChange={handleInputChange(undefined)}
        value={componentObject.component}
        enum={componentType.filter((x) => !excludeComponent.includes(x))}
      />
      <Select
        id="property"
        value={componentObject.property.toString()}
        onChange={handleInputChange(undefined)}
        options={propertyOptions}
      />
      <CairoEnumSelect
        id="operator"
        onChange={handleInputChange(undefined)}
        value={componentObject.operator}
        enum={operator}
      />
      <TextAreaStringArray
        id="value"
        value={componentObject.value.map((v) => decodeFromFelt(v.toString()))}
        onChange={handleInputChange(undefined)}
        rows={1}
        columns={1}
      />
    </Inspector>
  );
};
