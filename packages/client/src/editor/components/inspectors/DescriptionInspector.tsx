import { type DescriptionText } from "@/lib/dojo_bindings/typescript/models.gen";
import { BigNumberish } from "starknet";
import { Input } from "../FormComponents";
import type { ComponentInspector } from "./useInspector";
import { useInspector } from "./useInspector";

export const DescriptionTextInspector: ComponentInspector<DescriptionText> = ({
  componentObject,
  ...props
}) => {
  const { handleInputChange, Inspector } = useInspector<DescriptionText>({
    componentObject,
    ...props,
    inputHandlers: {
      description_inst: (e, updatedObject) => {
        updatedObject.key = e.target.value as unknown as BigNumberish;
      },
      description_key: (e, updatedObject) => {
        updatedObject.key = e.target.value as unknown as BigNumberish;
      },
      description_text: (e, updatedObject) => {
        updatedObject.text = e.target.value as unknown as string;
      },
    },
  });

  if (!componentObject) return <div>Description not found</div>;

  // console.log(componentObject);
  return (
    <>
      {componentObject.map((componentObj, idx) => {
        return (
          <Inspector>
            <Input
              id="description_inst"
              value={componentObj.inst.toString()}
              onChange={handleInputChange(idx)}
              readOnly={true}
            />
            <Input
              id="description_key"
              value={componentObj.key.toString()}
              onChange={handleInputChange(idx)}
            />
            <Input
              id="description_text"
              value={componentObj.text}
              onChange={handleInputChange(idx)}
            />
          </Inspector>
        );
      })}
    </>
  );
};
