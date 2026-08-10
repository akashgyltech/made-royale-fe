"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "@/components/svg";

// Small client island so the blog listing page (src/app/(blog)/blog/page.tsx) can stay an
// async Server Component that fetches via cmsApi — only this input needs interactivity.
export default function BlogSearchForm({ initialSearch }: { initialSearch?: string }) {
  const [term, setTerm] = useState(initialSearch ?? "");
  const router = useRouter();

  const submit = () => {
    const q = term.trim();
    router.push(q ? `/blog?search=${encodeURIComponent(q)}` : "/blog");
  };

  return (
    <div className="tp-inner-header-2-search p-relative" style={{ maxWidth: 320 }}>
      <input
        type="text"
        placeholder="Search the Journal"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
      />
      <span onClick={submit} style={{ cursor: "pointer" }}><Search /></span>
    </div>
  );
}
