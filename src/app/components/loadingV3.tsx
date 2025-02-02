import { Loader } from "lucide-react";
import {
  DynamicContainer,
  DynamicIsland,
  DynamicIslandProvider,
  DynamicTitle,
} from "./dynamic-island";

// define type for the dynamic island
type DynamicIslandProps = {
  className?: string;
};

export default function LoadingV3({ className }: DynamicIslandProps) {
  return (
    <DynamicIslandProvider initialSize={"default"}>
      <div className={className}>
        <DynamicIsland id="dynamic-blob">
          <DynamicContainer className="flex items-center justify-center h-full w-full">
            <div className="relative  flex w-full items-center justify-between gap-6 px-4">
              <Loader className="animate-spin h-12 w-12  text-yellow-300 min-w-[20px]" />
              <DynamicTitle className="my-auto text-2xl font-black tracking-tighter text-white ">
                loading
              </DynamicTitle>
            </div>
          </DynamicContainer>
        </DynamicIsland>
      </div>
    </DynamicIslandProvider>
  );
}
