import { Reveal } from "@/components/ui/reveal";
import { FormSection } from "@/components/sections/contact/FormSection";
import { WorkflowSection } from "@/components/sections/contact/WorkflowSection";
import { MapSection } from "@/components/sections/contact/MapSection";

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      <Reveal>
        <FormSection />
      </Reveal>
      <Reveal>
        <WorkflowSection />
      </Reveal>
      <Reveal>
        <MapSection />
      </Reveal>
    </div>
  );
}
