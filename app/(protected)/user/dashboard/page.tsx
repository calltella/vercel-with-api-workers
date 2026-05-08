// app/(protected)/user/dashboard/page.tsx

import { DraftListView } from "@/src/features/user/components/DraftListView"
import { getDraftAplineList } from "@/src/service/aplineSub.service";


export default async function Page() {

  const draftResults = await getDraftAplineList();
  console.log(`draftResults: ${JSON.stringify(draftResults)}`)
  return (
    <>
      {/* トップナビ(layout.tsx) */}
      <div className="flex flex-col gap-8">
        <DraftListView items={draftResults} />
      </div>
    </>
  );
}
