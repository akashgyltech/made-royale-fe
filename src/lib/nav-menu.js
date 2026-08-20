// Builds live "Shop" / "Collections" mega-menu content from real category data,
// replacing the hardcoded demo submenus in src/data/menu-data.js. "Quick Links" stays
// hand-authored here since it's real site structure, not admin-managed catalog data.
export function buildLiveMegaMenus({ categories = [], rooms = [], collections = [] }) {
    return {
        shop: {
            first: {
                title: 'Shop by Category',
                submenus: categories.map((c) => ({ title: c.name, link: `/category/${c.slug}` })),
            },
            second: {
                title: 'Shop by Room',
                submenus: [
                    ...rooms.map((r) => ({ title: r.name, link: `/room/${r.slug}` })),
                    { title: 'View All Furniture', link: '/shop' },
                ],
            },
        },
        collections: {
            first: {
                title: 'Signature Collections',
                submenus: collections.map((c) => ({ title: c.name, link: `/collection/${c.slug}` })),
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
    };
}

// Attaches the live mega-menu content onto whichever already-resolved top-level menu
// items are titled "Shop" / "Collections" — never invents a new item if the admin
// removed it from the CMS link list, only replaces/adds pages_mega_menu on a match.
export function attachLiveMegaMenus(menuItems, liveMegaMenus) {
    return menuItems.map((item) => {
        if (item.title === 'Shop') return { ...item, pages_mega_menu: liveMegaMenus.shop };
        if (item.title === 'Collections') return { ...item, pages_mega_menu: liveMegaMenus.collections };
        return item;
    });
}
