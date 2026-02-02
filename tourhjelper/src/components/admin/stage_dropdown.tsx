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
      label="Valgt Etappe"
      mt={"20px"}
      size="sm"
      styles={{
        input: {
          backgroundColor: "var(--light-grey)",
          color: "#ffffff",
          borderColor: "var(--highlight-grey)",
          width: "100%",
          fontWeight: "bold",
        },
        root: {
          width: "100%",
          maxWidth: "400px",
        },
        label: {
          color: "#ffffff",
          marginBottom: "4px",
          fontWeight: "400",
        },
      }}
    />
  );
};

export default StageDropdown;
