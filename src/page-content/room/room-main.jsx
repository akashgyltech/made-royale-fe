import Wrapper from "@/layouts/wrapper";
import FooterSix from "@/layouts/footers/footer-six";
import HeaderSix from "@/layouts/headers/header-six";
import RoomLanding from "@/components/room/room-landing";
const RoomMain = ({ room, products, otherRooms }) => {
    return (<Wrapper>
      <HeaderSix transparent/>
      <main>
        <RoomLanding room={room} products={products} otherRooms={otherRooms}/>
      </main>
      <FooterSix />
    </Wrapper>);
};
export default RoomMain;
