import Wrapper from "@/layouts/wrapper";
import FooterSix from "@/layouts/footers/footer-six";
import HeaderSix from "@/layouts/headers/header-six";
import RoomLanding from "@/components/room/room-landing";
import type { Category, Product, Room } from "@/data/catalog";

const RoomMain = ({ room, products, cats }: { room: Room; products: Product[]; cats: Category[] }) => {
  return (
    <Wrapper>
      <HeaderSix transparent />
      <main>
        <RoomLanding room={room} products={products} cats={cats} />
      </main>
      <FooterSix />
    </Wrapper>
  );
};

export default RoomMain;
