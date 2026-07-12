import { IMenuDT } from "@/types/menu-d-t";

const menu_data: IMenuDT[] = [
  { id: 1, title: 'Home', link: '/' },
  {
    id: 2, title: 'Shop', link: '/shop',
    pages_mega_menu: {
      first: {
        title: 'Shop by Category',
        submenus: [
          { title: 'Sofas & Seating', link: '/shop?category=sofas' },
          { title: 'Beds & Bedroom', link: '/shop?category=beds' },
          { title: 'Dining', link: '/shop?category=dining' },
          { title: 'Wardrobes', link: '/shop?category=wardrobes' },
          { title: 'Chairs & Accent', link: '/shop?category=chairs' },
          { title: 'Tables', link: '/shop?category=tables' },
          { title: 'Storage & TV', link: '/shop?category=storage' },
          { title: 'Decor & Lighting', link: '/shop?category=decor' },
        ],
      },
      second: {
        title: 'Shop by Room',
        submenus: [
          { title: 'Living Room', link: '/shop?category=sofas' },
          { title: 'Bedroom', link: '/shop?category=beds' },
          { title: 'Dining Room', link: '/shop?category=dining' },
          { title: 'Study & Office', link: '/shop?sub=study-tables' },
          { title: 'Entertainment', link: '/shop?sub=tv-units' },
          { title: 'View All Furniture', link: '/shop' },
        ],
      },
    },
  },
  {
    id: 3, title: 'Collections', link: '/shop',
    pages_mega_menu: {
      first: {
        title: 'Signature Collections',
        submenus: [
          { title: 'Maharaja Collection', link: '/shop?collection=Maharaja' },
          { title: 'Vintage Collection', link: '/shop?collection=Vintage' },
          { title: 'Contemporary Royale', link: '/shop?collection=Contemporary Royale' },
          { title: 'Heritage Collection', link: '/shop?collection=Heritage' },
        ],
      },
      second: {
        title: 'Quick Links',
        submenus: [
          { title: 'Bestsellers', link: '/shop?sort=rating' },
          { title: 'New Arrivals', link: '/shop?sort=newest' },
          { title: 'Track Order', link: '/track-order' },
          { title: 'My Wishlist', link: '/wishlist' },
          { title: 'My Account', link: '/account' },
        ],
      },
    },
  },
  { id: 4, title: 'Journal', link: '/blog' },
  { id: 5, title: 'Contact', link: '/contact' },
];

export default menu_data;

export const mobile_menu_data: { id: number; title: string; link: string; dropdown_menus: { title: string; link: string }[] }[] = [
  { id: 1, title: 'Home', link: '/', dropdown_menus: [{ title: 'Home', link: '/' }, { title: 'About Us', link: '/about-us' }] },
  {
    id: 2, title: 'Shop by Category', link: '/shop',
    dropdown_menus: [
      { title: 'Sofas & Seating', link: '/shop?category=sofas' },
      { title: 'Beds & Bedroom', link: '/shop?category=beds' },
      { title: 'Dining', link: '/shop?category=dining' },
      { title: 'Wardrobes', link: '/shop?category=wardrobes' },
      { title: 'Chairs & Accent', link: '/shop?category=chairs' },
      { title: 'Tables', link: '/shop?category=tables' },
      { title: 'Storage & TV', link: '/shop?category=storage' },
      { title: 'Decor & Lighting', link: '/shop?category=decor' },
      { title: 'View All Furniture', link: '/shop' },
    ],
  },
  {
    id: 3, title: 'Collections', link: '/shop',
    dropdown_menus: [
      { title: 'Maharaja Collection', link: '/shop?collection=Maharaja' },
      { title: 'Vintage Collection', link: '/shop?collection=Vintage' },
      { title: 'Contemporary Royale', link: '/shop?collection=Contemporary Royale' },
      { title: 'Heritage Collection', link: '/shop?collection=Heritage' },
    ],
  },
  {
    id: 4, title: 'My Account', link: '/account',
    dropdown_menus: [
      { title: 'My Account', link: '/account' },
      { title: 'My Orders', link: '/account?tab=orders' },
      { title: 'Track Order', link: '/track-order' },
      { title: 'Wishlist', link: '/wishlist' },
      { title: 'Cart', link: '/cart' },
    ],
  },
  { id: 5, title: 'Journal', link: '/blog', dropdown_menus: [{ title: 'The Journal', link: '/blog' }] },
  { id: 6, title: 'Contact', link: '/contact', dropdown_menus: [{ title: 'Contact', link: '/contact' }] },
];
