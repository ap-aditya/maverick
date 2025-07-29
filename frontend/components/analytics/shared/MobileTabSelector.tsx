import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MobileTabSelectorProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  tabs: Array<{ value: string; label: string }>;
}

export const MobileTabSelector = ({
  currentTab,
  onTabChange,
  tabs,
}: MobileTabSelectorProps) => {
  return (
    <div className="md:hidden w-full mb-6">
      <Select value={currentTab} onValueChange={onTabChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select view" />
        </SelectTrigger>
        <SelectContent>
          {tabs.map((tab) => (
            <SelectItem key={tab.value} value={tab.value}>
              {tab.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
