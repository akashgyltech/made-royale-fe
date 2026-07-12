"use client";
import Wrapper from "@/layouts/wrapper";
import FooterSix from "@/layouts/footers/footer-six";
import HeaderSix from "@/layouts/headers/header-six";
import RoomLanding from "@/components/room/room-landing";

const RoomMain = ({ slug }: { slug: string }) => {
  return (
    <Wrapper>
      <HeaderSix transparent />
      <main>
        <RoomLanding slug={slug} />
      </main>
      <FooterSix />
    </Wrapper>
  );
};

export default RoomMain;
