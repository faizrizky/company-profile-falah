import { studioDocumentPage } from "@/app/studio/document-page";

export const dynamic = "force-dynamic";

export default function Page(props: Parameters<typeof studioDocumentPage>[1]) {
  return studioDocumentPage("products", props);
}
