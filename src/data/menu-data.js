const menu_data = [
    { id: 1, title: 'Home', link: '/' },
    {
        id: 2, title: 'Shop', link: '/shop',
        pages_mega_menu: {
            first: {
                title: 'Shop by Category',
                submenus: [
                    { title: 'Sofas & Seating', link: '/category/sofas' },
                    { title: 'Beds & Bedroom', link: '/category/beds' },
                    { title: 'Dining', link: '/category/dining' },
                    { title: 'Wardrobes', link: '/category/wardrobes' },
                    { title: 'Chairs & Accent', link: '/category/chairs' },
                    { title: 'Tables', link: '/category/tables' },
                    { title: 'Storage & TV', link: '/category/storage' },
                    { title: 'Decor & Lighting', link: '/category/decor' },
                ],
            },
            second: {
                title: 'Shop by Room',
                submenus: [
                    { title: 'Living Room', link: '/room/living-room' },
                    { title: 'Bedroom', link: '/room/bedroom' },
                    { title: 'Dining Room', link: '/room/dining-room' },
                    { title: 'Study & Office', link: '/room/study-office' },
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
                    { title: 'Maharaja Collection', link: '/collection/maharaja' },
                    { title: 'Vintage Collection', link: '/collection/vintage' },
                    { title: 'Contemporary Royale', link: '/collection/contemporary-royale' },
                    { title: 'Heritage Collection', link: '/collection/heritage' },
                ],
            },
            second: {
                title: 'Quick Links',
                submenus: [
                    { title: 'Bestsellers', link: '/shop?sort=rating' },
                    { title: 'New Arrivals', link: '/shop?sort=newest' },
                    { title: 'Bulk & Trade Enquiry', link: '/bulk-enquiry' },
                    { title: 'Track Order', link: '/track-order' },
                    { title: 'My Account', link: '/account' },
                ],
            },
        },
    },
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
            { title: 'Maharaja Collection', link: '/collection/maharaja' },
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
