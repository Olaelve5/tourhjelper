import { NativeSelect } from "@mantine/core";

interface StageDropdownProps {
  selectedStage: number;
  setSelectedStage: (stage: number) => void;
}

const StageDropdown = ({
  selectedStage,
  setSelectedStage,
}: StageDropdownProps) => {
  return (
    <NativeSelect
      value={selectedStage}
      onChange={(e) => setSelectedStage(Number(e.currentTarget.value))}
      data={Array.from({ length: 21 }, (_, i) => String(i + 1))}
      radius={"md"}
      label="Selected Stage"
      size="md"
      w={300}
      styles={{
        input: {
          backgroundColor: "var(--light-grey)",
          color: "#ffffff",
          borderColor: "var(--highlight-grey)",
        },
      }}
    />
  );
};

export default StageDropdown;
