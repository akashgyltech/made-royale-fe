import { IMenuDT } from "@/types/menu-d-t";


const menu_data:IMenuDT[] = [
  {
    id: 1,
    title: 'Home',
    link: '/'
  },
  {
    id: 2,
    title: 'Shop',
    link: '#',
    pages_mega_menu: {
      first: {
        title: 'Shop by Category',
        submenus: [
          { title: 'Sofas', link: '/about-us' },
          { title: 'Beds', link: '/faq' },
          { title: 'Dining', link: '/brand' },
          { title: 'TV Units', link: '/register' },
          { title: 'Coffee Tables', link: '/service' },
          { title: 'Cabinets', link: '/login' },
          { title: 'Wardrobes', link: '/service-details' },
          { title: 'Study Tables', link: '/error' },
          { title: 'Chairs', link: '/error' },
          { title: 'Book shelves', link: '/error' },
          { title: 'Kitchen Cabinets', link: '/error' },
          { title: 'Shoe Rack', link: '/error' }
        ]
      },
      second: {
        title: 'Shop by Room',
        submenus: [
          { title: 'Living', link: '/shop' },
          { title: 'Bedroom', link: '/shop-details-2' },
          { title: 'Outdoor', link: '/account' },
          { title: 'Kitchen', link: '/cart' },
          { title: 'Dining', link: '/checkout' },
          { title: 'Study', link: '/wishlist' },
        ]
      },

    }
  },
   {
    id: 3,
    title: 'Luxe',
    link: '#',
    pages_mega_menu: {
      first: {
        title: 'Maharaja Collection',
        submenus: [
          { title: 'Sofas', link: '/about-us' },
          { title: 'Beds', link: '/faq' },
          { title: 'Dining', link: '/brand' },
          { title: 'Wardrobes', link: '/service-details' },
          { title: 'Study Tables', link: '/error' },
          { title: 'Chairs', link: '/error' },
          { title: 'Book shelves', link: '/error' }
        ]
      },
      second: {
        title: 'Vintage Collection',
        submenus: [
          { title: 'Chairs', link: '/shop' },
          { title: 'Sofas', link: '/shop-details-2' },
          { title: 'Beds', link: '/account' },
          { title: 'Outdoors', link: '/cart' },
          { title: 'Dining', link: '/checkout' },
          { title: 'Study', link: '/wishlist' },
        ]
      },

    }
  },
  {
    id: 5,
    title: 'Contact',
    link: '/contact'
  }
];



export default menu_data;


export const mobile_menu_data:{
  id: number;
  title: string;
  link: string;
  dropdown_menus: {
      title: string;
      link: string;
  }[];
}[] = [
  {
    id:1,
    title: 'Home',
    link: '/',
    dropdown_menus:[
      { title: 'MAIN HOME', link: '/'},
      { title: 'Fashion STUDIO', link: '/home-2'},
      { title: 'CREATIVE AGENCY', link: '/home-3'},
      { title: 'Digital Agency', link: '/home-4'},
      { title: 'DESIGN STUDIO', link: '/home-5'},
      { title: 'Minimal Shop', link: '/home-6'}
    ]
  },
  {
    id: 2,
    title: 'Pages',
    link: '#',
    dropdown_menus:[
      { title: 'ABOUT US', link: '/about-us' },
      { title: 'FAQ Page', link: '/faq' },
      { title: 'Team Page', link: '/team' },
      { title: 'OUR CLIENTS', link: '/brand' },
      { title: 'Team Details', link: '/team-details' },
      { title: 'Register', link: '/register' },
      { title: 'OUR SERVICES', link: '/service' },
      { title: 'LogIn', link: '/login' },
      { title: 'SERVICES DETAILS', link: '/service-details' },
      { title: 'ERROR PAGE', link: '/error' },
      { title: 'Shop Page', link: '/shop' },
      { title: 'Shop Details Two', link: '/shop-details-2' },
      { title: 'my account', link: '/account' },
      { title: 'Cart', link: '/cart' },
      { title: 'Checkout', link: '/checkout' },
      { title: 'Wishlist', link: '/wishlist' },
    ]
  },
  {
    id: 3,
    title: 'Portfolio',
    link: '/portfolio-standard',
    dropdown_menus:[
      { title: 'Standard', link: '/portfolio-standard' },
      { title: 'two-columns', link: '/portfolio-grid-col-2' },
      { title: 'three-columns', link: '/portfolio-grid-col-3' },
      { title: 'three-columns Wide', link: '/portfolio-grid-col-3-fullwidth' },
      { title: 'four-columns', link: '/portfolio-grid-col-4' },
      { title: 'four-columns Wide', link: '/portfolio-grid-col-4-fullwidth' },
      { title: 'Creative', link: '/portfolio-showcase-details-2' },
      { title: 'images Small', link: '/portfolio-details-1' },
      { title: 'Sliding', link: '/portfolio-details-2' },
      { title: 'Video', link: '/portfolio-details-video' },
      { title: 'CUSTOM LIGHT', link: '/portfolio-custom-light' },
      { title: 'Gallery', link: '/portfolio-showcase-details' }
    ]
  },
  {
    id: 4,
    title: 'Blog',
    link: '/blog-modern',
    dropdown_menus:[
      { title: 'Modern', link: '/blog-modern' },
      { title: 'Classic Sidebar', link: '/blog-classic' },
      { title: 'Post Single', link: '/blog-details/1' }
    ]
  },
  {
    id: 5,
    title: 'Contact',
    link: '/contact',
    dropdown_menus:[
      { title: 'Contact', link: '/contact' }
    ]
  }
]