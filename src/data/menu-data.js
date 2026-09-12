// "Shop" and "Collections" below intentionally carry no static pages_mega_menu — their
// mega-menu columns are always attached live from real category data at render time
// (see src/lib/nav-menu.js, wired in src/layouts/headers/header-six.jsx), so this is
// only ever seen as a flash-of-unfetched-content fallback before that resolves.
const menu_data = [
    { id: 1, title: 'Home', link: '/' },
    { id: 2, title: 'Shop', link: '/shop' },
    { id: 3, title: 'Collections', link: '/shop' },
    { id: 4, title: 'Journal', link: '/blog' },
    { id: 5, title: 'Contact', link: '/contact' },
];
export default menu_data;
export const mobile_menu_data = [
    { id: 1, title: 'Home', link: '/', dropdown_menus: [{ title: 'Home', link: '/' }, { title: 'About Us', link: '/about-us' }] },
    {
        id: 2, title: 'Shop by Category', link: '/shop',
        dropdown_menus: [
            { title: 'Sofas & Seating', link: '/category/sofas' },
            { title: 'Beds & Bedroom', link: '/category/beds' },
            { title: 'Dining', link: '/category/dining' },
            { title: 'Wardrobes', link: '/category/wardrobes' },
            { title: 'Chairs & Accent', link: '/category/chairs' },
            { title: 'Tables', link: '/category/tables' },
            { title: 'Storage & TV', link: '/category/storage' },
            { title: 'Decor & Lighting', link: '/category/decor' },
            { title: 'Bulk & Trade Enquiry', link: '/bulk-enquiry' },
            { title: 'View All Furniture', link: '/shop' },
        ],
    },
    {
        id: 3, title: 'Shop by Room', link: '/shop',
        dropdown_menus: [
            { title: 'Living Room', link: '/room/living-room' },
            { title: 'Bedroom', link: '/room/bedroom' },
            { title: 'Dining Room', link: '/room/dining-room' },
            { title: 'Study & Office', link: '/room/study-office' },
            { title: 'View All Furniture', link: '/shop' },
        ],
    },
    {
        id: 7, title: 'Collections', link: '/shop',
        dropdown_menus: [
            { title: 'Vintage Collection', link: '/collection/vintage' },
            { title: 'Contemporary Royale', link: '/collection/contemporary-royale' },
            { title: 'Heritage Collection', link: '/collection/heritage' },
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
